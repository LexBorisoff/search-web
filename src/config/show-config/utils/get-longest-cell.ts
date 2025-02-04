import { ConfigBrowser, ConfigEngine } from '@app-types/config.types.js';

import { getAliasesString } from './get-aliases.js';
import { sortByLength } from './sort.js';

export function getLongestCell<Item extends ConfigEngine | ConfigBrowser>(
  record: Record<string, Item>,
): { key: string; alias: string } {
  const sortedByLength = sortByLength(record);

  return {
    key: Object.keys(sortedByLength.key)[0],
    alias: getAliasesString(Object.values(sortedByLength.alias)[0]),
  };
}
