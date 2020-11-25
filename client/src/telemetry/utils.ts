/*
 * @license
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { workspace, WorkspaceFolder } from "vscode";

export const SFDX_CONFIG_DISABLE_TELEMETRY = 'disableTelemetry';
export const ENV_SFDX_CLI_DISABLE_TELEMETRY = 'SFDX_DISABLE_TELEMETRY';

function hasRootWorkspace(ws: typeof workspace = workspace) {
		return ws && ws.workspaceFolders && ws.workspaceFolders.length > 0;
	}

function getRootWorkspace(): WorkspaceFolder {
		return hasRootWorkspace()
			? workspace.workspaceFolders![0]
			: ({} as WorkspaceFolder);
	}
	
	export function getRootWorkspacePath(): string {
		return getRootWorkspace().uri ? getRootWorkspace().uri.fsPath : '';
	}