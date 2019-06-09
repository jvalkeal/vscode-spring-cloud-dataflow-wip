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
import org.springframework.dsl.jsonrpc.annotation.JsonRpcNotification;
import org.springframework.dsl.jsonrpc.annotation.JsonRpcRequestMapping;
import org.springframework.dsl.jsonrpc.annotation.JsonRpcRequestParams;
import org.springframework.dsl.jsonrpc.session.JsonRpcSession;
import org.springframework.dsl.service.DslContext;

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
        session.getAttributes().put("test", params.getHost());
    }
}
