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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.dataflow.language.server.DataflowLanguages;
import org.springframework.cloud.dataflow.language.server.domain.DataflowEnvironmentParams;
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
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import reactor.core.publisher.Flux;

public class DataflowStreamLanguageCompletioner extends AbstractDataflowStreamLanguageService implements Completioner {

	private static final Logger log = LoggerFactory.getLogger(DataflowStreamLanguageCompletioner.class);

	@Override
	public Flux<CompletionItem> complete(DslContext context, Position position) {
		return Flux.defer(() -> {
			log.debug("Start of complete request");
			Range prefixRange = Range.from(position.getLine(), 0, position.getLine(), position.getCharacter());
			String prefix = context.getDocument().content(prefixRange).toString();
			DataFlowOperations dataFlowOperations = getDataFlowOperations(context);
			if (dataFlowOperations == null) {
				return Flux.empty();
			}
			log.debug("Start of complete request scdf");
			CompletionProposalsResource proposals = dataFlowOperations.completionOperations()
					.streamCompletions(prefix, 1);
			log.debug("End of complete request scdf");
			return Flux.fromIterable(proposals.getProposals())
				.map(proposal -> {
					return CompletionItem.completionItem()
						.label(proposal.getText().substring(position.getCharacter()))
						// need to have filter as it defaults to label and we changed it and it doesn't match newText
						.filterText(proposal.getText())
						.textEdit()
							.range(Range.from(position.getLine(), 0, position.getLine(), position.getCharacter()))
							.newText(proposal.getText())
						.and()
						.build();
				})
				.doOnComplete(() -> {
					log.debug("End of complete request");
				});
		});
	}

	protected DataFlowOperations getDataFlowOperations(DslContext context) {
		JsonRpcSession session = context.getAttribute(LspSystemConstants.CONTEXT_SESSION_ATTRIBUTE);
		DataflowEnvironmentParams params = session
				.getAttribute(DataflowLanguages.CONTEXT_SESSION_ENVIRONMENTS_ATTRIBUTE);
		String defaultEnvironment = params.getDefaultEnvironment();
		List<Environment> environments = params.getEnvironments();
		Environment environment = environments.stream()
			.filter(env -> ObjectUtils.nullSafeEquals(defaultEnvironment, env.getName()))
			.findFirst()
			.orElse(null);
		if (environment != null) {
			try {
				log.debug("Building DataFlowTemplate for environment {}", environment);
				return buildDataFlowTemplate(environment);
			} catch (Exception e) {
				return null;
			}
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
