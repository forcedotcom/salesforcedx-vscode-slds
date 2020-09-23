/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as vscode from 'vscode';
import { ContextKey } from './contextKey';
import { LanguageClient } from 'vscode-languageclient';

export class SLDSContext {
	context: vscode.ExtensionContext;
	languageClient: LanguageClient;

	constructor(context: vscode.ExtensionContext, languageClient: LanguageClient) {
		this.context = context;
		this.languageClient = languageClient;

		this.syncServer();
	}

	private syncServer(): void {
		this.languageClient.onReady().then(() => {
			for (var key in ContextKey) {
				const contextKey: ContextKey = <ContextKey>key;
				const value = SLDSContext.isEnable(this.context, contextKey);
				if (SLDSContext.shouldNotifyServerOfContextChange(contextKey)) {
					this.languageClient.sendNotification('state/updateState', { key, value });
				}
			}
		});
	}

	public updateState(key: ContextKey, value: boolean) {
		this.context.globalState.update(key, value);

		if (SLDSContext.shouldNotifyServerOfContextChange(key)) {
			this.languageClient.onReady().then(() => {
				this.languageClient.sendNotification('state/updateState', { key, value });
			});
		}
	}

	private static shouldNotifyServerOfContextChange(key: ContextKey): boolean {
		return key !== ContextKey.SCOPE;
	}

	public static isEnable(context: vscode.ExtensionContext, ...keys: ContextKey[]): boolean {
		for (var key in keys) {
			if (context.globalState.get(key) === false) {
				return false;
			}
		}

		return true;
	}
}
