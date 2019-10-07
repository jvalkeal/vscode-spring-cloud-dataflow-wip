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

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.cloud.dataflow.language.server.DataflowLanguages;
import org.springframework.cloud.dataflow.language.server.support.DataFlowOperationsService;
import org.springframework.cloud.dataflow.language.server.support.DataflowCacheService;
import org.springframework.cloud.dataflow.language.server.task.AbstractDataflowTaskLanguageService.TaskItem;
import org.springframework.dsl.document.Document;
import org.springframework.dsl.document.TextDocument;
import org.springframework.dsl.domain.Range;

public class AbstractDataflowTaskLanguageServiceTests {

	private static final TestDataflowTaskLanguageService service = new TestDataflowTaskLanguageService();

	public static final String DSL_ONE_MULTI_ENV =
		"-- @env env1\n" +
		"-- foo1=bar1\n" +
		"\n" +
		"-- @env env2\n" +
		"-- foo2=bar2\n" +
		"\n" +
		"-- @env env3\n" +
		"-- @name name3\n" +
		"-- @desc desc3\n" +
		"timestamp\n";

	public static final String DSL_INLINE_NAME =
		"name=timestamp\n";

	@BeforeEach
	public void setup() {
		service.setDataflowCacheService(new DataflowCacheService());
		service.setDataflowOperationsService(new DataFlowOperationsService());
	}

	@Test
	public void testMultiDeployment() {
		Document document = new TextDocument("fakeuri", DataflowLanguages.LANGUAGE_TASK, 0, DSL_ONE_MULTI_ENV);
		List<TaskItem> result = service.parse(document).collectList().block();
		assertThat(result).hasSize(1);
		assertThat(result.get(0).getDeployments()).hasSize(2);
		assertThat(result.get(0).getDeployments().get(0).getStartLineRange()).isEqualTo(Range.from(0, 0, 0, 12));
		assertThat(result.get(0).getDeployments().get(0).getRange()).isEqualTo(Range.from(0, 0, 1, 12));
		assertThat(result.get(0).getDeployments().get(0).getItems()).hasSize(1);
		assertThat(result.get(0).getDeployments().get(0).getItems().get(0).getText().toString()).isEqualTo("-- foo1=bar1");
		assertThat(result.get(0).getDeployments().get(1).getStartLineRange()).isEqualTo(Range.from(3, 0, 3, 12));
		assertThat(result.get(0).getDeployments().get(1).getRange()).isEqualTo(Range.from(3, 0, 4, 12));
		assertThat(result.get(0).getDeployments().get(1).getItems()).hasSize(1);
		assertThat(result.get(0).getDeployments().get(1).getItems().get(0).getText().toString()).isEqualTo("-- foo2=bar2");
		assertThat(result.get(0).getDefinitionItem()).isNotNull();
		assertThat(result.get(0).getDefinitionItem().getRange()).isEqualTo(Range.from(9, 0, 9, 9));
		assertThat(result.get(0).getDefinitionItem().getEnvItem().getText().toString()).isEqualTo("-- @env env3");
		assertThat(result.get(0).getDefinitionItem().getNameItem().getText().toString()).isEqualTo("-- @name name3");
		assertThat(result.get(0).getDefinitionItem().getDescItem().getText().toString()).isEqualTo("-- @desc desc3");
		assertThat(result.get(0).getDefinitionItem().getTaskNode()).isNotNull();
		assertThat(result.get(0).getDefinitionItem().getTaskNode().getTaskText()).isEqualTo("timestamp");
		assertThat(result.get(0).getDefinitionItem().getTaskNode().getName()).isEqualTo("name3");
	}

	@Test
	public void testInlineName() {
		Document document = new TextDocument("fakeuri", DataflowLanguages.LANGUAGE_TASK, 0, DSL_INLINE_NAME);
		List<TaskItem> result = service.parse(document).collectList().block();
		assertThat(result).hasSize(1);
		assertThat(result.get(0).getDeployments()).hasSize(0);
		assertThat(result.get(0).getDefinitionItem()).isNotNull();
		assertThat(result.get(0).getDefinitionItem().getTaskNode()).isNotNull();
		assertThat(result.get(0).getDefinitionItem().getTaskNode().getTaskText()).isEqualTo("timestamp");
		assertThat(result.get(0).getDefinitionItem().getTaskNode().getName()).isEqualTo("name");
	}

	private static class TestDataflowTaskLanguageService extends AbstractDataflowTaskLanguageService {

		public TestDataflowTaskLanguageService() {
			setDataflowCacheService(new DataflowCacheService());
		}
	}
}
