import { getBrowsersData } from '@data/get-browsers-data.js';

import { findConfigItem } from './find-config-item.js';

import type { ConfigBrowser } from '@app-types/config.types.js';

const browsersData = getBrowsersData();

/**
 * Returns a tuple with the browser's config key and the Item object
 * found in the config by provided name or alias. Otherwise returns undefined
 */
export function findBrowser(
  browserNameOrAlias: string,
): [string, ConfigBrowser] | undefined {
  return findConfigItem(browserNameOrAlias, browsersData);
}
