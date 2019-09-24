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
				streamItem = new StreamItem();
				streamItem.definitionItem = definitionItem;
				streamItem.range = Range.from(start, 0, line, lineContent.length());
				if (!deploymentItems.isEmpty()) {
					DeploymentItems items = new DeploymentItems();
					items.range = deploymentItemsRange;
					items.fullRange = Range.from(deploymentItemsStart, deploymentItemsEnd);
					items.items.addAll(deploymentItems);
					deployments.add(items);
				}
				streamItem.deployments.addAll(new ArrayList<>(deployments));
				deploymentItems.clear();
				deployments.clear();
				deploymentItemsStart = null;
			} else {
				if (trim.length() > 2 && trim.charAt(0) == '#') {
					if (deploymentItemsStart == null) {
						deploymentItemsStart = lineRange.getStart();
						deploymentItemsRange = lineRange;
					}
					deploymentItemsEnd = lineRange.getEnd();
					DeploymentItem item = new DeploymentItem();
					item.range = lineRange;
					item.text = lineContent;
					deploymentItems.add(item);
				} else {
					if (!deploymentItems.isEmpty()) {
						DeploymentItems items = new DeploymentItems();
						items.range = deploymentItemsRange;
						items.fullRange = Range.from(deploymentItemsStart, deploymentItemsEnd);
						items.items.addAll(deploymentItems);
						deployments.add(items);
						deploymentItemsStart = null;
					}
					deploymentItems.clear();
				}
			}
		}
		return streamItem;
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
		private Range range;
		private Range fullRange;

		public List<DeploymentItem> getItems() {
			return items;
		}

		public Range getRange() {
			return range;
		}

		public Range getFullRange() {
			return fullRange;
		}
	}

	protected static class DeploymentItem {
		private Range range;
		private DocumentText text;

		public Range getRange() {
			return range;
		}

		public DocumentText getText() {
			return text;
		}
	}

	protected static class DefinitionItem {
		private StreamNode streamNode;
		private Range range;
		private ReconcileProblem reconcileProblem;

		public StreamNode getStreamNode() {
			return streamNode;
		}

		public Range getRange() {
			return range;
		}

		public ReconcileProblem getReconcileProblem() {
			return reconcileProblem;
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
