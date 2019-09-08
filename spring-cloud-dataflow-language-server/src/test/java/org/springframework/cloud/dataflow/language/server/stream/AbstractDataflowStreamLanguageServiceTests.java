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
import org.springframework.cloud.dataflow.language.server.stream.AbstractDataflowStreamLanguageService.StreamParseItem;
import org.springframework.dsl.document.Document;
import org.springframework.dsl.document.TextDocument;

public class AbstractDataflowStreamLanguageServiceTests {

	private static final TestDataflowStreamLanguageService service = new TestDataflowStreamLanguageService();

	@Test
	public void testEmpty() {
		Document document = new TextDocument("fakeuri", DataflowLanguages.LANGUAGE_STREAM, 0, "");
		List<StreamParseItem> result = service.parseStreams(document);
		assertThat(result).isEmpty();
	}

	@Test
	public void testNamedStream() {
		Document document = new TextDocument("fakeuri", DataflowLanguages.LANGUAGE_STREAM, 0, "ticktock=time|log");
		List<StreamParseItem> result = service.parseStreams(document);
		assertThat(result).hasSize(1);
	}

	@Test
	public void testStreamWithEmptyDeployComments() {
		String data =
			"#\n" +
			"#\n" +
			"ticktock=time|log";
		Document document = new TextDocument("fakeuri", DataflowLanguages.LANGUAGE_STREAM, 0, data);
		List<StreamParseItem> result = service.parseStreams(document);
		assertThat(result).hasSize(1);
	}

	@Test
	public void testStreamWithOneDeployComments1() {
		String data =
			"#foo=bar\n" +
			"ticktock=time|log";
		Document document = new TextDocument("fakeuri", DataflowLanguages.LANGUAGE_STREAM, 0, data);
		List<StreamParseItem> result = service.parseStreams(document);
		assertThat(result).hasSize(1);
		assertThat(result.get(0).getMetadataParseItemRegions()).hasSize(1);
		assertThat(result.get(0).getMetadataParseItemRegions().get(0).getItems()).hasSize(1);
		assertThat(result.get(0).getMetadataParseItemRegions().get(0).getItems().get(0).getMetadataContent()).isEqualTo("foo=bar");
	}

	@Test
	public void testStreamWithOneDeployComments2() {
		String data =
			"#foo1=bar1\n" +
			"#foo2=bar2\n" +
			"ticktock=time|log";
		Document document = new TextDocument("fakeuri", DataflowLanguages.LANGUAGE_STREAM, 0, data);
		List<StreamParseItem> result = service.parseStreams(document);
		assertThat(result).hasSize(1);
		assertThat(result.get(0).getMetadataParseItemRegions()).hasSize(1);
		assertThat(result.get(0).getMetadataParseItemRegions().get(0).getItems()).hasSize(2);
	}

	@Test
	public void testStreamWithOneDeployComments3() {
		String data =
			"#foo1=bar1\n" +
			"#foo2=bar2\n" +
			"#\n" +
			"#foo3=bar3\n" +
			"ticktock=time|log";
		Document document = new TextDocument("fakeuri", DataflowLanguages.LANGUAGE_STREAM, 0, data);
		List<StreamParseItem> result = service.parseStreams(document);
		assertThat(result).hasSize(1);
		assertThat(result.get(0).getMetadataParseItemRegions()).hasSize(2);
		assertThat(result.get(0).getMetadataParseItemRegions().get(0).getItems()).hasSize(2);
		assertThat(result.get(0).getMetadataParseItemRegions().get(1).getItems()).hasSize(1);
	}

	@Test
	public void testStreamWithOneDeployComments4() {
		String data =
			"#foo1=bar1\n" +
			"#foo2=bar2\n" +
			"\n" +
			"#foo3=bar3\n" +
			"ticktock=time|log";
		Document document = new TextDocument("fakeuri", DataflowLanguages.LANGUAGE_STREAM, 0, data);
		List<StreamParseItem> result = service.parseStreams(document);
		assertThat(result).hasSize(1);
		assertThat(result.get(0).getMetadataParseItemRegions()).hasSize(2);
		assertThat(result.get(0).getMetadataParseItemRegions().get(0).getItems()).hasSize(2);
		assertThat(result.get(0).getMetadataParseItemRegions().get(1).getItems()).hasSize(1);
	}

	private static class TestDataflowStreamLanguageService extends AbstractDataflowStreamLanguageService {
	}
}
