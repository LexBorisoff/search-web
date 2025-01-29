import chalk from 'chalk';

import { getBrowsersData } from '@data/get-browsers-data.js';
import { logger } from '@helpers/utils/logger.js';

import { ConfigAction } from '../get-config-action.js';

import { showEngines } from './show-engines.js';

import type { IsDefault, WithAlias } from '@app-types/config.types.js';

interface PrintDataOptions {
  isDefault?: boolean;
  extra?: string;
}
function printDataInfo<D extends WithAlias>(
  key: string,
  item: D,
  { isDefault, extra }: PrintDataOptions = {},
): void {
  let info = logger.level.info(key);

  if (item.alias) {
    info += ' | ';
    const aliases = Array.isArray(item.alias) ? item.alias : [item.alias];
    info += aliases.map((alias) => logger.level.info(alias)).join(' | ');
  }

  if (extra != null) {
    info += extra;
  }

  if (isDefault === true) {
    info += chalk.gray(' (default)');
  }

  logger(info);
}

interface HandleDataOptions<T extends WithAlias & IsDefault> {
  extra?: (item: T) => string;
}
function handleData<T extends WithAlias & IsDefault>(
  data: Record<string, T>,
  { extra }: HandleDataOptions<T> = {},
): void {
  const entries = Object.entries(data);
  const defaultItem =
    entries.find(([, { isDefault }]) => isDefault) ?? entries.at(0);

  if (defaultItem != null) {
    const [key, item] = defaultItem;
    printDataInfo(key, item, {
      isDefault: true,
      extra: extra?.(item),
    });
  }

  const [defaultKey] = defaultItem ?? [];
  const nonDefaultBrowsers = entries.filter(([key]) => key !== defaultKey);

  nonDefaultBrowsers.forEach(([key, item]) => {
    printDataInfo(key, item, {
      extra: extra?.(item),
    });
  });
}

export const showConfigData = {
  [ConfigAction.Browsers]() {
    const browsers = getBrowsersData();
    handleData(browsers, {
      extra: ({ profiles }) =>
        profiles == null
          ? ''
          : ` [${Object.keys(profiles)
              .map((profile) => logger.level.warning(profile))
              .join(', ')}]`,
    });
  },

  [ConfigAction.Engines]: showEngines,
};
