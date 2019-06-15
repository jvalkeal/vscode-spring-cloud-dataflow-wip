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

import java.net.URI;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.dataflow.language.server.DataflowEnvironmentParams.Environment;
import org.springframework.cloud.dataflow.language.server.stream.DataflowStreamCreateParams;
import org.springframework.cloud.dataflow.rest.client.DataFlowOperations;
import org.springframework.cloud.dataflow.rest.client.DataFlowTemplate;
import org.springframework.dsl.jsonrpc.annotation.JsonRpcNotification;
import org.springframework.dsl.jsonrpc.annotation.JsonRpcRequestMapping;
import org.springframework.dsl.jsonrpc.annotation.JsonRpcRequestParams;
import org.springframework.dsl.jsonrpc.session.JsonRpcSession;
import org.springframework.dsl.lsp.client.LspClient;
import org.springframework.dsl.service.DslContext;

import reactor.core.publisher.Mono;

/**
 * Controller which takes ownership of all lsp protocol communication for
 * a {@code scdf} namespace. Functionality behind this controller is defined
 * together with a lsp client which for correct functionality need to
 * be aware of these rules working with Spring Cloud Data Flow specific extensions
 * of a lsp protocol.
 *
 * @author Janne Valkealahti
 *
 */
@JsonRpcRequestMapping(method = "scdf/")
public class DataflowJsonRpcController {

	private final static Logger log = LoggerFactory.getLogger(DataflowJsonRpcController.class);

	/**
	 * Blindly inject given params into a session so that other methods can use this
	 * info from a {@link JsonRpcSession} available from a {@link DslContext}.
	 *
	 * @param params the dataflow environment params
	 * @param session th json rpc session
	 */
	@JsonRpcRequestMapping(method = "environment")
	@JsonRpcNotification
	public void environmentNotification(@JsonRpcRequestParams DataflowEnvironmentParams params,
			JsonRpcSession session) {
		log.debug("Client sending new environment info, params {} and session id {}", params, session.getId());
		session.getAttributes().put(DataflowLanguages.CONTEXT_SESSION_ENVIRONMENTS_ATTRIBUTE, params);
	}

	@JsonRpcRequestMapping(method = "createStream")
	@JsonRpcNotification
	public Mono<Void> createStream(@JsonRpcRequestParams DataflowStreamCreateParams params, JsonRpcSession session,
			LspClient lspClient) {
		return Mono.fromRunnable(() -> {
			log.debug("Client sending stream create request, params {}", params);
			DataFlowOperations operations = getDataFlowOperations(session);
			if (operations != null) {
				log.debug("Creating stream {}", params);
				operations.streamOperations().createStream(params.getName(), params.getDefinition(), false);
			} else {
				log.info("Unable to create stream");
			}
		})
		.then(lspClient.notification().method("scdf/createdStream").exchange());
	}

	@JsonRpcRequestMapping(method = "destroyStream")
	@JsonRpcNotification
	public Mono<Void> destroyStream(@JsonRpcRequestParams DataflowStreamCreateParams params, JsonRpcSession session,
			LspClient lspClient) {
		return Mono.fromRunnable(() -> {
			log.debug("Client sending stream destroy request, params {}", params);
			DataFlowOperations operations = getDataFlowOperations(session);
			if (operations != null) {
				log.debug("Destroying stream {}", params);
				operations.streamOperations().destroy(params.getName());
			} else {
				log.info("Unable to destroy stream");
			}
		})
		.then(lspClient.notification().method("scdf/destroyedStream").exchange());
	}

	protected DataFlowOperations getDataFlowOperations(JsonRpcSession session) {
		DataflowEnvironmentParams params = session
				.getAttribute(DataflowLanguages.CONTEXT_SESSION_ENVIRONMENTS_ATTRIBUTE);
		List<Environment> environments = params.getEnvironments();
		if (environments.size() > 0) {
			String url = environments.get(0).getUrl();
			URI uri = URI.create(url);
			return new DataFlowTemplate(uri);
		}
		return null;
	}
}
