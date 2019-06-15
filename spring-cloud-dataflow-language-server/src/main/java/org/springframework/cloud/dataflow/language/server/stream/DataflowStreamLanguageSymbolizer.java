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

import java.util.List;

import org.springframework.cloud.dataflow.core.dsl.AppNode;
import org.springframework.cloud.dataflow.core.dsl.ArgumentNode;
import org.springframework.cloud.dataflow.core.dsl.ParseException;
import org.springframework.cloud.dataflow.core.dsl.SinkDestinationNode;
import org.springframework.cloud.dataflow.core.dsl.SourceDestinationNode;
import org.springframework.cloud.dataflow.core.dsl.StreamNode;
import org.springframework.cloud.dataflow.core.dsl.StreamParser;
import org.springframework.dsl.document.Document;
import org.springframework.dsl.domain.Position;
import org.springframework.dsl.domain.Range;
import org.springframework.dsl.service.DslContext;
import org.springframework.dsl.service.symbol.SymbolizeInfo;
import org.springframework.dsl.service.symbol.Symbolizer;
import org.springframework.dsl.symboltable.model.ClassSymbol;
import org.springframework.dsl.symboltable.model.PredefinedScope;
import org.springframework.dsl.symboltable.support.DefaultSymbolTable;
import org.springframework.dsl.symboltable.support.DocumentSymbolTableVisitor;

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
		DefaultSymbolTable table = new DefaultSymbolTable();

		for (StreamParseItem item : parseStreams(context.getDocument())) {
			StreamNode streamNode = item.getStreamNode();
			int line = item.getRange().getStart().getLine();
			int startPos = streamNode.getStartPos();
			int endPos = streamNode.getEndPos();
			String streamName = streamNode.getStreamName();
			ClassSymbol streamClass = new ClassSymbol(streamName != null ? streamName : "[unnamed]");
			streamClass.setRange(Range.from(line, startPos, line, endPos));
			table.defineGlobal(streamClass);

			SourceDestinationNode sourceDestinationNode = streamNode.getSourceDestinationNode();
			SinkDestinationNode sinkDestinationNode = streamNode.getSinkDestinationNode();

			for (AppNode appNode : streamNode.getAppNodes()) {
				String appName = appNode.getName();
				ClassSymbol appClass = new ClassSymbol(appName);
				appClass.setRange(Range.from(line, startPos, line, endPos));
				streamClass.define(appClass);
				for (ArgumentNode argumentNode : appNode.getArguments()) {
					ClassSymbol argumentClass = new ClassSymbol(argumentNode.getName());
					argumentClass.setRange(Range.from(line, startPos, line, endPos));
					appClass.define(argumentClass);
				}
			}
		}

		DocumentSymbolTableVisitor visitor = new DocumentSymbolTableVisitor();
		table.visitSymbolTable(visitor);
		return visitor.getSymbolizeInfo();
	}
}
