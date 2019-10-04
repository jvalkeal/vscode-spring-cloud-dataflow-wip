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
package org.springframework.cloud.dataflow.language.server.domain;

import java.util.ArrayList;
import java.util.List;

import org.springframework.util.StringUtils;

public class DataflowEnvironmentParams {

    private List<Environment> environments = new ArrayList<>();
    private String defaultEnvironment;

    public List<Environment> getEnvironments() {
        return environments;
    }

    public void setEnvironments(List<Environment> environments) {
        this.environments = environments;
    }

    public String getDefaultEnvironment() {
        return defaultEnvironment;
    }

    public void setDefaultEnvironment(String defaultEnvironment) {
        this.defaultEnvironment = defaultEnvironment;
    }

    @Override
    public String toString() {
        return "DataflowEnvironmentParams [" + environments + ", defaultEnvironment=" + defaultEnvironment + "]";
    }

    public static class Environment {

        private String url;
        private String name;
        private Credentials credentials = new Credentials();

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Credentials getCredentials() {
            return credentials;
        }

        public void setCredentials(Credentials credentials) {
            this.credentials = credentials;
        }

        @Override
        public String toString() {
            return "DataflowEnvironmentParam [url=" + url + ", username=" + credentials.getUsername() + ", password="
                    + (StringUtils.hasText(credentials.getPassword()) ? "********" : "") + "]";
        }
    }

    public static class Credentials {

        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
