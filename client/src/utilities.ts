/*
 * @license
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as vscode from 'vscode';
import { ContextKey, SLDSContext } from './context';
import * as fs from 'fs';
import * as path from 'path';

export const shouldExecuteForDocument = (uri: vscode.Uri): 
		boolean => {
		if (SLDSContext.isEnable(ContextKey.SCOPE)) {
				if (uri.scheme === 'file') {
						const filePath: Array<string> = uri.fsPath.split(path.sep);
						const locationOfForceApp: number = filePath.indexOf('force-app');

						if (locationOfForceApp !== -1) {
								return fs.existsSync(
										path.resolve(path.sep, ...filePath.slice(0, locationOfForceApp), `sfdx-project.json`));
						} 
				}
				return false;
		}

		return true;
};

export const shouldSendPayloadToServer = (payload: string) : boolean => {
		if (SLDSContext.isEnable(ContextKey.SCOPE)) {
				const result = payload.match(/"method":"textDocument\/\w+".+"textDocument":{"uri":"([^"]+)"/);

				if (result) {
						const textDocument: string = result[1];
						return shouldExecuteForDocument(vscode.Uri.parse(textDocument));
				}
		}

		return true;
};