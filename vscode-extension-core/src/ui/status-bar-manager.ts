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
import { injectable } from "inversify";
import { StatusBarItem, StatusBarAlignment, window } from "vscode";

@injectable()
export class StatusBarManager {

    private statusBarItem: StatusBarItem;

    constructor(
        private command: string
    ){
        this.statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left, 0);
        this.statusBarItem.command = command;
        this.statusBarItem.show();
    }

    public setText(text: string):void {
        this.statusBarItem.text = text;
    }
}