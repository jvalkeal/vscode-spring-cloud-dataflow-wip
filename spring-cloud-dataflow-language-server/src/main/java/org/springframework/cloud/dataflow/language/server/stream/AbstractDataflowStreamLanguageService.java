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
import org.springframework.dsl.domain.Range;
import org.springframework.dsl.service.AbstractDslService;
import org.springframework.dsl.service.reconcile.DefaultReconcileProblem;
import org.springframework.dsl.service.reconcile.ProblemSeverity;
import org.springframework.dsl.service.reconcile.ProblemType;
import org.springframework.dsl.service.reconcile.ReconcileProblem;
import org.springframework.util.StringUtils;

public abstract class AbstractDataflowStreamLanguageService extends AbstractDslService {

    public AbstractDataflowStreamLanguageService() {
        super(DataflowLanguages.LANGUAGEID_STREAM);
    }

    protected List<StreamParseItem> parseStreams(Document document) {
        List<StreamParseItem> items = new ArrayList<>();
		for (int line = 0; line < document.lineCount(); line++) {
            StreamParseItem streamParseItem = new StreamParseItem();
            Range lineRange = document.getLineRange(line);
            streamParseItem.setRange(lineRange);
			String content = document.content(lineRange);
			if (!StringUtils.hasText(content)) {
				continue;
			}
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

    protected static class StreamParseItem {

        private StreamNode streamNode;
        private Range range;
        private ReconcileProblem reconcileProblem;

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
    }
}
