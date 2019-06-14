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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dsl.domain.CompletionItem;
import org.springframework.dsl.domain.Position;
import org.springframework.dsl.jsonrpc.session.JsonRpcSession;
import org.springframework.dsl.lsp.LspSystemConstants;
import org.springframework.dsl.service.Completioner;
import org.springframework.dsl.service.DslContext;

import reactor.core.publisher.Flux;

public class DataflowStreamLanguageCompletioner extends DataflowLanguagesService implements Completioner {

	private final static Logger log = LoggerFactory.getLogger(DataflowStreamLanguageCompletioner.class);

	@Override
	public Flux<CompletionItem> complete(DslContext context, Position position) {
		JsonRpcSession session = context.getAttribute(LspSystemConstants.CONTEXT_SESSION_ATTRIBUTE);
		DataflowEnvironmentParams params = session
				.getAttribute(DataflowLanguages.CONTEXT_SESSION_ENVIRONMENTS_ATTRIBUTE);
		log.info("scdf servers {}", params);
		return Flux.empty();
	}
}
