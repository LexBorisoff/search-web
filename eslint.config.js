import lexjs from '@lexjs/eslint-plugin';
import { useIgnoreFile } from '@lexjs/eslint-plugin/utils';
import globals from 'globals';
import * as tseslint from 'typescript-eslint';

export default tseslint.config(
  useIgnoreFile('.gitignore', import.meta),
  lexjs.configs.recommended,
  lexjs.configs.typescript,
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
        projectService: {
          allowDefaultProject: ['*.js'],
        },
      },
      globals: {
        ...globals.node,
        ...globals.es2020,
      },
    },
  },
);
