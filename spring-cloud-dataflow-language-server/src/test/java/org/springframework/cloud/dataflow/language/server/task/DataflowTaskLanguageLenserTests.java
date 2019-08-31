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

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Test;
import org.springframework.cloud.dataflow.language.server.DataflowLanguages;
import org.springframework.dsl.document.Document;
import org.springframework.dsl.document.TextDocument;
import org.springframework.dsl.domain.CodeLens;
import org.springframework.dsl.service.DslContext;

public class DataflowTaskLanguageLenserTests {

	private final DataflowTaskLanguageLenser lenser = new DataflowTaskLanguageLenser();

	@Test
	public void testTask() {
		Document document = new TextDocument("fakeuri", DataflowLanguages.LANGUAGE_STREAM, 0,
				"t1=timestamp");
		List<CodeLens> lenses = lenser.lense(DslContext.builder().document(document).build()).toStream()
				.collect(Collectors.toList());
		assertThat(lenses).hasSize(2);
		assertThat(lenses.get(0).getCommand().getCommand()).isEqualTo("vscode-spring-cloud-dataflow.tasks.create");
		assertThat(lenses.get(0).getCommand().getArguments().get(0)).isEqualTo("t1");
		assertThat(lenses.get(0).getCommand().getArguments().get(1)).isEqualTo("timestamp");
		assertThat(lenses.get(1).getCommand().getCommand()).isEqualTo("vscode-spring-cloud-dataflow.tasks.destroy");
		assertThat(lenses.get(1).getCommand().getArguments().get(0)).isEqualTo("t1");
		assertThat(lenses.get(1).getCommand().getArguments().get(1)).isEqualTo("timestamp");
	}

}
