#!/usr/bin/env node

import { configArgs } from '@command/args/config-args.js';
import { handleConfig } from '@config/handle-config.js';
import { listConfig } from '@config/list-config.js';
import { query } from '@query/query.js';

const { list, config } = configArgs;

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
