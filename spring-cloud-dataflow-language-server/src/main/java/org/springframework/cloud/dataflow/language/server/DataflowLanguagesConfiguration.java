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

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.dsl.lsp.server.support.JvmLspExiter;
import org.springframework.dsl.lsp.server.support.LspExiter;
import org.springframework.dsl.service.Lenser;
import org.springframework.dsl.service.reconcile.Linter;

@Configuration
public class DataflowLanguagesConfiguration {

    @Bean
	public LspExiter lspExiter() {
		return new JvmLspExiter();
	}

    @Bean
    public DataflowJsonRpcController dataflowJsonRpcController() {
        return new DataflowJsonRpcController();
    }

    @Bean
    public Linter dataflowStreamLanguageLinter() {
        return new DataflowStreamLanguageLinter();
    }

    @Bean
    public Lenser dataflowStreamLanguageLenser() {
        return new DataflowStreamLanguageLenser();
    }

    @Bean
    public Linter dataflowTaskLanguageLinter() {
        return new DataflowTaskLanguageLinter();
    }
}
