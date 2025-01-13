import { getConfigData } from './get-config-data.js';

import type { ConfigDataJson } from '@app-types/config.types.js';

export function getBrowsersData(): NonNullable<ConfigDataJson['browsers']> {
  return getConfigData().browsers ?? {};
}
