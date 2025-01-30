import { ConfigBrowser, ConfigEngine } from '@app-types/config.types.js';

import { getAliasesString } from './get-aliases.js';
import { getDefaultKey } from './get-default-key.js';

export function sortByName<Item extends ConfigEngine | ConfigBrowser>(
  record: Record<string, Item>,
): Record<string, Item> {
  const defaultKey = getDefaultKey(record);

  return Object.keys(record)
    .sort((a, b) => a.localeCompare(b))
    .reduce<Record<string, Item>>(
      (acc, key) => {
        if (key !== defaultKey) {
          acc[key] = record[key];
        }
        return acc;
      },
      { [defaultKey]: record[defaultKey] },
    );
}

interface SortedByLengthInterface<Item extends ConfigEngine | ConfigBrowser> {
  key: Record<string, Item>;
  alias: Record<string, Item>;
}

export function sortByLength<Item extends ConfigEngine | ConfigBrowser>(
  record: Record<string, Item>,
): SortedByLengthInterface<Item> {
  function reducer(
    acc: Record<string, Item>,
    key: string,
  ): Record<string, Item> {
    acc[key] = record[key];
    return acc;
  }

  return {
    key: Object.keys(record)
      .sort((a, b) => b.length - a.length)
      .reduce(reducer, {}),
    alias: Object.entries(record)
      .sort(([, a], [, b]) => {
        const aliasesA = getAliasesString(a);
        const aliasesB = getAliasesString(b);
        return aliasesB.length - aliasesA.length;
      })
      .reduce((acc, [key]) => reducer(acc, key), {}),
  };
}
