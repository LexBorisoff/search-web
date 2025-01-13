import { getEnginesData } from '@data/get-engines-data.js';
import { initialEngines } from '@helpers/config/initial-engines.js';

import { findConfigItem } from './find-config-item.js';

import type { ConfigEngine } from '@app-types/config.types.js';

/**
 * Returns a tuple with the engine's config key and the Engine object
 * if it can be found in the config by the provided name or alias.
 * Otherwise returns undefined
 */
export function findEngine(
  engineArg?: string,
): [string, ConfigEngine] | undefined {
  if (engineArg == null) {
    return undefined;
  }

  const enginesData = getEnginesData();
  const hasEnginesData = Object.keys(enginesData).length > 0;

  return findConfigItem(
    engineArg,
    hasEnginesData ? enginesData : initialEngines,
  );
}
