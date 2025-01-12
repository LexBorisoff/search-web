import chalk from 'chalk';

import { queryArgs } from '../command/args/query-args.js';
import { logger } from '../helpers/utils/logger.js';
import { capitalize } from '../helpers/utils/transform-text.js';
import { BrowserProfileQuery } from '../types/query.types.js';

const { incognito, test } = queryArgs;

export function printQuery(
  urls: string[],
  browserQueries: BrowserProfileQuery[],
): void {
  if (test) {
    logger.warning('[test]');
  }

  browserQueries.forEach((browserQuery) => {
    const { browser, profiles } = browserQuery;
    let browserInfo = logger.level.info(capitalize(browser));

    if (profiles.length > 0) {
      browserInfo += ` (${chalk.gray(profiles.join(', '))})`;
    }

    if (incognito) {
      browserInfo += chalk.gray(' [private tab]');
    }

    logger(browserInfo);
  });

  urls.forEach((url: string) => {
    logger(`> ${logger.level.success(url)}`);
  });
}
