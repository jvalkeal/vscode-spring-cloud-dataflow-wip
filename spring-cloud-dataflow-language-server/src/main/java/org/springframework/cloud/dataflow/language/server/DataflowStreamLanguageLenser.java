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

import org.springframework.dsl.document.Document;
import org.springframework.dsl.domain.CodeLens;
import org.springframework.dsl.domain.Range;
import org.springframework.dsl.service.DslContext;
import org.springframework.dsl.service.Lenser;

import reactor.core.publisher.Flux;

public class DataflowStreamLanguageLenser extends DataflowLanguagesService implements Lenser {

	@Override
	public Flux<CodeLens> lense(DslContext context) {
		return Flux.defer(() -> {
			return Flux.fromIterable(lenseDocument(context.getDocument()));
		});
	}

	private List<CodeLens> lenseDocument(Document document) {
		List<CodeLens> lenses = new ArrayList<>();
		CodeLens test = CodeLens.codeLens()
			.range(Range.from(0, 0, 0, 1))
			.command()
				.command(DataflowLanguages.COMMAND_STREAM_DEPLOY)
				.title(DataflowLanguages.COMMAND_STREAM_DEPLOY_TITLE)
				.argument("argument1")
				.argument("argument2")
				.and()
			.build();
		lenses.add(test);
		return lenses;
	}
}
