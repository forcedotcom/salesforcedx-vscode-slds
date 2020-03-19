/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as vscode from 'vscode';
import {
  PUSH_OR_DEPLOY_ON_SAVE_ENABLED,
  RETRIEVE_TEST_CODE_COVERAGE,
  SFDX_CORE_CONFIGURATION_NAME,
  SHOW_CLI_SUCCESS_INFO_MSG,
  TELEMETRY_ENABLED
} from '../constants';
/**
 * A centralized location for interacting with sfdx-core settings.
 */
export class SfdxCoreSettings {
  private static instance: SfdxCoreSettings;

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public static getInstance() {
    if (!SfdxCoreSettings.instance) {
      SfdxCoreSettings.instance = new SfdxCoreSettings();
    }
    return SfdxCoreSettings.instance;
  }

  /**
   * Get the configuration for a sfdx-core
   */
  public getConfiguration(): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration(SFDX_CORE_CONFIGURATION_NAME);
  }

  public getShowCLISuccessMsg(): boolean {
    return this.getConfigValue<boolean>(SHOW_CLI_SUCCESS_INFO_MSG, true);
  }

  // checks for Microsoft's telemetry setting as well as Salesforce's telemetry setting.
  public getTelemetryEnabled(): boolean {
    return (
      vscode.workspace
        .getConfiguration('telemetry')
        .get<boolean>('enableTelemetry', true) &&
			this.getConfigValue<boolean>(TELEMETRY_ENABLED, true)
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public async updateShowCLISuccessMsg(value: boolean) {
    await this.setConfigValue(SHOW_CLI_SUCCESS_INFO_MSG, value);
  }

  public getPushOrDeployOnSaveEnabled(): boolean {
    return this.getConfigValue<boolean>(PUSH_OR_DEPLOY_ON_SAVE_ENABLED, false);
  }

  public getRetrieveTestCodeCoverage(): boolean {
    return this.getConfigValue(RETRIEVE_TEST_CODE_COVERAGE, false);
  }

  private getConfigValue<T>(key: string, defaultValue: T): T {
    return this.getConfiguration().get<T>(key, defaultValue);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private async setConfigValue(key: string, value: any) {
    await this.getConfiguration().update(key, value);
  }
}
