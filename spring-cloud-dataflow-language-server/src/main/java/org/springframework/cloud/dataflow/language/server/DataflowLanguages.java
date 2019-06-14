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

import org.springframework.dsl.model.LanguageId;

/**
 * Various contansts for dataflow languages.
 *
 * @author Janne Valkealahti
 *
 */
public class DataflowLanguages {

	public final static LanguageId LANGUAGEID_STREAM = LanguageId.languageId("scdfs",
			"Spring Cloud Data Flow Stream Language");

	public final static LanguageId LANGUAGEID_TASK = LanguageId.languageId("scdft",
			"Spring Cloud Data Flow Task Language");

	public final static String COMMAND_STREAM_DEPLOY = "vscode-spring-cloud-dataflow.streams.deploy";

	public final static String COMMAND_STREAM_DEPLOY_TITLE = "Deploy Stream";

	public final static String CONTEXT_SESSION_ENVIRONMENTS_ATTRIBUTE = "jsonRpcSessionEnvironments";
}
