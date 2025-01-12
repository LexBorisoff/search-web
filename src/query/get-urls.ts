import {
  Engine,
  ResourceConfig,
  ResourceObject,
  SearchConfig,
} from '@lexjs/web-search';

import { dataArgs } from '../command/args/data-args.js';
import { queryArgs, urlArgs } from '../command/args/query-args.js';
import { findNested } from '../helpers/find/find-nested.js';

const { _: args, resource, http } = queryArgs;
const engineArgs = dataArgs.engine();
const portArgs = dataArgs.port();
const port = portArgs.length === 0 ? undefined : portArgs;

// if there are no engine args and all value args are URLs,
// remove URL args from keywords list because they are used as engines
const keywords: string[] = args.filter(
  (keyword) => engineArgs.length > 0 || !urlArgs || !urlArgs.includes(keyword),
);

function handleResource(
  engine: Engine<SearchConfig, ResourceConfig>,
  resourceValue: string,
): string[] {
  const splitter = '::';

  function findResourceByValue(resources: ResourceObject): string | null {
    return findNested<string>(resources, resourceValue, resourceValue);
  }

  return engine.resource(
    (config = {}) => {
      // NOTE: resource object has a property key containing the splitter
      const foundResourceValue = findResourceByValue(config);
      if (foundResourceValue != null) {
        return foundResourceValue;
      }

      const [resourceKey] = resourceValue.split(splitter);
      const isEscaped = resourceKey.startsWith('/');
      // do not search in config if resource key starts with slash
      return isEscaped
        ? resourceKey.slice(1)
        : (findNested<string>(config, resourceKey, resourceKey) ?? resourceKey);
    },
    {
      path(config = {}) {
        const foundResource = findResourceByValue(config);

        // Relates to the NOTE in the above callback
        // Add path found by splitted path key only if resource does not include the splitter
        if (foundResource == null) {
          const pathKeys = resourceValue.split(splitter).slice(1);

          if (pathKeys.length > 0) {
            const result = pathKeys
              .reduce<string[]>((acc, pathKey) => {
                const isEscaped = pathKey.startsWith('/');
                acc.push(
                  // do not search in config if path key starts with slash
                  isEscaped
                    ? pathKey.slice(1)
                    : (findNested<string>(config, pathKey, '') ?? pathKey),
                );

                return acc;
              }, [])
              .reduce<string>((acc, value) => {
                return `${acc}${value.startsWith('?') ? value : `/${value}`}`;
              }, '');

            return [...keywords, result];
          }
        }

        return keywords;
      },
      port,
      unsecureHttp: http,
    },
  );
}

function handleQuery(config: SearchConfig = { main: '/' }): string | string[] {
  function getQuery(search: string): string {
    return typeof config !== 'string'
      ? (findNested<string>(config, search, search) ?? search)
      : search;
  }

  const { search } = queryArgs;

  if (search == null) {
    return typeof config === 'string' ? config : config.main;
  }

  if (Array.isArray(search)) {
    return search.map((s) => getQuery(s));
  }

  return getQuery(search);
}

export function getUrls(
  engine: Engine<SearchConfig, ResourceConfig>,
): string[] {
  if (resource != null) {
    return Array.isArray(resource)
      ? resource.map((r) => handleResource(engine, r)).flat()
      : handleResource(engine, resource);
  }

  return engine.search(keywords.join(' '), {
    query: handleQuery,
    port,
    split: queryArgs.split,
    unsecureHttp: queryArgs.http,
  });
}
