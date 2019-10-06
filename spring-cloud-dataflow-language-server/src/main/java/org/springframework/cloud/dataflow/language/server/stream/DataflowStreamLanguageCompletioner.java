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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.dataflow.rest.client.DataFlowOperations;
import org.springframework.cloud.dataflow.rest.resource.CompletionProposalsResource;
import org.springframework.dsl.domain.CompletionItem;
import org.springframework.dsl.domain.Position;
import org.springframework.dsl.domain.Range;
import org.springframework.dsl.service.Completioner;
import org.springframework.dsl.service.DslContext;

import reactor.core.publisher.Flux;

public class DataflowStreamLanguageCompletioner extends AbstractDataflowStreamLanguageService implements Completioner {

	private static final Logger log = LoggerFactory.getLogger(DataflowStreamLanguageCompletioner.class);

	@Override
	public Flux<CompletionItem> complete(DslContext context, Position position) {
		return Flux.defer(() -> {
			log.debug("Start of complete request");
			Range prefixRange = Range.from(position.getLine(), 0, position.getLine(), position.getCharacter());
			String prefix = context.getDocument().content(prefixRange).toString();
			DataFlowOperations dataFlowOperations = resolveDataFlowOperations(context, position);
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
}
