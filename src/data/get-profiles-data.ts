import { getBrowsersData } from './get-browsers-data.js';

import type { ProfilesData } from '../types/config.types.js';

export function getProfilesData(browserName: string): ProfilesData {
  const config = getBrowsersData();

  const profiles = Object.entries(
    config[browserName]?.profiles ?? {},
  ).reduce<ProfilesData>(
    (result, [key, value]) =>
      ({
        ...result,
        [key]: typeof value === 'string' ? { directory: value } : value,
      }) satisfies ProfilesData,
    {},
  );

  return profiles;
}
