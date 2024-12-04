# Change Log

## [2.0.12]
- Ruleset Separation
  - Breaks out various rules into their own categories in both sarif reporter and in Vscode smells
    - BEM
    - DEPRECATED
    - DENSITY
- Readded SLDS2 Classes for 252.14 Patch
  - In an effort to ensure users have a smooth transition from SLDS1 -> SLDS2 several classes from SLDS1 have been reintroduced to SLDS2 and will no longer show up as deprecated in the validator.

## [2.0.11]
- Various Sarif Reporting Fixes
  - Fixes various issues with larger repositories
- Mobile Validation bug
  - The mobile validation rule has been re-enabled for end users

## [2.0.10]
- Release Pipeline

## [2.0.9]
- External Documentation update.

## [2.0.8]
We’re happy to announce that SLDS Validator 2.0.8 is generally available. It stays true to our vision of providing a robust SLDS validation tool that scans your Aura and Lightning design code. Validator 2.0.8 also introduces SLDS2 rules (beta) to scan your code and offer recommendations. SLDS2 is the latest version of the Lightning Design System. Make Salesforce your own with an AI-ready design system that includes configurable UI components and an advanced theming engine.

**Note**: The SLDS2 rules included in SLDS Validator are a pilot or beta service that is subject to the Beta Services Terms at [Agreements - Salesforce.com](https://www.salesforce.com/company/legal/) or a written Unified Pilot Agreement if executed by Customer, and applicable terms in the [Product Terms Directory](https://ptd.salesforce.com/?_ga=2.247987783.1372150065.1709219475-629000709.1639001992). Use of this pilot or beta service is at the Customer's sole discretion.

These are the new features in this version 2.0.8 release.

- [NEW] We introduced new SLDS2 rules (beta) to scan your components and to produce recommendations by using our SLDS2 [global semantic styling hooks](https://www.lightningdesignsystem.com/platforms/lightning/new-global-styling-hooks-guidance/). The SLDS2 rules (beta) are turned off by default. To run the new SLDS2 rules (beta), in VS Code Settings, turn on **SLDS: Enable SLDS2 Validation**. After they’re turned on, SLDS2 rules:
  - Detect and provide mapping recommendations for deprecated --lwc custom properties, deprecated --sds custom properties, and deprecated Aura design tokens
  - Detect usage of hard-coded values in CSS and provide recommendations that use an updated global color style hook matching logic
  - Detect styling hooks and SLDS classes that are no longer supported in SLDS2

- [NEW] Previously, with Validator 1.0, you scanned individual files. Now with Validator 2.0, you can scan a full directory of files. Validator automatically parses the related component files and generates a report of recommendations.

  To run Validator against a directory of files, open VS Code and its Command Palette. Then search for and select **SLDS: Generate SARIF Report**. In your codebase, select a component directory. Validator then scans your code and produces an slds-report.sarif report.

  **Note** To view the report, you need the [SARIF Viewer](https://marketplace.visualstudio.com/items?itemName=MS-SarifVSCode.sarif-viewer) VS Code extension.

- [New] We introduced three code annotations that you can use to ignore Validator recommendations:
  - sldsValidatorAllow
  - sldsValidatorIgnore
  - sldsValidatorIgnoreNextLine

## [1.4.11]

**IMPORTANT**: This is the last release for version 1. From now on, use version 2, which is generally available as of September 2024. Starting in September 2024, we no longer publish release notes for version 1.

- Update README

## [1.4.10]
Updates/enhancements:
- Update LSP to Summer ’24 (SLDS 2.24.4): https://github.com/forcedotcom/salesforcedx-slds-lsp/releases/tag/v0.0.15

# Change Log
## [1.4.9]
Updates/enhancements:
- Update LSP: https://github.com/forcedotcom/salesforcedx-slds-lsp/releases/tag/v0.0.14

# Change Log
## [1.4.8]
Updates/enhancements:
- Update LSP: https://github.com/forcedotcom/salesforcedx-slds-lsp/releases/tag/v0.0.13

## [1.4.7]
Updates/enhancements:
- Enable suppression of SLDS warnings in HTML files for mobile via Quick Fix actions. Any HTML content that is between `<!-- sldsValidatorIgnore -->` and `<!-- sldsValidatorAllow -->` will now be exempt from SLDS validation. Furthermore `<!-- sldsValidatorIgnoreNextLine -->` will exempt the next immediate line from SLDS validation. By adding a `<!-- sldsValidatorIgnore -->` at the top of an HTML file with no `<!-- sldsValidatorAllow -->` anywhere else in that file, you can exempt the entire content of the file from SLDS validation.
- New preference flag for SLDS Validator extension. Now using `Salesforce-vscode-slds > Basic : Mobile Validation` flag you can globally enable or disable SLDS validation for mobile.
- Update LSP: https://github.com/forcedotcom/salesforcedx-slds-lsp/releases/tag/v0.0.12

## [1.4.6]
- Update LSP: https://github.com/forcedotcom/salesforcedx-slds-lsp/releases/tag/v0.0.11

## [1.4.5]
Bug fixes:
- [Address SFDX package detection](https://github.com/forcedotcom/salesforcedx-vscode-slds/pull/85/commits/c951f3273b4ff16eb6846fae6f43e525c3d19bdb)
- [Update LSP 0.0.10](https://github.com/forcedotcom/salesforcedx-slds-lsp/releases/tag/v0.0.10)

## [1.4.4]
Bug fixes:
- [Address issue with Telemetry Enabled](https://github.com/forcedotcom/salesforcedx-vscode-slds/commit/0294a2a70f345e0448a89b4e93ffd8072ff9b421)

## [1.4.3]
- Update LSP: https://github.com/forcedotcom/salesforcedx-slds-lsp/releases/tag/v0.0.9

## [1.4.2]
Updates/enhancements:
- [Upgrade vscode client and add webpack configuration.](https://github.com/forcedotcom/salesforcedx-vscode-slds/commit/29217452fa8643d865c9059fc185c24ce3ad6e75)
- [Update Non Windows environment to use node v12](https://github.com/forcedotcom/salesforcedx-vscode-slds/commit/c191b9fa72e17a70bb3801de7c3347dbeeb66f85)
- [Upgrade LSP from 0.0.7 to 0.0.8 (](https://github.com/forcedotcom/salesforcedx-vscode-slds/commit/89e5f886c4ecdb15ebc8cfea725e1b55819e46d8)
- Update LSP: https://github.com/forcedotcom/salesforcedx-slds-lsp/releases/tag/v0.0.8

## [1.4.1]
Performance:
- [Remove SFDX-Code Dependencies to determine if user supports to send telemetry information.](https://github.com/forcedotcom/salesforcedx-vscode-slds/commit/6732175acac294af29b86557cbe385345d4e0ad9)

## [1.4.0]
Updates/enhancements:
- [Add settings support to toggle specific validators and when the validator should be ran.](https://github.com/forcedotcom/salesforcedx-vscode-slds/commit/42fdaac79a5c0e1273a4562d1cc88f3d3e5552e6)

Bug fixes:
- [Fixes issues with storagePath if it doesn't  exist.](https://github.com/forcedotcom/salesforcedx-vscode-slds/commit/b0c62982b28fd4f01113262d20de2077b3b35eb5)
- [Turns off Utility class related validations.](https://github.com/forcedotcom/salesforcedx-vscode-slds/commit/92685fc6d749399f5d7f1701af2a8a590d7e9b3a)
- [Update LSP to 0.0.7](https://github.com/forcedotcom/salesforcedx-slds-lsp/releases/tag/v0.0.7)

## [1.3.0]
Updates/enhancements:
- Add File Scope to SLDS Validator
- Update LSP: https://github.com/forcedotcom/salesforcedx-slds-lsp/releases/tag/v0.0.6

## [1.2.1]
- Update LSP: https://github.com/forcedotcom/salesforcedx-slds-lsp/releases/tag/v0.0.5

## [1.2.0]
Updates/enhancements:
- New icon for extension
- Update Java Detection logic
- Respect Telemetry disabled via the CLI settings
- Update LSP: https://github.com/forcedotcom/salesforcedx-slds-lsp/releases/tag/v0.0.4

Security updates:
- Bump lodash from 4.17.15 to 4.17.19

Bug fixes:
- Replace large numeric value with java's max int value

Release info: https://github.com/forcedotcom/salesforcedx-vscode-slds/releases/tag/v1.2.0

## [1.1.0]
- New LSP version
- Minor repair to telemetry modal

## [1.0.0]
- Initial release