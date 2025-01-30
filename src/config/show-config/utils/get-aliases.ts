import { ConfigBrowser, ConfigEngine } from '@app-types/config.types.js';

import { separator } from './constants.js';

export function getAliases(value: ConfigEngine | ConfigBrowser): string[] {
  if (value.alias == null) {
    return [];
  }

  return Array.isArray(value.alias) ? value.alias : [value.alias];
}

export function getAliasesString(value: ConfigEngine | ConfigBrowser): string {
  return getAliases(value).join(separator);
}
