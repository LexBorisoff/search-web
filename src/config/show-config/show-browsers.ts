import { ConfigBrowser } from '@app-types/config.types.js';
import { getBrowsersData } from '@data/get-browsers-data.js';
import { logger } from '@helpers/utils/logger.js';

import { gutter, marked, separator } from './utils/constants.js';
import { fillCell, fillHeaderCell, type HeaderKey } from './utils/fill-cell.js';
import { getAliasesString } from './utils/get-aliases.js';
import { getDefaultKey } from './utils/get-default-key.js';
import { getLongestCell } from './utils/get-longest-cell.js';
import { longestProfile } from './utils/longest-profile.js';
import { sortByName } from './utils/sort.js';

const browsers = getBrowsersData();
const sortedBrowsers = sortByName(browsers);
const defaultBrowserKey = getDefaultKey(browsers);
const longestCell = getLongestCell(browsers);
const hasAliases = longestCell.alias.length > 0;
const hasProfiles = Object.values(browsers).some(
  ({ profiles }) => profiles != null,
);

const minFill = 4;
const headerColumns = {
  key: 'Browser',
  alias: 'Aliases',
  profiles: 'Profiles',
};

function fill(key: string, headerKey: HeaderKey): string {
  return fillCell({ key, headerKey, headerColumns, longestCell, minFill });
}

function fillHeader(headerKey: HeaderKey): string {
  return fillHeaderCell({ headerKey, headerColumns, longestCell, minFill });
}

function getRestDiff(): number {
  if (hasProfiles) {
    return headerColumns.profiles.length > longestProfile.length
      ? 0
      : longestProfile.length - headerColumns.profiles.length;
  }

  if (hasAliases) {
    const first = Object.entries(browsers).sort(([, a], [, b]) => {
      const aliasesA = getAliasesString(a);
      const aliasesB = getAliasesString(b);
      return aliasesB.length - aliasesA.length;
    })[0][1];

    const longestAlias = getAliasesString(first);
    return headerColumns.alias.length > longestAlias.length
      ? 0
      : longestAlias.length - headerColumns.alias.length;
  }

  return 0;
}

function displayHeader(): number {
  const keyFill = hasAliases ? fillHeader('key') : '';
  const aliasFill = hasProfiles ? fillHeader('alias') : '';

  const browser = headerColumns.key;
  const aliases = hasAliases ? headerColumns.alias : '';
  const profiles = hasProfiles ? headerColumns.profiles : '';

  const header = `${browser}${keyFill}${aliases}${aliasFill}${profiles}`;
  const length = header.length + getRestDiff();

  logger('\n' + gutter + header);
  logger(gutter + '-'.repeat(length));

  return length;
}

function displayAliases(browserKey: string, browser: ConfigBrowser): string {
  let aliases = getAliasesString(browser);

  if (!hasProfiles) {
    const aliasesRest = fillCell({
      key: aliases,
      headerColumns,
      headerKey: 'alias',
      longestCell,
      minFill: -1, // adjusts adding extra dot after non-empty alias
    });

    aliases = `${aliases}${aliasesRest}`;
  }

  return hasAliases
    ? `${fill(browserKey, 'key')}${logger.level.info(aliases)}`
    : '';
}

function displayProfiles(browserKey: string, browser: ConfigBrowser): string {
  const aliases = getAliasesString(browser);

  let profiles = Object.keys(browser.profiles ?? {}).join(separator);
  const profilesRest = fillCell({
    key: profiles,
    headerColumns,
    headerKey: 'profiles',
    longestCell: { ...headerColumns, profiles: longestProfile },
    minFill: -1, // adjusts adding extra dot after non-empty profiles
  });
  profiles = `${profiles}${profilesRest}`;

  if (hasAliases) {
    return hasProfiles
      ? `${fill(aliases, 'alias')}${logger.level.success(profiles)}`
      : '';
  }

  return hasProfiles
    ? `${fill(browserKey, 'key')}${logger.level.success(profiles)}`
    : '';
}

function displayGutter(browserKey: string): string {
  return browserKey === defaultBrowserKey ? marked : gutter;
}

export function showBrowsers(): void {
  const headerLength = displayHeader();

  Object.entries(sortedBrowsers).forEach(([key, value]) => {
    const browser = logger.level.warning(key);
    const aliases = displayAliases(key, value);
    const profiles = displayProfiles(key, value);
    const prefix = displayGutter(key);
    logger(`${prefix}${browser}${aliases}${profiles}`);
  });

  logger(gutter + `-`.repeat(headerLength));
}
