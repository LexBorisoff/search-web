import { validateArgs } from '../command/args/validate-args.js';
import { logger } from '../helpers/utils/logger.js';

import { getQueryEngines } from './get-query-engines.js';
import { getUrls } from './get-urls.js';
import { openUrls } from './open-urls.js';
import { printQuery } from './print-query.js';

export function query(): void {
  const errors = validateArgs();
  if (errors.length > 0) {
    errors.forEach((message) => {
      logger(message);
    });
    return;
  }

  const engines = getQueryEngines();
  const urls: string[] = engines.map(([, engine]) => getUrls(engine)).flat();
  const browserQueries = openUrls(urls);

  printQuery(urls, browserQueries);
}
