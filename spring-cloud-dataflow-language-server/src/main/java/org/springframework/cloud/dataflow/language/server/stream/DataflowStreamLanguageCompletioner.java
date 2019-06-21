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

import java.net.URI;
import java.util.List;

import org.springframework.cloud.dataflow.language.server.DataflowLanguages;
import org.springframework.cloud.dataflow.language.server.domain.DataflowEnvironmentParams.Environment;
import org.springframework.cloud.dataflow.rest.client.DataFlowOperations;
import org.springframework.cloud.dataflow.rest.client.DataFlowTemplate;
import org.springframework.cloud.dataflow.rest.resource.CompletionProposalsResource;
import org.springframework.cloud.dataflow.rest.util.HttpClientConfigurer;
import org.springframework.dsl.domain.CompletionItem;
import org.springframework.dsl.domain.Position;
import org.springframework.dsl.domain.Range;
import org.springframework.dsl.jsonrpc.session.JsonRpcSession;
import org.springframework.dsl.lsp.LspSystemConstants;
import org.springframework.dsl.service.Completioner;
import org.springframework.dsl.service.DslContext;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import reactor.core.publisher.Flux;

public class DataflowStreamLanguageCompletioner extends AbstractDataflowStreamLanguageService implements Completioner {

	@Override
	public Flux<CompletionItem> complete(DslContext context, Position position) {
		return Flux.defer(() -> {
			Range prefixRange = Range.from(position.getLine(), 0, position.getLine(), position.getCharacter());
			String prefix = context.getDocument().content(prefixRange);
			DataFlowOperations dataFlowOperations = getDataFlowOperations(context);
			if (dataFlowOperations == null) {
				return Flux.empty();
			}
			CompletionProposalsResource proposals = dataFlowOperations.completionOperations()
					.streamCompletions(prefix, 1);
			return Flux.fromIterable(proposals.getProposals())
				.map(proposal -> {
					return CompletionItem.completionItem()
						.label(proposal.getText())
						.textEdit()
							.range(Range.from(position.getLine(), 0, position.getLine(), position.getCharacter()))
							.newText(proposal.getText())
						.and()
						.build();
				});
		});
	}

	protected DataFlowOperations getDataFlowOperations(DslContext context) {
		JsonRpcSession session = context.getAttribute(LspSystemConstants.CONTEXT_SESSION_ATTRIBUTE);
		org.springframework.cloud.dataflow.language.server.domain.DataflowEnvironmentParams params = session
				.getAttribute(DataflowLanguages.CONTEXT_SESSION_ENVIRONMENTS_ATTRIBUTE);
		List<Environment> environments = params.getEnvironments();
		if (environments.size() > 0) {
			return buildDataFlowTemplate(environments.get(0));
		}
		return null;
	}

	private DataFlowTemplate buildDataFlowTemplate(Environment environment) {
		URI uri = URI.create(environment.getUrl());
		String username = environment.getCredentials().getUsername();
		String password = environment.getCredentials().getPassword();
		if (StringUtils.hasText(username) && StringUtils.hasText(password)) {
			RestTemplate restTemplate = new RestTemplate();
			HttpClientConfigurer httpClientConfigurer = HttpClientConfigurer.create(uri);
			httpClientConfigurer.basicAuthCredentials(username, password);
			restTemplate.setRequestFactory(httpClientConfigurer.buildClientHttpRequestFactory());
			return new DataFlowTemplate(uri, restTemplate);
		} else {
			return new DataFlowTemplate(uri);
		}
	}
}
