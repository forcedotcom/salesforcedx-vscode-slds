/*
 * @license
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as vscode from 'vscode';
import { ContextKey } from './contextKey';
import { LanguageClient } from 'vscode-languageclient';

const CONFIG_KEY: string = 'salesforcedx-vscode-slds';

const MAPPINGS: Map<ContextKey, string> = new Map<ContextKey, string>([
	[ContextKey.GLOBAL, 'enabled'], 
	[ContextKey.AUTO_SUGGEST, 'enhancements.autoSuggest'],
	[ContextKey.BEM, 'basic.bemNaming'],
	[ContextKey.DENSITY, 'enhancements.density'],
	[ContextKey.DEPRECATED, 'basic.deprecated'],
	[ContextKey.OVERRIDE, 'basic.override'],
	[ContextKey.DESIGN_TOKEN, 'basic.designToken'],
	[ContextKey.INVALID, 'basic.invalid'],
	[ContextKey.UTILITY_CLASS, 'enhancements.utilityClasses'],
	[ContextKey.SCOPE, 'file.scopeWithInSFDX']
]);

export class SLDSContext {
	context: vscode.ExtensionContext;
	languageClient: LanguageClient;
	configuration: vscode.WorkspaceConfiguration;

	constructor(context: vscode.ExtensionContext, languageClient: LanguageClient) {
		this.context = context;
		this.languageClient = languageClient;
		this.configuration = vscode.workspace.getConfiguration(CONFIG_KEY);

		this.upgradeContextConfiguration(context);
		this.syncContextWithServer(MAPPINGS.keys());
		vscode.workspace.onDidChangeConfiguration((e) => this.configurationChangeHandler(e));
	}

	private upgradeContextConfiguration(context: vscode.ExtensionContext): void {
		for (let [key] of MAPPINGS) {
			const result: boolean = context.globalState.get(key);
			if (result !== undefined) {
				this.updateState(key, result);
				context.globalState.update(key, undefined);
			}
		}
	}

	private configurationChangeHandler(event: vscode.ConfigurationChangeEvent) : void {
		const keys: Array<ContextKey> = [];

		for (let [key, value] of MAPPINGS) {
			if (event.affectsConfiguration(`${CONFIG_KEY}.${value}`)) {
				keys.push(key);		
			}
		}

		if (keys.length !== 0) {
			this.syncContextWithServer(keys);
		}
	}

	private syncContextWithServer(keys: Iterable<ContextKey>): void {
		this.languageClient.onReady().then(() => {
			for (let key of keys) {
				const contextKey: ContextKey = <ContextKey>key;
				const value = SLDSContext.isEnable(contextKey);
				if (SLDSContext.shouldNotifyServerOfContextChange(contextKey)) {
					this.languageClient.sendNotification('state/updateState', { key, value });
				}
			}
		});
	}  

	public updateState(key: ContextKey, value: boolean) {
		//accounting for situtation where workspace is not available
		const setGlobal: boolean = vscode.workspace.name === undefined;
		this.configuration.update(MAPPINGS.get(key), value, setGlobal);
	}

	private static shouldNotifyServerOfContextChange(key: ContextKey): boolean {
		return key !== ContextKey.SCOPE;
	}

	public static isEnable(...keys: ContextKey[]): boolean {
		const workspace: vscode.WorkspaceConfiguration =  vscode.workspace.getConfiguration(CONFIG_KEY);

		for (let key of keys) {
			const value: boolean = workspace.get<boolean>(MAPPINGS.get(key));

			if (value === false ) {
				return false;
			}

			/*
				Disable Utility Class Detection
				See Issue For More Context: https://github.com/forcedotcom/salesforcedx-slds-lsp/issues/22
			*/
			if (key === ContextKey.UTILITY_CLASS) {
				return false;
			}
		}

		return true;
	}
}
