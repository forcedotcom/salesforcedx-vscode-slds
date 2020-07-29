/*
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as vscode from 'vscode';
const sfdxUtilsExtension = vscode.extensions.getExtension('salesforce.salesforcedx-utils-vscode');

const BASE_FILE_EXTENSION = sfdxUtilsExtension.exports.BASE_FILE_EXTENSION;
const BASE_FILE_NAME = sfdxUtilsExtension.exports.BASE_FILE_NAME;
const Config = sfdxUtilsExtension.exports.Config;
const DEFAULT_LOCALE = sfdxUtilsExtension.exports.DEFAULT_LOCALE;
const Localization = sfdxUtilsExtension.exports.Localization;
const Message = sfdxUtilsExtension.exports.Message;

console.log(sfdxUtilsExtension.exports);

function loadMessageBundle(config?: typeof Config): typeof Message {
	function resolveFileName(locale: string): string {
		return locale === DEFAULT_LOCALE
			? `${BASE_FILE_NAME}.${BASE_FILE_EXTENSION}`
			: `${BASE_FILE_NAME}.${locale}.${BASE_FILE_EXTENSION}`;
	}

	const base = new Message(
		require(`./${resolveFileName(DEFAULT_LOCALE)}`).messages
	);

	if (config && config.locale && config.locale !== DEFAULT_LOCALE) {
		try {
			const layer = new Message(
				require(`./${resolveFileName(config.locale)}`).messages,
				base
			);
			return layer;
		} catch (e) {
			console.error(`Cannot find ${config.locale}, defaulting to en`);
			return base;
		}
	} else {
		return base;
	}
}

function getNlsConfig(): typeof Config | undefined {
	const procNlsConfig = process.env.VSCODE_NLS_CONFIG;
	return procNlsConfig ? JSON.parse(procNlsConfig) : null;
}

export const nls = new Localization(loadMessageBundle(getNlsConfig()));
