/*
 * @license
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

'use strict';

import * as vscode from 'vscode';
import { LanguageClient, Disposable } from 'vscode-languageclient/node';
import { createLanguageClient } from './sldsLanguageClient';
import * as componentsProvider from './sldsComponentsProvider';
import * as utilitiesProvider from './sldsUtilitiesProvider';
import * as varTokensProvider from './sldsVarTokensProvider';
import * as auraTokensProvider from './sldsAuraTokensProvider';
import { Commands } from './commands';
import { telemetryService } from './telemetry';

const outputChannel : vscode.OutputChannel = vscode.window.createOutputChannel(`SLDS`);

export async function activate(context: vscode.ExtensionContext) {
	// Telemetry service
	await telemetryService.initializeService(context);
	telemetryService.showTelemetryMessage();
	const extensionHRStart = process.hrtime();

	// SLDS validation language client
	outputChannel.append(`Starting SLDS ... `);
	const languageClient : LanguageClient = createLanguageClient(context, outputChannel);
	languageClient.start();
	context.subscriptions.push(languageClient);

	// SLDS Commands
	outputChannel.append(`registering commands ... `);
	const commands : Commands = new Commands(context, languageClient, outputChannel);
	commands.register();

	outputChannel.appendLine(`registering providers`);
	// SLDS components completion provider
	let components : Disposable = componentsProvider.register();
	context.subscriptions.push(components);

	// SLDS utilities completion provider
	let utilities : Disposable = utilitiesProvider.register();
	context.subscriptions.push(utilities);

	// SLDS var tokens completion provider
	let varTokens : Disposable = varTokensProvider.register();
	context.subscriptions.push(varTokens);

	// SLDS aura tokens completion provider
	let auraTokens : Disposable = auraTokensProvider.register();
	context.subscriptions.push(auraTokens);

	// send activationEvent
	telemetryService.sendExtensionActivationEvent(extensionHRStart);
}

export function deactivate(): Thenable<void> | undefined {
	telemetryService.sendExtensionDeactivationEvent();
	return;
}
