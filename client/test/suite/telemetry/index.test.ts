/*
 * @license
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
const proxyquire = require('proxyquire').noCallThru();
const CLIPath = '../../../src/telemetry/cliConfiguration';
import { ENV_SFDX_CLI_DISABLE_TELEMETRY, SFDX_CONFIG_DISABLE_TELEMETRY} from '../../../src/telemetry/utils';

suite('Telementry', function () {
	setup(() => {
		delete process.env[ENV_SFDX_CLI_DISABLE_TELEMETRY];
	});

	suite('isCLITelemetryAllowed', function () {

	
		test('should return true when the value is not present', async () => {

			const config = require(CLIPath);
			const result: boolean = await config.isCLITelemetryAllowed();
			expect(result).equal(true);
		});

		test('should return false when the value is presented in Workspace Config File', async () => {
			const config = {};
			config[SFDX_CONFIG_DISABLE_TELEMETRY] = 'true';

			const cliConfiguration =  proxyquire.load('../../../src/telemetry/cliConfiguration', {
				fs: {
					existsSync: (path) => path === 'test/.sfdx/sfdx-config.json', 
					readFileSync: () => Buffer.from(JSON.stringify(config))
				}, 
				'./utils': {
					getRootWorkspacePath: () => 'test',
					SFDX_CONFIG_DISABLE_TELEMETRY,
					ENV_SFDX_CLI_DISABLE_TELEMETRY
				}
			});

			const result: boolean = await cliConfiguration.isCLITelemetryAllowed();
			expect(result).equal(false);
		});

		test('should return false when the value is presented in ENV', async () => {
			const config =  proxyquire.load('../../../src/telemetry/cliConfiguration', {
				fs: {
					existsSync: () => false
				}, 
				'./utils': {
					getRootWorkspacePath: () => 'test',
					SFDX_CONFIG_DISABLE_TELEMETRY,
					ENV_SFDX_CLI_DISABLE_TELEMETRY
				}
			});

			process.env[ENV_SFDX_CLI_DISABLE_TELEMETRY] = 'true';

			const result: boolean = await config.isCLITelemetryAllowed();
			expect(result).equal(false);
		});

		test('should return false when the value is presented in GLOBAL Config File', async () => {
			const config = {};
			config[SFDX_CONFIG_DISABLE_TELEMETRY] = 'true';

			const cliConfiguration =  proxyquire.load('../../../src/telemetry/cliConfiguration', {
				fs: {
					existsSync: (path: string) => path.startsWith('test') === false,
					readFileSync: () => Buffer.from(JSON.stringify(config))
				}, 
				'./utils': {
					getRootWorkspacePath: () => 'test',
					SFDX_CONFIG_DISABLE_TELEMETRY,
					ENV_SFDX_CLI_DISABLE_TELEMETRY
				}
			});

			process.env[ENV_SFDX_CLI_DISABLE_TELEMETRY] = 'true';

			const result: boolean = await cliConfiguration.isCLITelemetryAllowed();
			expect(result).equal(false);
		});
	});

	suite('Order of evaluation', () => {
	
		test('should evaluate at this order: Local Config, Global Config', async () => {
			const stacks: Array<any> = [];

			const cliConfiguration =  proxyquire.load('../../../src/telemetry/cliConfiguration', {
				fs: {
					existsSync: (path: string) => {
						if (path.startsWith('test')) {
							stacks.push('local');
						} else {
							stacks.push('global');
						}

						return false;
					}
				}, 
				'./utils': {
					getRootWorkspacePath: () => 'test',
					SFDX_CONFIG_DISABLE_TELEMETRY,
					ENV_SFDX_CLI_DISABLE_TELEMETRY
				}
			});

			await cliConfiguration.isCLITelemetryAllowed();
			expect(stacks).eql(['local', 'global']);
		});

		test('should evaluate at this order: ENV, Global Config', async () => {
			const stacks: Array<any> = [];

			const cliConfiguration =  proxyquire.load('../../../src/telemetry/cliConfiguration', {
				fs: {
					existsSync: (path: string) => {
						if (path.startsWith('test') == false) {
							stacks.push('global');
						}
						return false;
					}
				}, 
				'./utils': {
					getRootWorkspacePath: () => 'test',
					SFDX_CONFIG_DISABLE_TELEMETRY,
					ENV_SFDX_CLI_DISABLE_TELEMETRY
				}
			});

			process.env[ENV_SFDX_CLI_DISABLE_TELEMETRY] = 'true';

			await cliConfiguration.isCLITelemetryAllowed();
			expect(stacks).eql([]);
		});	
	});
});