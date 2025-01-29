import chalk from 'chalk';

import { ConfigEngine } from '@app-types/config.types.js';
import { getEnginesData } from '@data/get-engines-data.js';
import { logger } from '@helpers/utils/logger.js';

const engines = getEnginesData();
const aliasesSeparator = ', ';

const headerColumns = {
  key: 'Engine',
  alias: 'Aliases',
  domain: 'Domain',
};

interface FillOptions {
  minFill: number;
  length: number;
  longest: number;
}

function getFill({ minFill, length, longest }: FillOptions): string {
  const fill = '.'.repeat(longest - length + minFill);
  const styled = chalk.gray(fill);
  const empty = chalk.gray('.');
  return length === 0 ? empty + styled + ' ' : ' ' + styled + ' ';
}

function getEngineAliases(engine: ConfigEngine): string[] {
  if (engine.alias == null) {
    return [];
  }

  return Array.isArray(engine.alias) ? engine.alias : [engine.alias];
}

// default engine
const [firstEngineKey] = Object.keys(engines);
const [defaultEngineKey] = Object.entries(engines).find(
  ([, { isDefault }]) => isDefault,
) ?? [firstEngineKey];

// sort engines by name with default engine first
const sortedEngines = Object.keys(engines)
  .sort((a, b) => a.localeCompare(b))
  .reduce<Record<string, ConfigEngine>>(
    (acc, key) => {
      if (key !== defaultEngineKey) {
        acc[key] = engines[key];
      }
      return acc;
    },
    { [defaultEngineKey]: engines[defaultEngineKey] },
  );

// sort engines by length
const sortedByLength = {
  engine: Object.keys(engines).sort((a, b) => b.length - a.length),
  alias: Object.entries(engines).sort(([, a], [, b]) => {
    const aliasesA = getEngineAliases(a).join(aliasesSeparator);
    const aliasesB = getEngineAliases(b).join(aliasesSeparator);
    return aliasesB.length - aliasesA.length;
  }),
};

const longest: { engine: string; alias: string } = {
  engine: sortedByLength.engine[0],
  alias: getEngineAliases(sortedByLength.alias[0][1]).join(aliasesSeparator),
};

const hasAliases = longest.alias.length > 0;

const display = ([key, engine]: [key: string, engine: ConfigEngine]): void => {
  const engineName = logger.level.warning(key);
  const aliases = getEngineAliases(engine).join(aliasesSeparator);
  const aliasesStyled = logger.level.info.bold(aliases);
  const url = logger.level.success.italic(engine.baseUrl);
  const isDefault =
    key === defaultEngineKey ? chalk.gray.italic(' (default)') : '';

  const fill1 = getFill({
    minFill: hasAliases ? 2 : 4,
    length: key.length,
    longest:
      headerColumns.key.length > longest.engine.length
        ? headerColumns.key.length
        : longest.engine.length,
  });

  const fill2 = getFill({
    minFill: 2,
    length: aliases.length,
    longest:
      headerColumns.alias.length > longest.alias.length
        ? headerColumns.alias.length
        : longest.alias.length,
  });

  if (hasAliases) {
    logger(`${engineName}${fill1}${aliasesStyled}${fill2}${url}${isDefault}`);
    return;
  }

  logger(`${engineName}${fill1}${url}${isDefault}`);
};

export function showEngines(): void {
  Object.entries(sortedEngines).forEach(display);
}
