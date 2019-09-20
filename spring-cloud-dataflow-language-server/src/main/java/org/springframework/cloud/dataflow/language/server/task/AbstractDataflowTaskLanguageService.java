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
package org.springframework.cloud.dataflow.language.server.task;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.cloud.dataflow.core.dsl.ParseException;
import org.springframework.cloud.dataflow.core.dsl.TaskNode;
import org.springframework.cloud.dataflow.core.dsl.TaskParser;
import org.springframework.cloud.dataflow.language.server.DataflowLanguages;
import org.springframework.dsl.document.Document;
import org.springframework.dsl.domain.Range;
import org.springframework.dsl.service.AbstractDslService;
import org.springframework.dsl.service.reconcile.DefaultReconcileProblem;
import org.springframework.dsl.service.reconcile.ProblemSeverity;
import org.springframework.dsl.service.reconcile.ProblemType;
import org.springframework.dsl.service.reconcile.ReconcileProblem;
import org.springframework.util.StringUtils;

public abstract class AbstractDataflowTaskLanguageService extends AbstractDslService {

	public AbstractDataflowTaskLanguageService() {
		super(DataflowLanguages.LANGUAGE_TASK);
	}

	protected List<TaskParseItem> parseTasks(Document document) {
		List<TaskParseItem> items = new ArrayList<>();
		for (int line = 0; line < document.lineCount(); line++) {
			TaskParseItem taskParseItem = new TaskParseItem();
			Range lineRange = document.getLineRange(line);
			taskParseItem.setRange(lineRange);
			String content = document.content(lineRange).toString();
			if (!StringUtils.hasText(content)) {
				continue;
			}
			String name = null;
			int l = 0;
			String parseSection = parseNameSection(content);
			if (parseSection != null) {
				l = parseSection.length();
				parseSection = parseSection.trim();
				parseSection = parseSection.replace("=", "");
				name = parseSection.trim();
			} else {
				String message = "Name missing";
				int position = 0;
				Range range = Range.from(0, position, 0, position);
				DefaultReconcileProblem problem = new DefaultReconcileProblem(new ErrorProblemType(""), message, range);
				taskParseItem.setReconcileProblem(problem);
				items.add(taskParseItem);
				continue;
			}
			// TODO: parser should support naming format
			TaskParser parser = new TaskParser(name, content.substring(l), true, true);
			try {
				TaskNode node = parser.parse();
				taskParseItem.setTaskNode(node);
			} catch (ParseException e) {
				String message = e.getMessage();
				int position = e.getPosition();
				Range range = Range.from(0, position, 0, position);
				DefaultReconcileProblem problem = new DefaultReconcileProblem(new ErrorProblemType(""), message, range);
				taskParseItem.setReconcileProblem(problem);
			}
			items.add(taskParseItem);
		}
		return items;
	}

	private String parseNameSection(String content) {
		Pattern p = Pattern.compile("^[ a-zA-z0-9]*=");
		Matcher m = p.matcher(content);
		if(m.find()) {
			return content.substring(0, m.end());
		}
		return null;
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

	protected static class TaskParseItem {

		private TaskNode taskNode;
		private Range range;
		private ReconcileProblem reconcileProblem;

		public TaskNode getTaskNode() {
			return taskNode;
		}

		public void setTaskNode(TaskNode taskNode) {
			this.taskNode = taskNode;
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
