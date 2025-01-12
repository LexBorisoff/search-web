import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { matchers } from '../../api/index.js';
import { configFlags } from '../../data/config-flags.js';
import { getPackageJson } from '../../helpers/project/get-package-json.js';
import {
  QueryOptions as Options,
  queryAlias as alias,
  queryOptions as options,
  queryOptionTypes as types,
} from '../options.js';

import type { ArrayArgs } from '../../types/arg.types.js';

const version = getPackageJson().version!;

const args = yargs(hideBin(process.argv))
  .option(Options.Browser, {
    type: types[Options.Browser],
    alias: alias.browser,
    description: 'The browser app to open',
  })
  .option(Options.Profile, {
    type: types[Options.Profile],
    alias: alias.profile,
    description: 'The browser profile to open',
  })
  .option(Options.Engine, {
    type: types[Options.Engine],
    alias: alias.engine,
    description: 'The search engine (or website) to query',
  })
  .option(Options.Search, {
    type: types[Options.Search],
    alias: alias.search,
    description: "The engine's search path to use for querying",
  })
  .option(Options.Resource, {
    type: types[Options.Resource],
    alias: alias.resource,
    description: "The engine's resource to access",
  })
  .option(Options.Delimiter, {
    type: types[Options.Delimiter],
    alias: alias.delimiter,
    description: "The engine's delimiter to separate query terms",
  })
  .option(Options.Port, {
    type: types[Options.Port],
    alias: alias.port,
    description: 'The port number to add to the URL',
  })
  .option(Options.Incognito, {
    type: types[Options.Incognito],
    alias: alias.incognito,
    description: 'Open in incognito / private mode',
  })
  .option(Options.Split, {
    type: types[Options.Split],
    description: 'Create a separate web query for each value argument',
  })
  .option(Options.Http, {
    type: types[Options.Http],
    description: 'Use the HTTP (non-secure) protocol',
  })
  .option(Options.Test, {
    type: types[Options.Test],
    alias: alias.test,
    description: 'Display the output without opening browser tabs',
  })
  .option(Options.Update, {
    type: types[Options.Update],
    description: 'Update package to the most current version',
  })
  .help()
  .version(version)
  .boolean(configFlags.filter((flag) => !options.includes(flag)))
  .parseSync();

const arrayArgs: ArrayArgs = {
  browser: args.browser,
  profile: args.profile,
  engine: args.engine,
  search: args.search,
  resource: args.resource,
  port: args.port,
};

const _ = args._.map((arg) => `${arg}`);

const urlsOnly: boolean =
  _.length > 0 && _.every((arg) => matchers.url.test(arg));

/**
 * Is populated only if all value args are URLs
 */
const urlArgs = urlsOnly ? _ : undefined;

const queryArgs = {
  ...args,
  ...arrayArgs,
  _,
};

// delete undefined properties
type QueryArgs = typeof queryArgs;
for (const key of Object.keys(queryArgs) as (keyof QueryArgs)[]) {
  if (args[key] == null) {
    delete queryArgs[key as keyof QueryArgs];
  }
}

export { queryArgs, urlArgs };
