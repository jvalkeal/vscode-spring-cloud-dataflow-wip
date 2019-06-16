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
package org.springframework.cloud.dataflow.language.server.app;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.springframework.cloud.dataflow.language.server.DataflowLanguages;
import org.springframework.dsl.document.Document;
import org.springframework.dsl.domain.Range;
import org.springframework.dsl.service.AbstractDslService;
import org.springframework.dsl.service.DslService;

/**
 * Base {@link DslService} implementation for {@link DataflowLanguages#LANGUAGE_APP}.
 *
 * @author Janne Valkealahti
 *
 */
public abstract class AbstractAppLanguageService extends AbstractDslService {

	public AbstractAppLanguageService() {
		super(DataflowLanguages.LANGUAGE_APP);
	}

	protected Collection<AppEntry> parseApps(Document document) {
		Map<String, AppEntry> apps = new HashMap<>();
		for (int line = 0; line < document.lineCount(); line++) {
            Range lineRange = document.getLineRange(line);
			String content = document.content(lineRange);
			String[] split1 = content.split("=");
			if (split1.length == 2) {
				String[] split2 = split1[0].split("\\.");
				if (split2.length == 2) {
					String name = split2[1];
					AppEntry ae = apps.get(name);
					Range appRange = Range.from(line, 0, line, split1[0].length());
					if (ae == null) {
						ae = new AppEntry(split2[0], name, appRange, null, split1[1], null);
						apps.put(name, ae);
					} else {
						ae.setAppRange(appRange);
						ae.setAppUri(split1[1]);
					}
				} else if (split2.length == 3) {
					String name = split2[1];
					AppEntry ae = apps.get(name);
					Range metadataRange = Range.from(line, 0, line, split1[0].length());
					if (ae == null) {
						ae = new AppEntry(split2[0], name, null, metadataRange, null, split1[1]);
						apps.put(name, ae);
					} else {
						ae.setMetadataRange(metadataRange);
						ae.setMetadataUri(split1[1]);
					}
				}
			}
		}
		return apps.values();
	}

	protected static class AppEntry {

		private String type;
		private String name;
		private String appUri;
		private String metadataUri;
		private Range appRange;
		private Range metadataRange;

		AppEntry(String type, String name, Range appRange, Range metadataRange, String appUri, String metadataUri) {
			this.type = type;
			this.name = name;
			this.appRange = appRange;
			this.metadataRange = metadataRange;
			this.appUri = appUri;
			this.metadataUri = metadataUri;
		}

		public String getType() {
			return type;
		}

		public String getName() {
			return name;
		}

		public Range getAppRange() {
			return appRange;
		}

		public void setAppRange(Range appRange) {
			this.appRange = appRange;
		}

		public Range getMetadataRange() {
			return metadataRange;
		}

		public void setMetadataRange(Range metadataRange) {
			this.metadataRange = metadataRange;
		}

		public void setAppUri(String appUri) {
			this.appUri = appUri;
		}

		public String getAppUri() {
			return appUri;
		}

		public void setMetadataUri(String metadataUri) {
			this.metadataUri = metadataUri;
		}

		public String getMetadataUri() {
			return metadataUri;
		}
	}
}
