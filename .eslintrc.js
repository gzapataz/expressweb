export default {
    "esversion": 6,
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true,
        "node": true
    },
    
    "parser": "babel-eslint",
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "experimentalDecorators": true,
            "jsx": true
        },
    },
    "rules": {
        "comma-dangle": 0
    }
};
