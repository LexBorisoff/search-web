#!/usr/bin/env node

import { configArgs } from './command/args/config-args.js';
import { queryArgs } from './command/args/query-args.js';
import { handleConfig } from './config/handle-config.js';
import { updateVersion } from './helpers/project/update-version.js';
import { query } from './query/query.js';

if (configArgs.config) {
  handleConfig();
} else if (queryArgs.update) {
  updateVersion();
} else {
  query();
}
