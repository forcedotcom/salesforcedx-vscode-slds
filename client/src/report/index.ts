import * as vscode from 'vscode';
import { ContextKey, SLDSContext } from './../context';
import * as fs from 'fs';
import * as path from 'path';
import { LanguageClient } from "vscode-languageclient/node";
import { updateStatusBar } from './../utilities';

export const  handleReportCommand = async (languageClient: LanguageClient, outputChannel: vscode.OutputChannel ) => {

    const availableTargets: ReportParam[] = getApplicableReportFolders();
    const targets = await vscode.window.showQuickPick(availableTargets, {
      placeHolder: 'Select the folder(s) to perform analysis',
      canPickMany: true,
    });

    if (targets?.length > 0) {
      let message = 'The following folder were selected\r\n';
      targets.forEach((value) => {
        message += `  '${value.detail}'\r\n`;
      });
      outputChannel.appendLine(message);

      if (!SLDSContext.isEnable(ContextKey.SCOPE)) {
        const availableOutputs: vscode.QuickPickItem[] =
          vscode.workspace.workspaceFolders.map(folder => ({
            label: folder.name,
            detail: folder.uri.fsPath
          }));

        const output = await vscode.window.showQuickPick(availableOutputs, {
          placeHolder: 'Enter the output directory for the report',
        });

        targets.forEach(target => {
          target.outputDirectory = output.detail;
        });
      }

      languageClient.sendNotification('report/execute', targets).then(async () => {
        const outputLocation: Set<string> = new Set<string>();

        targets.forEach(target => outputLocation.add(target.outputDirectory));

        let output = `SLDS validation report can be found at the following location:\r\n`;
        outputLocation.forEach((item) => {
          const reportLocation = path.resolve(item, 'slds-report.sarif');
          output += ` '${reportLocation}'\r\n`;
        });
  
        outputChannel.appendLine(output);
        updateStatusBar('SLDS validation report generated');
      }).catch((reason: any) => {
        outputChannel.appendLine(`Report was not generated: ${reason}`);
      });

      updateStatusBar('Generating SLDS validation report');
    } else {
      outputChannel.appendLine('No folder was selected to perform the analysis.');
    }
  };

const generateReportParam = (label: string, sourceDirectory: string, workspaceRoot: string) : ReportParam => {
    return ({
      label, alwaysShow: true, picked: true,
      detail: sourceDirectory, sourceDirectory,
      workspaceRoot: workspaceRoot,
      outputDirectory: workspaceRoot
    });
};

interface ReportParam extends vscode.QuickPickItem {
    workspaceRoot: string;
    outputDirectory: string;
    sourceDirectory?: string;
}

const getApplicableReportFolders = (): Array<ReportParam> => {
    const results: Array<ReportParam> = [];
  
    vscode.workspace.workspaceFolders?.forEach((workspaceFolder) => {
      const workspaceRoot = workspaceFolder.uri.fsPath;
  
      if (SLDSContext.isEnable(ContextKey.SCOPE)) {
        if (
          fs.existsSync(
            path.resolve(workspaceFolder.uri.fsPath, 'sfdx-project.json')
          )
        ) {
          const auraFolder = path.resolve(
            workspaceFolder.uri.fsPath,
            'force-app',
            'main',
            'default',
            'aura'
          );
          if (fs.existsSync(auraFolder)) {
            results.push(generateReportParam(`${workspaceFolder.name} - Aura Components`, auraFolder, workspaceRoot));
          }
  
          const lwcFolder = path.resolve(
            workspaceFolder.uri.fsPath,
            'force-app',
            'main',
            'default',
            'lwc'
          );
          if (fs.existsSync(lwcFolder)) {
            results.push(generateReportParam(`${workspaceFolder.name} - Lightning Web Components`, lwcFolder, workspaceRoot));
          }
        }
      } else {
        results.push(generateReportParam(workspaceFolder.name, workspaceRoot, workspaceRoot));
      }
    });
  
    return results;
  };