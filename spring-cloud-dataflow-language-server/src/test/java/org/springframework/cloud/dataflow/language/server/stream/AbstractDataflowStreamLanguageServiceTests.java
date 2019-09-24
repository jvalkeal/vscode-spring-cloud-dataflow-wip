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

import org.junit.jupiter.api.Test;
import org.springframework.cloud.dataflow.language.server.DataflowLanguages;
import org.springframework.cloud.dataflow.language.server.stream.AbstractDataflowStreamLanguageService.StreamItem;
import org.springframework.dsl.document.Document;
import org.springframework.dsl.document.TextDocument;
import org.springframework.dsl.domain.Range;

public class AbstractDataflowStreamLanguageServiceTests {

	private static final TestDataflowStreamLanguageService service = new TestDataflowStreamLanguageService();

	@Test
	public void testEmpty() {
		Document document = new TextDocument("fakeuri", DataflowLanguages.LANGUAGE_STREAM, 0, "");
		List<StreamItem> result = service.parse(document).collectList().block();
		assertThat(result).isEmpty();
	}

	@Test
	public void testNamedStream() {
		Document document = new TextDocument("fakeuri", DataflowLanguages.LANGUAGE_STREAM, 0, "ticktock=time|log");
		List<StreamItem> result = service.parse(document).collectList().block();
		assertThat(result).hasSize(1);
		assertThat(result.get(0)).isNotNull();
		assertThat(result.get(0).getRange()).isEqualTo(Range.from(0, 0, 0, 17));
		assertThat(result.get(0).getDefinitionItem()).isNotNull();
		assertThat(result.get(0).getDefinitionItem().getRange()).isEqualTo(Range.from(0, 0, 0, 17));
		assertThat(result.get(0).getDefinitionItem().getReconcileProblem()).isNull();
		assertThat(result.get(0).getDefinitionItem().getStreamNode()).isNotNull();
		assertThat(result.get(0).getDefinitionItem().getStreamNode().getName()).isEqualTo("ticktock");
		assertThat(result.get(0).getDeployments()).isEmpty();
	}

	@Test
	public void testMultipleNamedStream() {
		String data =
			"ticktock1=time|log\n" +
			"ticktock2=time|log";
		Document document = new TextDocument("fakeuri", DataflowLanguages.LANGUAGE_STREAM, 0, data);
		List<StreamItem> result = service.parse(document).collectList().block();
		assertThat(result).hasSize(2);
	}

	@Test
	public void testMultipleNamedStreamWithEmptyAndCommentLines() {
		String data =
			"\n" +
			"ticktock1=time|log\n" +
			"\n" +
			"ticktock2=time|log\n" +
			"#";
		Document document = new TextDocument("fakeuri", DataflowLanguages.LANGUAGE_STREAM, 0, data);
		List<StreamItem> result = service.parse(document).collectList().block();
		assertThat(result).hasSize(2);
	}

	@Test
	public void testOneDeployment() {
		String data =
			"#foo=bar\n" +
			"ticktock1=time|log";
		Document document = new TextDocument("fakeuri", DataflowLanguages.LANGUAGE_STREAM, 0, data);
		List<StreamItem> result = service.parse(document).collectList().block();
		assertThat(result).hasSize(1);
		assertThat(result.get(0).getDeployments()).hasSize(1);
	}

	@Test
	public void testMultiDeployment() {
		String data =
			"#foo1=bar1\n" +
			"#\n" +
			"#foo1=bar1\n" +
			"#foo2=bar2\n" +
			"\n" +
			"#foo1=bar1\n" +
			"# foo2=bar2\n" +
			"#foo3=bar3\n" +
			"\n" +
			"ticktock1=time|log";
		Document document = new TextDocument("fakeuri", DataflowLanguages.LANGUAGE_STREAM, 0, data);
		List<StreamItem> result = service.parse(document).collectList().block();
		assertThat(result).hasSize(1);
		assertThat(result.get(0).getDeployments()).hasSize(3);
		assertThat(result.get(0).getDeployments().get(0).getItems()).hasSize(1);
		assertThat(result.get(0).getDeployments().get(1).getItems()).hasSize(2);
		assertThat(result.get(0).getDeployments().get(2).getItems()).hasSize(3);
	}

	private static class TestDataflowStreamLanguageService extends AbstractDataflowStreamLanguageService {
	}
}
