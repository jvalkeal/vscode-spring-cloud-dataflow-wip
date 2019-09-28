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

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.cloud.dataflow.core.dsl.StreamNode;
import org.springframework.cloud.dataflow.language.server.DataflowLanguages;
import org.springframework.dsl.document.DocumentText;
import org.springframework.dsl.domain.CodeLens;
import org.springframework.dsl.service.DslContext;
import org.springframework.dsl.service.Lenser;

import reactor.core.publisher.Flux;

public class DataflowStreamLanguageLenser extends AbstractDataflowStreamLanguageService implements Lenser {

	@Override
	public Flux<CodeLens> lense(DslContext context) {
		return parse(context.getDocument())
			.flatMap(item -> Flux.fromIterable(codeLensWithProperties(item))
				.concatWithValues(codeLensWithStream(item).toArray(new CodeLens[0])));
	}

	private List<CodeLens> codeLensWithProperties(StreamItem item) {
		return item.getDeployments().stream()
			.map(deployment -> {
				return CodeLens.codeLens()
					.range(deployment.getRange())
					.command()
						.command(DataflowLanguages.COMMAND_STREAM_DEPLOY)
						.title(DataflowLanguages.COMMAND_STREAM_DEPLOY_TITLE)
						.argument(item.getDefinitionItem().getStreamNode().getName())
						.argument(getDefinition(item.getDefinitionItem().getStreamNode()))
						.argument(getDeploymentProperties(deployment.getItems()))
						.and()
					.build();
			})
			.collect(Collectors.toList());
	}

	private List<CodeLens> codeLensWithStream(StreamItem item) {
		return Arrays.asList(
			codeLens(item, DataflowLanguages.COMMAND_STREAM_CREATE,
				DataflowLanguages.COMMAND_STREAM_CREATE_TITLE),
			codeLens(item, DataflowLanguages.COMMAND_STREAM_DESTROY,
				DataflowLanguages.COMMAND_STREAM_DESTROY_TITLE),
			codeLens(item, DataflowLanguages.COMMAND_STREAM_DEPLOY,
				DataflowLanguages.COMMAND_STREAM_DEPLOY_TITLE),
			codeLens(item, DataflowLanguages.COMMAND_STREAM_UNDEPLOY,
				DataflowLanguages.COMMAND_STREAM_UNDEPLOY_TITLE)
		);
	}

	private CodeLens codeLens(StreamItem item, String command, String title) {
		return CodeLens.codeLens()
			.range(item.getDefinitionItem().getRange())
			.command()
				.command(command)
				.title(title)
				.argument(item.getDefinitionItem().getStreamNode().getName())
				.argument(getDefinition(item.getDefinitionItem().getStreamNode()))
				.and()
			.build();
	}

	private String getDefinition(StreamNode streamNode) {
		return streamNode.getStreamText().substring(streamNode.getStartPos());
	}

	private Map<String, String> getDeploymentProperties(List<DeploymentItem> items) {
		HashMap<String, String> properties = new HashMap<String, String>();
		items.stream().forEach(item -> {
			DocumentText[] split = item.getText().splitFirst('=');
			if (split.length == 2) {
				int firstAlphaNumeric = firstLetterOrDigit(split[0]);
				if (firstAlphaNumeric > -1) {
					properties.put(split[0].subSequence(firstAlphaNumeric, split[0].length()).toString().trim(),
						split[1].toString().trim());
				}
			}
		});
		return properties;
	}

	private static int firstLetterOrDigit(DocumentText text) {
		for (int i = 0; i < text.length(); i++) {
			if (Character.isLetterOrDigit(text.charAt(i))) {
				return i;
			}
		}
		return -1;
	}
}
