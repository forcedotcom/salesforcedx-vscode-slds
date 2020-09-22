import * as vscode from 'vscode';
import { ContextKey, SLDSContext } from './context';
import * as fs from 'fs';
import * as path from 'path';

export const shouldExecuteForDocument = (context: vscode.ExtensionContext, uri: vscode.Uri): 
		boolean => {
		if (SLDSContext.isEnable(context, ContextKey.SCOPE)) {
				if (uri.scheme === 'file') {
						const filePath: Array<string> = uri.fsPath.split(path.sep);
						const locationOfForceApp: number = filePath.indexOf('force-app');

						if (locationOfForceApp !== -1) {
								return fs.existsSync(
										path.resolve(...filePath.slice(0, locationOfForceApp), `sfdx-project.json`));
						} 
				}
				return false;
		}

		return true;
};

export const shouldSendPayloadToServer = (context: vscode.ExtensionContext, payload: string) : boolean => {
		if (SLDSContext.isEnable(context, ContextKey.SCOPE)) {
				const result = payload.match(/"method":"textDocument\/\w+".+"textDocument":{"uri":"([^"]+)"/);

				if (result) {
						const textDocument: string = result[1];
						return shouldExecuteForDocument(context, vscode.Uri.parse(textDocument));
				}
		}

		return true;
};