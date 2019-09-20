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
import java.util.Collections;
import java.util.List;

import org.springframework.cloud.dataflow.core.dsl.ParseException;
import org.springframework.cloud.dataflow.core.dsl.StreamNode;
import org.springframework.cloud.dataflow.core.dsl.StreamParser;
import org.springframework.cloud.dataflow.language.server.DataflowLanguages;
import org.springframework.dsl.document.Document;
import org.springframework.dsl.domain.Range;
import org.springframework.dsl.service.AbstractDslService;
import org.springframework.dsl.service.reconcile.DefaultReconcileProblem;
import org.springframework.dsl.service.reconcile.ProblemSeverity;
import org.springframework.dsl.service.reconcile.ProblemType;
import org.springframework.dsl.service.reconcile.ReconcileProblem;
import org.springframework.util.StringUtils;

public abstract class AbstractDataflowStreamLanguageService extends AbstractDslService {

	public AbstractDataflowStreamLanguageService() {
		super(DataflowLanguages.LANGUAGE_STREAM);
	}

	protected List<StreamParseItem> parseStreams(Document document) {
		List<StreamParseItem> items = new ArrayList<>();

		Range metadataRange = null;
		List<MetadataParseItem> metadataParseItems = null;
		List<MetadataParseItemRegion> metadataParseItemRegions = null;

		for (int line = 0; line < document.lineCount(); line++) {
			Range lineRange = document.getLineRange(line);
			String content = document.content(lineRange).toString();

			if (metadataParseItemRegions == null) {
				metadataParseItemRegions = new ArrayList<>();
			}
			if (metadataRange == null) {
				metadataRange = Range.from(line, 0, line, content.length());
			}

			if (!StringUtils.hasText(content)) {
				MetadataParseItemRegion region = new MetadataParseItemRegion();
				region.setRange(metadataRange);
				region.setItems(metadataParseItems);
				metadataParseItemRegions.add(region);
				metadataParseItems = null;
				metadataRange = null;
				continue;
			}
			if (content.startsWith("#")) {
				if (StringUtils.hasText(content.substring(1))) {
					if (metadataParseItems == null) {
						metadataParseItems = new ArrayList<>();
					}
					MetadataParseItem metadataParseItem = new MetadataParseItem(
							Range.from(line, 1, line, content.length()), content.substring(1).trim());
					metadataParseItems.add(metadataParseItem);
				} else {
					MetadataParseItemRegion region = new MetadataParseItemRegion();
					region.setRange(metadataRange);
					region.setItems(metadataParseItems);
					metadataParseItemRegions.add(region);
					metadataParseItems = null;
					metadataRange = null;
				}
				continue;
			}

			StreamParseItem streamParseItem = new StreamParseItem();
			streamParseItem.setRange(lineRange);
			if (metadataParseItems != null && !metadataParseItems.isEmpty()) {
				MetadataParseItemRegion region = new MetadataParseItemRegion();
				region.setRange(metadataRange);
				region.setItems(metadataParseItems);
				metadataParseItemRegions.add(region);
			}
			streamParseItem.setMetadataParseItemRegions(metadataParseItemRegions);
			metadataParseItems = null;
			metadataParseItemRegions = null;
			metadataRange = null;
			StreamParser parser = new StreamParser(content);
			try {
				StreamNode node = parser.parse();
				streamParseItem.setStreamNode(node);
			} catch (ParseException e) {
				String message = e.getMessage();
				int position = e.getPosition();
				Range range = Range.from(0, position, 0, position);
				DefaultReconcileProblem problem = new DefaultReconcileProblem(new ErrorProblemType(""), message, range);
				streamParseItem.setReconcileProblem(problem);
			}
			items.add(streamParseItem);
		}
		return items;
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

	protected static class MetadataParseItemRegion {

		private Range range;
		private List<MetadataParseItem> items = Collections.emptyList();

		public Range getRange() {
			return range;
		}

		public void setRange(Range range) {
			this.range = range;
		}

		public List<MetadataParseItem> getItems() {
			return items;
		}

		public void setItems(List<MetadataParseItem> items) {
			this.items = items;
		}
	}

	protected static class MetadataParseItem {

		private Range metadataRange;
		private String metadataContent;

		MetadataParseItem(Range metadataRange, String metadataContent) {
			this.metadataRange = metadataRange;
			this.metadataContent = metadataContent;
		}

		public Range getMetadataRange() {
			return metadataRange;
		}

		public String getMetadataContent() {
			return metadataContent;
		}
	}

	protected static class StreamParseItem {

		private StreamNode streamNode;
		private Range range;
		private ReconcileProblem reconcileProblem;
		private List<MetadataParseItemRegion> metadataParseItemRegions = Collections.emptyList();

		public StreamNode getStreamNode() {
			return streamNode;
		}

		public void setStreamNode(StreamNode streamNode) {
			this.streamNode = streamNode;
		}

		public Range getRange() {
			return range;
		}

		public void setRange(Range range) {
			this.range = range;
		}

		public ReconcileProblem getReconcileProblem() {
			return reconcileProblem;
		}

		public void setReconcileProblem(ReconcileProblem reconcileProblem) {
			this.reconcileProblem = reconcileProblem;
		}

		public List<MetadataParseItemRegion> getMetadataParseItemRegions() {
			return metadataParseItemRegions;
		}

		public void setMetadataParseItemRegions(List<MetadataParseItemRegion> metadataParseItemRegions) {
			this.metadataParseItemRegions = metadataParseItemRegions;
		}
	}
}
