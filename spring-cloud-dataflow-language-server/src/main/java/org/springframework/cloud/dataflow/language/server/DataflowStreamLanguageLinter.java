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
package org.springframework.cloud.dataflow.language.server;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.dataflow.core.dsl.ParseException;
import org.springframework.cloud.dataflow.core.dsl.StreamParser;
import org.springframework.dsl.document.Document;
import org.springframework.dsl.domain.Range;
import org.springframework.dsl.service.DslContext;
import org.springframework.dsl.service.reconcile.DefaultReconcileProblem;
import org.springframework.dsl.service.reconcile.Linter;
import org.springframework.dsl.service.reconcile.ProblemSeverity;
import org.springframework.dsl.service.reconcile.ProblemType;
import org.springframework.dsl.service.reconcile.ReconcileProblem;

import reactor.core.publisher.Flux;

public class DataflowStreamLanguageLinter extends DataflowLanguagesService implements Linter {

	private final static Logger log = LoggerFactory.getLogger(DataflowStreamLanguageLinter.class);

	@Override
	public Flux<ReconcileProblem> lint(DslContext context) {
		return Flux.defer(() -> {
			return Flux.fromIterable(lintProblems(context.getDocument()));
		});
	}

	private List<ReconcileProblem> lintProblems(Document document) {
		List<ReconcileProblem> problems = new ArrayList<>();
		StreamParser parser = new StreamParser(document.content());
		try {
			parser.parse();
		} catch (ParseException e) {
			String message = e.getMessage();
			int position = e.getPosition();
			Range range = Range.from(0, position, 0, position);
			DefaultReconcileProblem problem = new DefaultReconcileProblem(PROBLEM, message, range);
			problems.add(problem);
		}
		return problems;
	}

	private static ProblemType PROBLEM = new ProblemType() {

		@Override
		public ProblemSeverity getSeverity() {
			return ProblemSeverity.ERROR;
		}

		@Override
		public String getCode() {
			return "code";
		}
	};
}
