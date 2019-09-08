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

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Test;
import org.springframework.cloud.dataflow.language.server.DataflowLanguages;
import org.springframework.dsl.document.Document;
import org.springframework.dsl.document.TextDocument;
import org.springframework.dsl.domain.CodeLens;
import org.springframework.dsl.domain.Range;
import org.springframework.dsl.service.DslContext;
import org.springframework.dsl.service.Lenser;

public class DataflowStreamLanguageLenserTests {

    private final Lenser lenser = new DataflowStreamLanguageLenser();

	@Test
	public void testLintsMultipleStreams() {
		Document document = new TextDocument("fakeuri", DataflowLanguages.LANGUAGE_STREAM, 0,
				"stream1 = time|log\nstream2 = time|log");
		List<CodeLens> problems = lenser.lense(DslContext.builder().document(document).build()).toStream()
				.collect(Collectors.toList());
		assertThat(problems).hasSize(12);
	}

	@Test
	public void testLensesSingleStreamsWithDeployProperties() {
		String data =
			"#foo1=bar1\n" +
			"stream1 = time|log";

		Document document = new TextDocument("fakeuri", DataflowLanguages.LANGUAGE_STREAM, 0, data);
		List<CodeLens> problems = lenser.lense(DslContext.builder().document(document).build()).toStream()
				.collect(Collectors.toList());
		assertThat(problems).hasSize(7);
	}

	@Test
	@SuppressWarnings("unchecked")
	public void testLintsMultipleStreamsWithDeployProperties() {
		String data =
			"#foo1=bar1\n" +
			"#foo2=bar2\n" +
			"stream1 = time|log\n" +
			"#foo3=bar3\n" +
			"stream2 = time|log";
		Document document = new TextDocument("fakeuri", DataflowLanguages.LANGUAGE_STREAM, 0, data);
		List<CodeLens> lenses = lenser.lense(DslContext.builder().document(document).build()).toStream()
				.collect(Collectors.toList());
		assertThat(lenses).hasSize(14);
		assertThat(lenses.get(0).getCommand().getTitle()).isEqualTo(DataflowLanguages.COMMAND_STREAM_DEPLOY_TITLE);
		assertThat(lenses.get(0).getCommand().getCommand()).isEqualTo(DataflowLanguages.COMMAND_STREAM_DEPLOY);
		assertThat(lenses.get(0).getCommand().getArguments()).hasSize(3);
		assertThat(lenses.get(0).getCommand().getArguments().get(0)).isEqualTo("stream1");
		assertThat(lenses.get(0).getCommand().getArguments().get(1)).isEqualTo("time|log");
		assertThat(lenses.get(0).getCommand().getArguments().get(2)).isInstanceOf(Map.class);
		assertThat((Map<String, String>)lenses.get(0).getCommand().getArguments().get(2)).hasSize(2);
		assertThat((Map<String, String>)lenses.get(0).getCommand().getArguments().get(2)).containsEntry("foo1", "bar1");
		assertThat((Map<String, String>)lenses.get(0).getCommand().getArguments().get(2)).containsEntry("foo2", "bar2");
		assertThat(lenses.get(0).getRange()).isEqualTo(Range.from(0, 0, 0, 10));
		assertThat(lenses.get(7).getCommand().getTitle()).isEqualTo(DataflowLanguages.COMMAND_STREAM_DEPLOY_TITLE);
		assertThat(lenses.get(7).getCommand().getCommand()).isEqualTo(DataflowLanguages.COMMAND_STREAM_DEPLOY);
		assertThat(lenses.get(7).getRange()).isEqualTo(Range.from(3, 0, 3, 10));
	}

	@Test
	public void testLintsMultipleStreamsWithDeployProperties2() {
		String data =
			"#foo1=bar1\n" +
			"#\n" +
			"#foo2=bar2\n" +
			"stream1 = time|log";
		Document document = new TextDocument("fakeuri", DataflowLanguages.LANGUAGE_STREAM, 0, data);
		List<CodeLens> lenses = lenser.lense(DslContext.builder().document(document).build()).toStream()
				.collect(Collectors.toList());
		assertThat(lenses).hasSize(8);
		assertThat(lenses.get(0).getCommand().getTitle()).isEqualTo(DataflowLanguages.COMMAND_STREAM_DEPLOY_TITLE);
		assertThat(lenses.get(0).getRange()).isEqualTo(Range.from(0, 0, 0, 10));
		assertThat(lenses.get(1).getCommand().getTitle()).isEqualTo(DataflowLanguages.COMMAND_STREAM_DEPLOY_TITLE);
		assertThat(lenses.get(1).getRange()).isEqualTo(Range.from(2, 0, 2, 10));
	}
}
