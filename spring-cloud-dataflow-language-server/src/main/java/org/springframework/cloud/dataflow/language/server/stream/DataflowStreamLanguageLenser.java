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

import org.springframework.cloud.dataflow.core.dsl.StreamNode;
import org.springframework.cloud.dataflow.language.server.DataflowLanguages;
import org.springframework.dsl.domain.CodeLens;
import org.springframework.dsl.service.DslContext;
import org.springframework.dsl.service.Lenser;

import reactor.core.publisher.Flux;

public class DataflowStreamLanguageLenser extends AbstractDataflowStreamLanguageService implements Lenser {

	@Override
	public Flux<CodeLens> lense(DslContext context) {
		return Flux.defer(() -> {
			return Flux.fromIterable(parseStreams(context.getDocument()))
				.filter(item -> item.getStreamNode() != null)
				.flatMap(item -> {
					return Flux.just(
						codeLens(item, DataflowLanguages.COMMAND_STREAM_CREATE,
							DataflowLanguages.COMMAND_STREAM_CREATE_TITLE),
						codeLens(item, DataflowLanguages.COMMAND_STREAM_DESTROY,
							DataflowLanguages.COMMAND_STREAM_DESTROY_TITLE),
						codeLens(item, DataflowLanguages.COMMAND_STREAM_DEPLOY,
							DataflowLanguages.COMMAND_STREAM_DEPLOY_TITLE),
						codeLens(item, DataflowLanguages.COMMAND_STREAM_UNDEPLOY,
							DataflowLanguages.COMMAND_STREAM_UNDEPLOY_TITLE),
						codeLens(item, DataflowLanguages.COMMAND_STREAM_DEBUG_ATTACH,
							DataflowLanguages.COMMAND_STREAM_DEBUG_ATTACH_TITLE)
				);
			});
		});
	}

	private CodeLens codeLens(StreamParseItem item, String command, String title) {
		return CodeLens.codeLens()
			.range(item.getRange())
			.command()
				.command(command)
				.title(title)
				.argument(item.getStreamNode().getName())
				.argument(getDefinition(item.getStreamNode()))
				.and()
			.build();
	}

	private String getDefinition(StreamNode streamNode) {
		return streamNode.getStreamText().substring(streamNode.getStartPos());
	}
}
