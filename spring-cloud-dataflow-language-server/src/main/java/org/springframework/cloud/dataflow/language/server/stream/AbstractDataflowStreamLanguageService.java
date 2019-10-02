/*
 * Copyright 2019 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.springframework.cloud.dataflow.language.server.stream;

import java.util.ArrayList;
import java.util.List;

import org.springframework.cloud.dataflow.core.dsl.ParseException;
import org.springframework.cloud.dataflow.core.dsl.StreamNode;
import org.springframework.cloud.dataflow.core.dsl.StreamParser;
import org.springframework.cloud.dataflow.language.server.DataflowLanguages;
import org.springframework.dsl.document.Document;
import org.springframework.dsl.document.DocumentText;
import org.springframework.dsl.domain.Position;
import org.springframework.dsl.domain.Range;
import org.springframework.dsl.service.AbstractDslService;
import org.springframework.dsl.service.reconcile.DefaultReconcileProblem;
import org.springframework.dsl.service.reconcile.ProblemSeverity;
import org.springframework.dsl.service.reconcile.ProblemType;
import org.springframework.dsl.service.reconcile.ReconcileProblem;

import reactor.core.publisher.Flux;

public abstract class AbstractDataflowStreamLanguageService extends AbstractDslService {

	private static final DocumentText envPrefix = DocumentText.from("@env");
	private static final DocumentText namePrefix = DocumentText.from("@name");
	private static final DocumentText descPrefix = DocumentText.from("@desc");

	public AbstractDataflowStreamLanguageService() {
		super(DataflowLanguages.LANGUAGE_STREAM);
	}

	protected static class ErrorProblemType implements ProblemType {

		private final String code;

		ErrorProblemType(String code) {
			this.code = code;
		}

		@Override
		public ProblemSeverity getSeverity() {
			return ProblemSeverity.ERROR;
		}

		@Override
		public String getCode() {
			return code;
		}
	}

	protected Flux<StreamItem> parse(Document document) {
		return Flux.<StreamItem, StreamItem>generate(() -> null, (previous, sink) -> {
			StreamItem next = parseNextStream(document, previous);
			if (next != null) {
				sink.next(next);
			} else {
				sink.complete();
			}
			return next;
		});
	}

	private StreamItem parseNextStream(Document document, StreamItem previous) {
		List<DeploymentItems> deployments = new ArrayList<>();
		List<DeploymentItem> deploymentItems = new ArrayList<>();
		DeploymentItem envItem = null;
		DeploymentItem nameItem = null;
		DeploymentItem descItem = null;
		Range deploymentItemsRange = null;
		Position deploymentItemsStart = null;
		Position deploymentItemsEnd = null;
		StreamItem streamItem = null;
		int lineCount = document.lineCount();
		int start = previous != null ? previous.range.getEnd().getLine() + 1 : 0;

		for (int line = start; streamItem == null && line < lineCount; line++) {
			Range lineRange = document.getLineRange(line);
			DocumentText lineContent = document.content(lineRange);
			DocumentText trim = lineContent.trimStart();
			if (trim.hasText() && Character.isLetterOrDigit(trim.charAt(0))) {
				DefinitionItem definitionItem = parseDefinition(lineContent);
				definitionItem.range = lineRange;
				definitionItem.envItem = envItem;
				definitionItem.nameItem = nameItem;
				definitionItem.descItem = descItem;
				streamItem = new StreamItem();
				streamItem.definitionItem = definitionItem;
				streamItem.range = Range.from(start, 0, line, lineContent.length());
				if (!deploymentItems.isEmpty()) {
					DeploymentItems items = new DeploymentItems();
					items.envItem = envItem;
					items.startLineRange = deploymentItemsRange;
					items.range = Range.from(deploymentItemsStart, deploymentItemsEnd);
					items.items.addAll(deploymentItems);
					deployments.add(items);
				}
				streamItem.deployments.addAll(new ArrayList<>(deployments));
				deploymentItems.clear();
				deployments.clear();
				envItem = null;
				nameItem = null;
				descItem = null;
				deploymentItemsStart = null;
			} else {
				if (trim.length() > 2 && (trim.charAt(0) == '#' || trim.charAt(0) == '-')) {
					if (deploymentItemsStart == null) {
						deploymentItemsStart = lineRange.getStart();
						deploymentItemsRange = lineRange;
					}
					deploymentItemsEnd = lineRange.getEnd();
					DeploymentItem item = new DeploymentItem();
					item.range = lineRange;
					item.text = lineContent;

					int contentStart = findContentStart(lineContent);
					if (contentStart > -1) {
						item.contentRange = Range.from(lineRange.getStart().getLine(), contentStart,
								lineRange.getEnd().getLine(), lineRange.getEnd().getCharacter());
					}
					if (contentStart > -1 && lineContent.startsWith(envPrefix, contentStart)) {
						envItem = item;
					} else if (contentStart > -1 && lineContent.startsWith(namePrefix, contentStart)) {
						nameItem = item;
					} else if (contentStart > -1 && lineContent.startsWith(descPrefix, contentStart)) {
						descItem = item;
					} else {
						deploymentItems.add(item);
					}
				} else {
					if (!deploymentItems.isEmpty()) {
						DeploymentItems items = new DeploymentItems();
						items.envItem = envItem;
						items.startLineRange = deploymentItemsRange;
						items.range = Range.from(deploymentItemsStart, deploymentItemsEnd);
						items.items.addAll(deploymentItems);
						deployments.add(items);
						envItem = null;
						nameItem = null;
						descItem = null;
						deploymentItemsStart = null;
					}
					deploymentItems.clear();
				}
			}
		}
		return streamItem;
	}

	private static int findContentStart(DocumentText text) {
		for (int i = 0; i < text.length(); i++) {
			if (Character.isWhitespace(text.charAt(i))) {
				continue;
			} else if (text.charAt(i) == '-') {
				continue;
			} else if (text.charAt(i) == '#') {
				continue;
			} else if (text.charAt(i) == '@') {
				return i;
			} else if (Character.isLetterOrDigit(text.charAt(i))) {
				return i;
			}
		}
		return -1;
	}

	private DefinitionItem parseDefinition(DocumentText text) {
		DefinitionItem definitionItem = new DefinitionItem();
		StreamParser parser = new StreamParser(text.toString());
		try {
			definitionItem.streamNode = parser.parse();
		} catch (ParseException e) {
			String message = e.getMessage();
			int position = e.getPosition();
			Range range = Range.from(0, position, 0, position);
			DefaultReconcileProblem problem = new DefaultReconcileProblem(new ErrorProblemType(""), message, range);
			definitionItem.reconcileProblem = problem;
		}
		return definitionItem;
	}

	protected static class DeploymentItems {
		private List<DeploymentItem> items = new ArrayList<>();
		private Range startLineRange;
		private Range range;
		private DeploymentItem envItem;

		public List<DeploymentItem> getItems() {
			return items;
		}

		public DeploymentItem getEnvItem() {
			return envItem;
		}

		public Range getStartLineRange() {
			return startLineRange;
		}

		public Range getRange() {
			return range;
		}
	}

	protected static class DeploymentItem {
		private Range contentRange;
		private Range range;
		private DocumentText text;

		public Range getRange() {
			return range;
		}

		public Range getContentRange() {
			return contentRange;
		}

		public DocumentText getText() {
			return text;
		}
	}

	protected static class DefinitionItem {
		private StreamNode streamNode;
		private Range range;
		private ReconcileProblem reconcileProblem;
		private DeploymentItem envItem;
		private DeploymentItem nameItem;
		private DeploymentItem descItem;

		public StreamNode getStreamNode() {
			return streamNode;
		}

		public Range getRange() {
			return range;
		}

		public ReconcileProblem getReconcileProblem() {
			return reconcileProblem;
		}

		public DeploymentItem getEnvItem() {
			return envItem;
		}

		public DeploymentItem getNameItem() {
			return nameItem;
		}

		public DeploymentItem getDescItem() {
			return descItem;
		}
	}

	protected static class StreamItem {
		private List<DeploymentItems> deployments = new ArrayList<>();
		private DefinitionItem definitionItem;
		private Range range;

		public List<DeploymentItems> getDeployments() {
			return deployments;
		}

		public DefinitionItem getDefinitionItem() {
			return definitionItem;
		}

		public Range getRange() {
			return range;
		}
	}
}
