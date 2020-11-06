import * as path from 'path';
import { TelemetryService } from './telemetry';
import { ENV_SFDX_CLI_DISABLE_TELEMETRY, getRootWorkspacePath, SFDX_CONFIG_DISABLE_TELEMETRY } from './utils';
import * as fs from 'fs';
const homedir = require('os').homedir();

export const isCLITelemetryAllowed = async (): Promise<boolean> => {
	try {
		const disabledConfig =
			(await getConfigValue(SFDX_CONFIG_DISABLE_TELEMETRY)) || '';
		return disabledConfig !== 'true';
	} catch (e) {
		console.log('Error checking cli settings: ' + e);
	}
	return true;
};

const getConfigValue = async (key: string): Promise<any | undefined> => {
	try {
		//workspace configuration
		const workspacePath: string = getRootWorkspacePath();
		const localConfigPath: string = path.join(workspacePath, '.sfdx', 'sfdx-config.json');
		if (fs.existsSync(localConfigPath)) {
			const myLocalConfig: Buffer = fs.readFileSync(localConfigPath);
			const localValue = JSON.parse(myLocalConfig.toString())[SFDX_CONFIG_DISABLE_TELEMETRY];
			if (localValue != null && localValue != undefined) {
				return localValue;
			}
		}
	} catch (err) {
		TelemetryService.getInstance()
			.sendException('get_config_value_local', err.message);
		return undefined;
	}
	try {
		//environment configuration
		const envValue = process.env[ENV_SFDX_CLI_DISABLE_TELEMETRY];
		if (envValue != null && envValue != undefined) {
			return envValue;
		}

		//global configuration
		const globalPath: string = path.join(homedir, '.sfdx', 'sfdx-config.json');
		if (fs.existsSync(globalPath)) {
			const globalConfig: Buffer = fs.readFileSync(globalPath);
			const globalValue = JSON.parse(globalConfig.toString())[SFDX_CONFIG_DISABLE_TELEMETRY];
			if (globalValue != null && globalValue != undefined) {
				return globalValue;
			}
		}
	} catch (err) {
		TelemetryService.getInstance()
			.sendException('get_config_value_global', err.message);
		return undefined;
	}
	return undefined;
};