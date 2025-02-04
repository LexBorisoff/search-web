import { ConfigEngine } from '@app-types/config.types.js';
import { getEnginesData } from '@data/get-engines-data.js';
import { logger } from '@helpers/utils/logger.js';

import { gutter, marked } from './utils/constants.js';
import { fillCell, fillHeaderCell, type HeaderKey } from './utils/fill-cell.js';
import { getAliasesString } from './utils/get-aliases.js';
import { getDefaultKey } from './utils/get-default-key.js';
import { getLongestCell } from './utils/get-longest-cell.js';
import { sortByName } from './utils/sort.js';

const engines = getEnginesData();
const sortedEngines = sortByName(engines);
const defaultEngineKey = getDefaultKey(engines);
const longestCell = getLongestCell(engines);
const hasAliases = longestCell.alias.length > 0;

const minFill = hasAliases ? 2 : 4;
const headerColumns = {
  key: 'Engine',
  alias: 'Aliases',
  domain: 'Domain',
};

function fill(key: string, headerKey: HeaderKey): string {
  return fillCell({ key, headerKey, headerColumns, longestCell, minFill });
}

function fillHeader(headerKey: HeaderKey): string {
  return fillHeaderCell({ headerKey, headerColumns, longestCell, minFill });
}

function getRestDiff(): number {
  const longestDomain = Object.entries(engines).sort(
    ([, a], [, b]) => b.baseUrl.length - a.baseUrl.length,
  )[0][1].baseUrl;

  return headerColumns.domain.length > longestDomain.length
    ? 0
    : longestDomain.length - headerColumns.domain.length;
}

function displayHeader(): number {
  const keyFill = fillHeader('key');
  const aliasFill = hasAliases ? fillHeader('alias') : '';

  const engine = headerColumns.key;
  const aliases = hasAliases ? headerColumns.alias : '';
  const domain = headerColumns.domain;

  const header = `${engine}${keyFill}${aliases}${aliasFill}${domain}`;
  const length = header.length + getRestDiff();

  logger('\n' + gutter + header);
  logger(gutter + '-'.repeat(length));

  return length;
}

function displayAliases(engineKey: string, engine: ConfigEngine): string {
  const aliases = getAliasesString(engine);
  return hasAliases
    ? `${fill(engineKey, 'key')}${logger.level.info(aliases)}`
    : '';
}

function displayUrl(engineKey: string, engine: ConfigEngine): string {
  const aliases = getAliasesString(engine);

  if (hasAliases) {
    return `${fill(aliases, 'alias')}${logger.level.success(engine.baseUrl)}`;
  }

  return `${fill(engineKey, 'key')}${logger.level.success(engine.baseUrl)}`;
}

function displayGutter(engineName: string): string {
  return engineName === defaultEngineKey ? marked : gutter;
}

export function showEngines(): void {
  const headerLength = displayHeader();

  Object.entries(sortedEngines).forEach(([key, value]) => {
    const engine = logger.level.warning(key);
    const aliases = displayAliases(key, value);
    const url = displayUrl(key, value);
    const prefix = displayGutter(key);
    logger(`${prefix}${engine}${aliases}${url}`);
  });

  logger(gutter + '-'.repeat(headerLength));
}
