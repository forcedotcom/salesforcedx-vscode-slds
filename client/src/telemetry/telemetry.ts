/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import vscode = require('vscode');
import { sfdxCoreSettings } from '../settings';
import TelemetryReporter from './telemetryReporter';
import {
  TELEMETRY_GLOBAL_VALUE,
  EXTENSION_NAME,
  TELEMETRY_OPT_OUT_LINK
} from '../constants';

interface CommandMetric {
  extensionName: string;
  commandName: string;
  executionTime?: string;
}

export class TelemetryService {
  private static instance: TelemetryService;
  private context: vscode.ExtensionContext | undefined;
  private reporter: TelemetryReporter | undefined;

  public static getInstance() {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService();
    }
    return TelemetryService.instance;
  }

  public isTelemetryEnabled(): boolean {
    return sfdxCoreSettings.getTelemetryEnabled();
  }

  private getHasTelemetryMessageBeenShown(): boolean {
    if (this.context === undefined) {
      return true;
    }

    const sfdxTelemetryState = this.context.globalState.get(TELEMETRY_GLOBAL_VALUE);

    return typeof sfdxTelemetryState === 'undefined';
  }

  private setTelemetryMessageShowed(): void {
    if (this.context === undefined) {
      return;
    }

    this.context.globalState.update(TELEMETRY_GLOBAL_VALUE, true);
  }

  public showTelemetryMessage() {
    // check if we've ever shown Telemetry message to user
    const showTelemetryMessage = this.getHasTelemetryMessageBeenShown();

    if (showTelemetryMessage) {
      // Show the message and set telemetry to true;
      const showButtonText = 'Read more';//nls.localize('telemetry_legal_dialog_button_text');
      const showMessage =  'You agree that Salesforce Extensions for VS Code may collect usage information, user environment, and crash reports for product improvements. Learn how to [opt out](%s).';//,nls.localize('telemetry_legal_dialog_message',TELEMETRY_OPT_OUT_LINK);
      vscode.window
        .showInformationMessage(showMessage, showButtonText)
        .then(selection => {
          // Open disable telemetry link
          if (selection && selection === showButtonText) {
            vscode.commands.executeCommand(
              'vscode.open',
              vscode.Uri.parse(TELEMETRY_OPT_OUT_LINK)
            );
          }
        });
      this.setTelemetryMessageShowed();
    }
  }

  public sendExtensionActivationEvent(hrstart: [number, number]): void {
    if (this.reporter !== undefined && this.isTelemetryEnabled) {
      const startupTime = this.getEndHRTime(hrstart);
      this.reporter.sendTelemetryEvent('activationEvent', {
        extensionName: EXTENSION_NAME,
        startupTime
      });
    }
  }

  public sendExtensionDeactivationEvent(): void {
    if (this.reporter !== undefined && this.isTelemetryEnabled()) {
      this.reporter.sendTelemetryEvent('deactivationEvent', {
        extensionName: EXTENSION_NAME
      });
    }
  }

  public sendError(errorMsg: string): void {
    if (this.reporter !== undefined && this.isTelemetryEnabled) {
      this.reporter.sendTelemetryEvent('coreError', {
        extensionName: EXTENSION_NAME,
        errorMsg
      });
    }
  }

  public sendEventData(
    eventName: string,
    properties?: { [key: string]: string },
    measures?: { [key: string]: number }
  ): void {
    if (this.reporter !== undefined && this.isTelemetryEnabled) {
      this.reporter.sendTelemetryEvent(eventName, properties, measures);
    }
  }

  public sendErrorEvent(errorMsg: string, callstack: string): void {
    if (this.reporter !== undefined && this.isTelemetryEnabled) {
      this.reporter.sendTelemetryEvent('error', {
        extensionName: EXTENSION_NAME,
        errorMessage: errorMsg,
        errorStack: callstack
      });
    }
  }

  public dispose(): void {
    if (this.reporter !== undefined) {
      this.reporter.dispose().catch(err => console.log(err));
    }
  }

}
