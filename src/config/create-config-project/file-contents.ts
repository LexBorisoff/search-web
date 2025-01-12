import { getPackageJson } from '../../helpers/project/get-package-json.js';

const projectName = getPackageJson().name!;

/* ~~~ SOURCE FILES ~~~ */

const enginesConfig = `
import { defineConfig } from "${projectName}/config";

defineConfig(({ engine }) => ({
  google: engine("google.com", {
    search: "search?q=",
    isDefault: true,
  }),
  duckduckgo: engine("duckduckgo.com", {
    search: "?q=",
    delimiter: "+",
    alias: ["duck"],
  }),
  github: engine("github.com", {
    search: "search?q=",
    resources: {
      tabs: {
        repos: "?tab=repositories",
        projects: "?tab=projects",
        stars: "?tab=stars",
      },
    },
  }),
  mdn: engine("developer.mozilla.org", {
    search: "search?q=",
  }),
  npm: engine("npmjs.com", {
    search: "search?q=",
  }),
  youtube: engine("youtube.com", {
    search: "results?search_query=",
    delimiter: "+",
  }),
}));
`;

const browsersConfig = `
import { defineConfig } from "${projectName}/config";

defineConfig(({ browser }) => ({
  chrome: browser(),
}));
`;

/* ~~~ CONFIG FILES ~~~ */

const tsconfig = `{
  "compilerOptions": {
    "target": "ES2015",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "resolveJsonModule": true,
    "declaration": false,
    "isolatedModules": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true
  }
}
`;

const eslintrc = `module.exports = {
  extends: [
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  plugins: ["import", "prettier", "@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    eqeqeq: ["error", "smart"],
    "prefer-const": "warn",
    "object-shorthand": "error",
    "no-use-before-define": "error",
    "consistent-return": "error",
    "no-else-return": ["error", { allowElseIf: false }],
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": "error",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        ignoreRestSiblings: true,
      },
    ],
    "import/no-unresolved": "error",
    "import/no-cycle": "error",
    "import/no-duplicates": "error",
  },
  env: {
    node: true,
    es2021: true,
  },
  ignorePatterns: [".eslintrc.cjs"],
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
};
`;

const gitignore = `dist\nnode_modules`;
const eslintignore = gitignore;

export const fileContents = {
  enginesConfig,
  browsersConfig,
  tsconfig,
  eslintrc,
  eslintignore,
  gitignore,
};
