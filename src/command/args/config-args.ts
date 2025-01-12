import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { ConfigOptions as Options } from '../options.js';

export const configArgs = yargs(hideBin(process.argv))
  .option(Options.Config, {
    type: 'boolean',
  })
  .help(false)
  .parseSync();
