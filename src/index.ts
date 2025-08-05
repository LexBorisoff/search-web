#!/usr/bin/env node

import { configArgs } from '@command/args/config-args.js';
import { queryArgs } from '@command/args/query-args.js';
import { handleConfig } from '@config/handle-config.js';
import { listConfig } from '@config/list-config.js';
import { logger } from '@helpers/utils/logger.js';
import { query } from '@query/query.js';

const { config } = configArgs;
const { list } = queryArgs;

(async function main(): Promise<void> {
  if (list) {
    await listConfig();
    return;
  }

  if (config) {
    await handleConfig();
    return;
  }

  query();
})();

process.on('uncaughtException', (err: NodeJS.ErrnoException) => {
  if (err.code !== 'ENOENT') {
    logger.error('An error occurred');
  }

  process.exit(1);
});
