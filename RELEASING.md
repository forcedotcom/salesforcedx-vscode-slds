# HOW TO PUBLISH PROJECT:

The SLDS Validator for Visual Studio Code gets published to the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=salesforce.salesforce-vscode-slds), where it
is downloaded by users.

## Update Validator

1. Make code changes
1. Update semver in `package.json` as appropriate
1. Run `npm install` to update `package-lock.json` with new semver
1. Run `vsce package` to package new validator and test it

### Publish Validator

1. Obtain **Personal Access Token for publisher 'salesforce'** by contacting current member of project development team
1. Run `vsce publish` to publish new version of validator to Marketplace, entering in access token
1. Verify extension listing is updated at Marketplace link above