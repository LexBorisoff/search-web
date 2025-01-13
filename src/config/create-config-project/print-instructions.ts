import chalk from 'chalk';

import { logger } from '@helpers/utils/logger.js';

export function printInstructions(projectName: string): void {
  const left = '  ';

  logger(
    left +
      `${logger.level.warning('1.')} Open ${logger.level.info(
        projectName,
      )} in your IDE, e.g.`,
  );
  logger(left + chalk.gray(`$ cd ${projectName}`));
  logger(left + chalk.gray(`$ code .`));
  logger();

  logger(
    left +
      `${logger.level.warning('2.')} Define config by editing ${logger.level.info(
        'engines.ts',
      )} and ${logger.level.info('browsers.ts')}`,
  );

  logger();
  logger(
    left +
      `${logger.level.warning('3.')} Generate a ${logger.level.info(
        'JSON config file',
      )} (used by the CLI)`,
  );
  logger(left + chalk.gray(`$ npm run config`));

  logger();
  logger(
    left +
      `${logger.level.warning('4.')} Enjoy using the ${logger.level.info(
        'web',
      )} command 😎`,
  );
}
