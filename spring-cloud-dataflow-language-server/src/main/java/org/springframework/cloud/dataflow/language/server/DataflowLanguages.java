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
 * Various contansts for dataflow languages integration.
 *
 * @author Janne Valkealahti
 *
 */
public class DataflowLanguages {

	// stream dsl
	public final static String LANGUAGE_STREAM_ID = "scdfs";
	public final static String LANGUAGE_STREAM_DESC = "Spring Cloud Data Flow Stream Language";
	public final static LanguageId LANGUAGE_STREAM = LanguageId.languageId(LANGUAGE_STREAM_ID, LANGUAGE_STREAM_DESC);

	// application import
	public final static String LANGUAGE_APP_ID = "scdfa";
	public final static String LANGUAGE_APP_DESC = "Spring Cloud Data Flow App Import Language";
	public final static LanguageId LANGUAGE_APP = LanguageId.languageId(LANGUAGE_APP_ID, LANGUAGE_APP_DESC);

	// commands and titles
	public final static String COMMAND_STREAM_DEPLOY = "vscode-spring-cloud-dataflow.streams.deploy";
	public final static String COMMAND_STREAM_DEPLOY_TITLE = "Deploy Stream";
	public final static String COMMAND_STREAM_CREATE = "vscode-spring-cloud-dataflow.streams.create";
	public final static String COMMAND_STREAM_CREATE_TITLE = "Create Stream";
	public final static String COMMAND_STREAM_DESTROY = "vscode-spring-cloud-dataflow.streams.destroy";
	public final static String COMMAND_STREAM_DESTROY_TITLE = "Destroy Stream";
	public final static String COMMAND_APP_REGISTER = "vscode-spring-cloud-dataflow.apps.register";
	public final static String COMMAND_APP_REGISTER_TITLE = "Register Application";
	public final static String COMMAND_APP_UNREGISTER = "vscode-spring-cloud-dataflow.apps.unregister";
	public final static String COMMAND_APP_UNREGISTER_TITLE = "Unregister Application";

	// dsl context attribute names
	public final static String CONTEXT_SESSION_ENVIRONMENTS_ATTRIBUTE = "jsonRpcSessionEnvironments";
}
