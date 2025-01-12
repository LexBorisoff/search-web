import { Engine } from '../api/index.js';
import { dataArgs } from '../command/args/data-args.js';
import { queryArgs, urlArgs } from '../command/args/query-args.js';
import { defaultsData } from '../data/defaults-data.js';
import { defaultDelimiter } from '../helpers/config/defaults.js';
import { findEngine } from '../helpers/find/find-engine.js';

import type { QueryEngine } from '../types/query.types.js';

const [defaultEngineName, defaultEngine] = defaultsData.engine;
const engineArgs = dataArgs.engine();
const delimiter = queryArgs.delimiter || defaultDelimiter;

export function getQueryEngines(): QueryEngine[] {
  // create engines based on provided engine args
  if (engineArgs.length > 0) {
    return engineArgs.map((engineArg) => {
      const found = findEngine(engineArg);
      if (found == null) {
        // engine arg can be provided as a URL string
        const engine = new Engine(engineArg, { delimiter });
        return [engineArg, engine];
      }

      const [engineName, engine] = found;
      return [
        engineName,
        new Engine(engine.baseUrl, {
          search: engine.search,
          delimiter: engine.delimiter,
          resources: engine.resources,
        }),
      ];
    });
  }

  // do no create engines when there are no value args
  if (queryArgs._.length === 0) {
    return [];
  }

  // create engines when all value args are URLs
  if (urlArgs != null) {
    return urlArgs.map((url) => [url, new Engine(url, { delimiter })]);
  }

  // create default engine
  return [
    [
      defaultEngineName,
      new Engine(defaultEngine.baseUrl, {
        search: defaultEngine.search,
        delimiter: defaultEngine.delimiter,
        resources: defaultEngine.resources,
      }),
    ],
  ];
}
