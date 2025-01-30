import { ConfigBrowser, ConfigEngine } from '@app-types/config.types.js';

export function getDefaultKey<Item extends ConfigEngine | ConfigBrowser>(
  record: Record<string, Item>,
): string {
  const [firstKey] = Object.keys(record);
  const [defaultKey] = Object.entries(record).find(
    ([, { isDefault }]) => isDefault,
  ) ?? [firstKey];

  return defaultKey;
}
