import { ProfilesConfig } from '@lexjs/web-search';

import { findBrowser } from '../helpers/find/find-browser.js';

export function getProfilesConfig(
  browserNameOrAlias: string,
): ProfilesConfig | undefined {
  const [, browser] = findBrowser(browserNameOrAlias) ?? [];

  return browser == null
    ? undefined
    : Object.entries(browser.profiles ?? {}).reduce<ProfilesConfig>(
        (result, [key, profile]) => ({
          ...result,
          [key]: typeof profile === 'string' ? profile : profile.directory,
        }),
        {},
      );
}
