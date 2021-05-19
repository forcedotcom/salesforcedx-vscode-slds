/*
 * @license
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

'use strict';

import * as fs from 'fs';
import * as path from 'path';
import * as net from 'net';
import * as child_process from "child_process";
import { workspace, ExtensionContext, OutputChannel } from 'vscode';
import { LanguageClient, LanguageClientOptions, StreamInfo } from 'vscode-languageclient';
import { Transform, TransformCallback } from 'stream';
import { shouldSendPayloadToServer } from './utilities';

declare var v8debug: any;
const DEBUG = (typeof v8debug === 'object') || startedInDebugMode();

const documentSelector = [
	{ scheme: 'file', language: 'css' },
	{ scheme: 'file', language: 'html' },
	{ scheme: 'file', language: 'javascript' }
];

function startedInDebugMode(): boolean {
	let args = (process as any).execArgv;
	if (args) {
		return args.some((arg: string) => /^--debug=?/.test(arg) || /^--debug-brk=?/.test(arg) || /^--inspect=?/.test(arg) || /^--inspect-brk=?/.test(arg));
	}
	return false;
}

// MIT Licensed code from: https://github.com/georgewfraser/vscode-javac
function findJavaExecutable(binname: string) {
	binname = correctBinname(binname);
	
	// First search if they have an existing java.home Apex setting
	let javaApexConfig: string | undefined = readJavaConfig();
	if (javaApexConfig) {
		const binpath = findBinPath(javaApexConfig, binname);
		if (binpath) return binpath;
	}

	// Then search each JAVA_HOME bin folder
	if (process.env['JAVA_HOME']) {
		const binpath = findBinPath(process.env['JAVA_HOME'], binname);
		if (binpath) return binpath;
	}

	// Then search each JDK_HOME bin folder
	if (process.env['JDK_HOME']) {
		const binpath = findBinPath(process.env['JDK_HOME'], binname);
		if (binpath) return binpath;
	}

	// Else return the binary name directly (this will likely always fail downstream)
	return null;
}

function findBinPath(config: string, binname: string) {
	let workspaces = config.split(path.delimiter);

	for (let i = 0; i < workspaces.length; i++) {
		let binpath = path.join(workspaces[i], 'bin', binname);
		if (fs.existsSync(binpath)) {
			return binpath;
		}
	}

	return null;
}

function readJavaConfig(): string {
	const config = workspace.getConfiguration();
	// console.log(config.get<string>('salesforcedx-vscode-slds.java.home', ''));
	return config.get<string>('salesforcedx-vscode-apex.java.home', '');
}

function correctBinname(binname: string) {
	if (process.platform === 'win32')
		return binname + '.exe';
	else
		return binname;
}

function createServerOptions(context: ExtensionContext, outputChannel: OutputChannel): () => Promise<StreamInfo> {
	return createServerPromise.bind(this, context, outputChannel);
}

function createServerPromise(context: ExtensionContext, outputChannel: OutputChannel): Promise<StreamInfo> {
	return new Promise((resolve, reject) => {
		var server = net.createServer((socket) => {
			outputChannel.appendLine("SLDS Started");

			const matcher = /("character":1.7976931348623157e\+308)/;
			const javaMaxIntValue = 2147483647;
			const replacer = '"character":' + javaMaxIntValue + '}}';
			
			// Temporary solution for an LWC plugin issue where the end character range is too large for SLDS LSP server.
			let filteredDuplex = new class extends Transform {
				
				private data: Array<Buffer> = [];

				_transform(chunk: Buffer, encoding: string, callback: TransformCallback) {
					const contentLength = /^Content-Length: /;
					let buf: string = Buffer.from(chunk).toString();

					/*
						JSONRPC send 2 types of messages:
						1. Header - indicates Content Length
						2. Payload
					*/
					if (contentLength.test(buf)) {
						//content length triggers reset
						this.data = [];
						this.data.push(chunk);
					} else {
						const sendData: boolean = shouldSendPayloadToServer(buf);

						if (sendData) {
							buf = buf.replace(matcher, replacer);
							this.data.push(Buffer.from(buf));
							this.data.forEach((item)=> this.push(item, encoding));
						}
					}

					callback();
				}
			} ();

			filteredDuplex.pipe(socket);

			resolve({
				reader: socket,
				writer: filteredDuplex
			});
		})
		.on('end', () => console.log("Disconnected"))
		.on('error', (err) => {
			// handle errors here
			outputChannel.appendLine("SLDS failed to start");
			throw err;
		});

		let javaExecutablePath = findJavaExecutable('java');

		// grab a random port.
		server.listen(() => {
			// Start the child java process
			let options = { cwd: workspace.rootPath };

			const { port } = server.address() as net.AddressInfo;
			console.log(`Listening on port ${port}`);

			let args = [];
			
			if (DEBUG) {
				args.push('-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=1044');
				// suspend=y is the default. Use this form if you need to debug the server startup code:
				//  params.push('-agentlib:jdwp=transport=dt_socket,server=y,address=1044');
			}

			args.push('-jar');
			args.push(path.resolve(context.extensionPath, 'lsp-0.0.9-executable.jar'));
			args.push(`--PORT=${port.toString()}`);

			let process = child_process.spawn(javaExecutablePath, args, options);

			const storagePath: string = context.storagePath ? context.storagePath : context.globalStoragePath;
			if (!fs.existsSync(storagePath)) {
				fs.mkdirSync(storagePath);
			}

			const logFile: string = `${storagePath}/slds-extension.log`;
			let logStream = fs.createWriteStream(logFile, { flags: 'w' });

			process.stdout.pipe(logStream);
			process.stderr.pipe(logStream);

			outputChannel.appendLine(`Storing LSP server log in '${logFile}'`);
		});
	});
}

function createClientOptions(outputChannel: OutputChannel): LanguageClientOptions {
	// Options to control the language client
	return {
		documentSelector: documentSelector,
		outputChannel: outputChannel,
		synchronize: {
			fileEvents: [
				workspace.createFileSystemWatcher('**/*.[cmp,html,js,css,app]')
			]
		}
	};
}

export function createLanguageClient(context: ExtensionContext, outputChannel: OutputChannel): LanguageClient {
	let serverOptions = createServerOptions(context, outputChannel);
	let clientOptions = createClientOptions(outputChannel);
	let client = new LanguageClient('sldsValidation', 'SLDS Validation', serverOptions, clientOptions);
	return client;
}
