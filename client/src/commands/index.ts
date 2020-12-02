/*
 * @license
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

'use strict';

import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient';
import { ContextKey, SLDSContext } from './../context';

export class Commands {
	context: SLDSContext;
	outputChannel:vscode.OutputChannel;

	constructor(context: vscode.ExtensionContext, languageClient: LanguageClient, outputChannel: vscode.OutputChannel) {
		this.context = new SLDSContext(context, languageClient);
		this.outputChannel = outputChannel;
	}

	register() : void {
		vscode.commands.registerCommand('slds.enable', ()=>
			this.context.updateState(ContextKey.GLOBAL, true));
		vscode.commands.registerCommand('slds.disable', ()=>
			this.context.updateState(ContextKey.GLOBAL, false));
		vscode.commands.registerCommand('slds.enable:density', ()=>
			this.context.updateState(ContextKey.DENSITY, true));
		vscode.commands.registerCommand('slds.disable:density', ()=>
			this.context.updateState(ContextKey.DENSITY,false));
		vscode.commands.registerCommand('slds.enable:utility', ()=>
			this.context.updateState(ContextKey.UTILITY_CLASS, true));
		vscode.commands.registerCommand('slds.disable:utility', ()=>
			this.context.updateState(ContextKey.UTILITY_CLASS, false));
		vscode.commands.registerCommand('slds.enable:bem', ()=>
			this.context.updateState(ContextKey.BEM, true));
		vscode.commands.registerCommand('slds.disable:bem', ()=>
			this.context.updateState(ContextKey.BEM, false));
		vscode.commands.registerCommand('slds.enable:deprecated', ()=>
			this.context.updateState(ContextKey.DEPRECATED, true));
		vscode.commands.registerCommand('slds.disable:deprecated', ()=>
			this.context.updateState(ContextKey.DEPRECATED, false));
		vscode.commands.registerCommand('slds.enable:invalid', ()=>
			this.context.updateState(ContextKey.INVALID, true));
		vscode.commands.registerCommand('slds.disable:invalid', ()=>
			this.context.updateState(ContextKey.INVALID, false));
		vscode.commands.registerCommand('slds.enable:override', ()=>
			this.context.updateState(ContextKey.OVERRIDE, true));
		vscode.commands.registerCommand('slds.disable:override', ()=>
			this.context.updateState(ContextKey.OVERRIDE, false));
		vscode.commands.registerCommand('slds.enable:designToken', ()=>
			this.context.updateState(ContextKey.DESIGN_TOKEN, true));
		vscode.commands.registerCommand('slds.disable:designToken', ()=>
			this.context.updateState(ContextKey.DESIGN_TOKEN, false));
		vscode.commands.registerCommand('slds.enable:autoSuggest', ()=>
			this.context.updateState(ContextKey.AUTO_SUGGEST, true));
		vscode.commands.registerCommand('slds.disable:autoSuggest', ()=>
			this.context.updateState(ContextKey.AUTO_SUGGEST, false));
		vscode.commands.registerCommand('slds.enable:scope', ()=>
			this.context.updateState(ContextKey.SCOPE, true));
		vscode.commands.registerCommand('slds.disable:scope', ()=>
			this.context.updateState(ContextKey.SCOPE, false));
	}
}
