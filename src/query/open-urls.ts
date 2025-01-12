import open from 'open';

import { queryArgs } from '../command/args/query-args.js';
import { getQueryProfiles } from '../helpers/browser/get-query-profiles.js';
import { BrowserProfileQuery } from '../types/query.types.js';

import { getQueryBrowsers } from './get-query-browsers.js';

const { test, incognito } = queryArgs;

export function openUrls(urls: string[]): BrowserProfileQuery[] {
  const browsers = getQueryBrowsers();

  if (browsers.length === 0) {
    if (!test) {
      Promise.all(
        urls.map((link) => {
          open(link);
        }),
      );
    }

    return [];
  }

  const queries = browsers.map<BrowserProfileQuery>(([browser]) => ({
    browser,
    profiles: getQueryProfiles(browser).map(([profile]) => profile),
  }));

  if (!test) {
    Promise.all(
      browsers.map(([browserName, browser]) => {
        const browserProfiles = getQueryProfiles(browserName);
        browser.open(urls, {
          profile: browserProfiles.map(([, profile]) => profile.directory),
          incognito,
        });
      }),
    );
  }

  return queries;
}
