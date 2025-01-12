import { exec } from 'node:child_process';

import { logger } from '../utils/logger.js';

import { getPackageJson } from './get-package-json.js';

const projectName = getPackageJson().name!;

export function updateVersion(): void {
  exec(`npm i -g ${projectName}@latest`, (error, stdout, stderr) => {
    if (error != null) {
      logger(stderr);
      return;
    }

    logger(stdout);
  });
}
