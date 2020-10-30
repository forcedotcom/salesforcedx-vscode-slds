/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

'use strict';

import * as vscode from 'vscode';
import tokens from './data/tokens.json';
import {SLDSContext, ContextKey} from './context';
import { shouldExecuteForDocument } from './utilities';

const Kind = vscode.CompletionItemKind;

const documentSelector = { pattern: '**/*.{css}', scheme: 'file' };
const triggerChars = 'abcdefghijklmnopqrstuvwxyz1234567890('.split('');
const kindMap = {
	'box-shadow':	undefined,
	'color':		Kind.Color,
	'font':			Kind.Text,
	'font-size':	Kind.Unit,
	'font-weight':	Kind.Unit,
	'number':		Kind.Unit,
	'opacity':		Kind.Unit,
	'shadow':		undefined,
	'size':			Kind.Unit,
	'string':		Kind.Text,
	'text-align':	undefined,
	'time':			Kind.Unit,
	'z-index':		Kind.Unit
};

// determine if current state warrants looking for completion items
// if yes return range of text that would be replaced, if no return undefined
function shouldTriggerCompletions(document: vscode.TextDocument, position: vscode.Position): vscode.Range | undefined {
	// must start with "t(", then letters and numbers, optionally ending with a closing ")"
	let triggerRange = document.getWordRangeAtPosition(position, /\bt\([a-z\d]*\)?/i);
	return triggerRange;
}

// get list of completion items to display, potentially replacing the provided text range
function getCompletions(range: vscode.Range): vscode.CompletionList {
	let completions = Object.values(tokens)
		.filter(token => token.deprecated !== 'true')
		.map(token => {
			let completionItem = new vscode.CompletionItem(token.auraToken);
			let text = 't(' + token.auraToken + ')';
			completionItem.kind = kindMap[token.type] || Kind.Value;
			completionItem.filterText = text;
			completionItem.insertText = text;
			completionItem.detail = token.value;
			completionItem.documentation = [token.comment || '', '(' + token.type + ')'].join(' ');
			completionItem.range = range;

			return completionItem;
		});

	return new vscode.CompletionList(completions, false);
}

export function register(): vscode.Disposable {
	const provider = {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, 
			token: vscode.CancellationToken, context: vscode.CompletionContext) {
			if (!!! shouldExecuteForDocument(document.uri))  {
				return undefined;
			}
	
			let triggerRange = SLDSContext.isEnable(ContextKey.GLOBAL, ContextKey.AUTO_SUGGEST, ContextKey.DESIGN_TOKEN)
				 	? shouldTriggerCompletions(document, position) : false;
			return triggerRange ? getCompletions(triggerRange) : undefined;
		}
	};
	return vscode.languages.registerCompletionItemProvider(documentSelector, provider, ...triggerChars);
}
