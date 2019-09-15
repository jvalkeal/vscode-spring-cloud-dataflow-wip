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

import org.springframework.cloud.dataflow.core.dsl.AppNode;
import org.springframework.cloud.dataflow.core.dsl.ArgumentNode;
import org.springframework.cloud.dataflow.core.dsl.StreamNode;
import org.springframework.dsl.domain.Range;
import org.springframework.dsl.domain.SymbolKind;
import org.springframework.dsl.service.DslContext;
import org.springframework.dsl.service.symbol.SymbolizeInfo;
import org.springframework.dsl.service.symbol.Symbolizer;
import org.springframework.dsl.symboltable.model.ClassSymbol;
import org.springframework.dsl.symboltable.support.DefaultSymbolTable;
import org.springframework.dsl.symboltable.support.DocumentSymbolTableVisitor;
import org.springframework.util.StringUtils;

/**
 * {@link Symbolizer} for a a {@code stream language}.
 * <p>
 * Symbolizing a stream simply means to split it in a pieces which are a logical
 * structure parts in a dsl. This allows user or ide to know lexical references
 * in a dsl to do cross referencing i.e. to rename a symbol, or check symbol
 * validity in its scope.
 * <p>
 *
 * Optinally a stream can have a name:
 *
 * <pre>
 * stream1 = time | log
 *
 * <pre>
 *
 * Apps can have labels:
 *
 * <pre>
 * timeLabel: time | logLabel: log
 *
 * <pre>
 *
 * Instead of piping from an app, named destination can be used:
 *
 * <pre>
 * time > :myevents
 * :myevents > log
 *
 * <pre>
 *
 * @author Janne Valkealahti
 *
 */
public class DataflowStreamLanguageSymbolizer extends AbstractDataflowStreamLanguageService implements Symbolizer {

	@Override
	public SymbolizeInfo symbolize(DslContext context) {
		return symbolizeInternal(context, null);
	}

	@Override
	public SymbolizeInfo symbolize(DslContext context, String query) {
		return symbolizeInternal(context, query);
	}

	private SymbolizeInfo symbolizeInternal(DslContext context, String query) {
		DefaultSymbolTable table = new DefaultSymbolTable();

		for (StreamParseItem item : parseStreams(context.getDocument())) {
			StreamNode streamNode = item.getStreamNode();
			if (streamNode == null) {
				continue;
			}
			int line = item.getRange().getStart().getLine();
			int startPos = streamNode.getStartPos();
			int endPos = streamNode.getEndPos();
			String streamName = streamNode.getStreamName();
			StreamSymbol streamClass = new StreamSymbol(streamName != null ? streamName : "[unnamed]");
			streamClass.setRange(Range.from(line, startPos, line, endPos));
			table.defineGlobal(streamClass);

			for (int i = 0; i < streamNode.getAppNodes().size(); i++) {
				AppNode appNode = streamNode.getAppNodes().get(i);
				String appName = appNode.getName();
				ClassSymbol appClass;
				if (i == 0) {
					appClass = new SourceSymbol(appName);
				} else if (i == streamNode.getAppNodes().size() - 1) {
					appClass = new SinkSymbol(appName);
				} else {
					appClass = new ProcessorSymbol(appName);
				}
				appClass.setRange(Range.from(line, startPos, line, endPos));
				streamClass.define(appClass);
				for (ArgumentNode argumentNode : appNode.getArguments()) {
					StreamAppOptionSymbol argumentClass = new StreamAppOptionSymbol(argumentNode.getName());
					argumentClass.setRange(Range.from(line, startPos, line, endPos));
					appClass.define(argumentClass);

				}
			}
		}

		DocumentSymbolTableVisitor visitor = new DocumentSymbolTableVisitor(context.getDocument().uri());

		visitor.setSymbolQuery((symbol) -> {
			if (!StringUtils.hasText(query)) {
				return true;
			}
			if (query.startsWith("<")) {
				if (symbol instanceof SourceSymbol) {
					if (query.length() > 1) {
						return symbol.getName().startsWith(query.substring(1));
					}
					return true;
				}
			} else if (query.startsWith("^")) {
				if (symbol instanceof ProcessorSymbol) {
					if (query.length() > 1) {
						return symbol.getName().startsWith(query.substring(1));
					}
					return true;
				}
			} else if (query.startsWith(">")) {
				if (symbol instanceof SinkSymbol) {
					if (query.length() > 1) {
						return symbol.getName().startsWith(query.substring(1));
					}
					return true;
				}
			} else if (query.startsWith("@")) {
				if (symbol instanceof StreamSymbol) {
					if (query.length() > 1) {
						return symbol.getName().startsWith(query.substring(1));
					}
					return true;
				}
			}
			return false;
		});

		table.visitSymbolTable(visitor);
		return visitor.getSymbolizeInfo();
	}

	public static class StreamSymbol extends ClassSymbol {

		StreamSymbol(String name) {
			super(name);
		}

		@Override
		public SymbolKind getKind() {
			return SymbolKind.Class;
		}
	}

	public static class SourceSymbol extends ClassSymbol {

		SourceSymbol(String name) {
			super(name);
		}

		@Override
		public SymbolKind getKind() {
			return SymbolKind.Method;
		}
	}

	public static class ProcessorSymbol extends ClassSymbol {

		ProcessorSymbol(String name) {
			super(name);
		}

		@Override
		public SymbolKind getKind() {
			return SymbolKind.Method;
		}
	}

	public static class SinkSymbol extends ClassSymbol {

		SinkSymbol(String name) {
			super(name);
		}

		@Override
		public SymbolKind getKind() {
			return SymbolKind.Method;
		}
	}

	public static class StreamAppOptionSymbol extends ClassSymbol {

		StreamAppOptionSymbol(String name) {
			super(name);
		}

		@Override
		public SymbolKind getKind() {
			return SymbolKind.Field;
		}
	}
}
