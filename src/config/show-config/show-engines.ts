import chalk from 'chalk';

import { ConfigEngine } from '@app-types/config.types.js';
import { getEnginesData } from '@data/get-engines-data.js';
import { logger } from '@helpers/utils/logger.js';

export function showEngines(): void {
  const engines = getEnginesData();
  const aliasesSeparator = ', ';

  function getEngineAliases(engine: ConfigEngine): string[] {
    if (engine.alias == null) {
      return [];
    }

    return Array.isArray(engine.alias) ? engine.alias : [engine.alias];
  }

  const [defaultEngineKey] = Object.entries(engines).find(
    ([, { isDefault }]) => isDefault,
  ) ?? [Object.keys(engines)[0]];

  const sortedKeysByName = Object.keys(engines).sort((a, b) =>
    a.localeCompare(b),
  );

  const sortedEngines = sortedKeysByName.reduce<Record<string, ConfigEngine>>(
    (acc, key) => {
      acc[key] = engines[key];
      return acc;
    },
    {},
  );

  const sortedByNameLength = Object.keys(engines).sort(
    (a, b) => b.length - a.length,
  );
  const sortedByAliasesLength = Object.entries(engines).sort(([, a], [, b]) => {
    const aliasesA = getEngineAliases(a).join(aliasesSeparator);
    const aliasesB = getEngineAliases(b).join(aliasesSeparator);
    return aliasesB.length - aliasesA.length;
  });

  const longestAlias = getEngineAliases(sortedByAliasesLength[0][1]).join(
    aliasesSeparator,
  );
  const hasAliases = longestAlias.length > 0;

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

  const display = ([key, engine]: [
    key: string,
    engine: ConfigEngine,
  ]): void => {
    const engineName = logger.level.warning(key);
    const aliases = getEngineAliases(engine).join(aliasesSeparator);
    const aliasesStyled = logger.level.info.bold(aliases);
    const url = logger.level.success.italic(engine.baseUrl);
    const isDefault =
      key === defaultEngineKey ? chalk.gray.italic(' (default)') : '';

    const fill1 = getFill({
      minFill: hasAliases ? 2 : 4,
      length: key.length,
      longest: sortedByNameLength[0].length,
    });
    const fill2 = getFill({
      minFill: 2,
      length: aliases.length,
      longest: longestAlias.length,
    });

    if (hasAliases) {
      logger(`${engineName}${fill1}${aliasesStyled}${fill2}${url}${isDefault}`);
      return;
    }

    logger(`${engineName}${fill1}${url}`);
  };

  Object.entries(sortedEngines).forEach(display);
}
