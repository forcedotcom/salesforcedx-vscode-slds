module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "./tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [ "@typescript-eslint"],
    "extends": ['plugin:@typescript-eslint/recommended'],
    "rules": {
        "@typescript-eslint/indent": ["error", 2],
        "@typescript-eslint/member-delimiter-style": [
            "error",
            {
                "multiline": {
                    "delimiter": "semi",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": false
                }
            }
        ],
        "@typescript-eslint/semi": [
            "error",
            "always"
        ]
    }
};
