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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.cloud.dataflow.language.server.DataflowLanguages;
import org.springframework.cloud.dataflow.rest.client.CompletionOperations;
import org.springframework.cloud.dataflow.rest.client.DataFlowOperations;
import org.springframework.cloud.dataflow.rest.resource.CompletionProposalsResource;
import org.springframework.cloud.dataflow.rest.resource.CompletionProposalsResource.Proposal;
import org.springframework.dsl.document.Document;
import org.springframework.dsl.document.TextDocument;
import org.springframework.dsl.domain.CompletionItem;
import org.springframework.dsl.domain.Position;
import org.springframework.dsl.service.DslContext;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
public class DataflowStreamLanguageCompletionerTests {

    @MockBean
    private DataFlowOperations dataFlowOperations;

    @MockBean
    private CompletionOperations completionOperations;

    @MockBean
    private CompletionProposalsResource proposalsResource;

    @Test
    public void testEmpty() {
        Proposal proposal = new Proposal("completion1", "explanation");
        Document document = new TextDocument("fakeuri", DataflowLanguages.LANGUAGEID_STREAM, 0, "");
        Mockito.when(dataFlowOperations.completionOperations()).thenReturn(completionOperations);
        Mockito.when(completionOperations.streamCompletions(any(), anyInt())).thenReturn(proposalsResource);
        Mockito.when(proposalsResource.getProposals()).thenReturn(Arrays.asList(proposal));
        DataflowStreamLanguageCompletioner completioner = mockCompletioner();

        List<CompletionItem> completes = completioner
                .complete(DslContext.builder().document(document).build(), Position.zero()).toStream()
                .collect(Collectors.toList());
        assertThat(completes).hasSize(1);
        assertThat(completes.get(0).getTextEdit().getNewText()).isEqualTo("completion1");
    }

    private DataflowStreamLanguageCompletioner mockCompletioner() {
        return new DataflowStreamLanguageCompletioner() {
            @Override
            protected DataFlowOperations getDataFlowOperations(DslContext context) {
                return dataFlowOperations;
            }
        };
    }
}
