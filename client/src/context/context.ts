/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as vscode from 'vscode';
import { ContextKey } from './contextKey';
import { LanguageClient } from 'vscode-languageclient';

const CONFIG_KEY: string = "salesforcedx-vscode-slds";

const MAPPINGS: Map<ContextKey, string> = new Map<ContextKey, string>([
	[ContextKey.GLOBAL, "enabled"], 
	[ContextKey.AUTO_SUGGEST, "enhancements.autoSggest"],
	[ContextKey.BEM, "basic.bemNaming"],
	[ContextKey.DENSITY, "enhancements.density"],
	[ContextKey.DEPRECATED, "basic.deprecated"],
	[ContextKey.OVERRIDE, "basic.override"],
	[ContextKey.DESIGN_TOKEN, "basic.designToken"],
	[ContextKey.INVALID, "basic.invalid"],
	[ContextKey.UTILITY_CLASS, "enhancements.utilityClasses"],
	[ContextKey.SCOPE, "file.scopeWithInSFDX"]
]);

export class SLDSContext {
	context: vscode.ExtensionContext;
	languageClient: LanguageClient;

	constructor(context: vscode.ExtensionContext, languageClient: LanguageClient) {
		this.context = context;
		this.languageClient = languageClient;

		this.syncServer();

		const self = this;

		vscode.workspace.onDidChangeConfiguration((event: vscode.ConfigurationChangeEvent) => {
			for (let [key, value] of MAPPINGS) {

				if (event.affectsConfiguration(`${CONFIG_KEY}${value}`) &&
					SLDSContext.shouldNotifyServerOfContextChange(key)) {

					self.languageClient.onReady().then(() => {
						self.languageClient.sendNotification('state/updateState', { key, value });
					});
				}
			}
		});
	}

	private syncServer(): void {
		this.languageClient.onReady().then(() => {
			for (var key in ContextKey) {
				const contextKey: ContextKey = <ContextKey>key;
				const value = SLDSContext.isEnable(contextKey);
				if (SLDSContext.shouldNotifyServerOfContextChange(contextKey)) {
					this.languageClient.sendNotification('state/updateState', { key, value });
				}
			}
		});
	}

	public updateState(key: ContextKey, value: boolean) {
		vscode.workspace.getConfiguration("salesforcedx-vscode-slds").update(MAPPINGS.get(key), value);
	}

	private static shouldNotifyServerOfContextChange(key: ContextKey): boolean {
		return key !== ContextKey.SCOPE;
	}

	public static isEnable(...keys: ContextKey[]): boolean {
		const workspace: vscode.WorkspaceConfiguration =  vscode.workspace.getConfiguration("salesforcedx-vscode-slds");

		for (let key of keys) {
			const value: boolean = workspace.get<boolean>(MAPPINGS.get(key));

			if (value === false) {
				return false;
			}
		}

		return true;
	}
}
