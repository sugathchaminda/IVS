module.exports = {
    "extends": ["airbnb-base"],
    "parser": "babel-eslint",
    "rules": {
        "arrow-parens": ["error", "as-needed"],
        "indent": ["error", 4],
        "indent": [2, 4, { "SwitchCase": 1 }],
        "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
        "operator-linebreak": ["error", "after", { "overrides": { ":": "before" } }],
        "quotes": ["error", "single"],
        "semi": ["error", "always"],
        "no-unused-vars": ["error", { "args": "none" }],
        "max-len": ["error", 150],
        "no-console": 0,
        "prefer-promise-reject-errors": ["error", { "allowEmptyReject": true }],
        "class-methods-use-this": "off",
        "import/named": "off",
        "func-names": "off",
        'newline-per-chained-call': ['error', { ignoreChainWithDepth: 6 }],
        "object-curly-newline": ["error", {
            "ObjectPattern": { "multiline": true },
            "ExportDeclaration": { "multiline": true, "minProperties": 6 }
        }],
        "default-case": 0,
        "consistent-return": 0,
    },
    "env": {
        "node": true,
        "browser": true,
        "mocha": true,
    }
};