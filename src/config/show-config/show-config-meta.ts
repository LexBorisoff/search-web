import { getConfigFilePath } from '@helpers/config/get-config-path.js';
import { isValidDateString } from '@helpers/utils/is-valid-date-string.js';
import { logger } from '@helpers/utils/logger.js';
import { parseData } from '@helpers/utils/parse-data.js';
import { readFile } from '@helpers/utils/read-file.js';

import { ConfigAction } from '../get-config-action.js';

import type { ConfigDataJson } from '@app-types/config.types.js';

const configPath = getConfigFilePath();
const { meta } = parseData<ConfigDataJson>(readFile(configPath)) ?? {};

function printDate(name: string, value: string = ''): void {
  if (value != null) {
    if (isValidDateString(value)) {
      logger.info(new Date(value).toString());
      return;
    }
    logger.error(`Invalid ${name} date is stored in config`);
  }
  logger.error(`No ${name} date is stored in config`);
}

export const showConfigMeta = {
  [ConfigAction.Directory]() {
    logger.info(
      meta?.projectDir ??
        logger.level.error('No project directory is stored in config'),
    );
  },

  [ConfigAction.Created]() {
    const { createdAt } = meta ?? {};
    printDate('created at ', createdAt);
  },

  [ConfigAction.Updated]() {
    const { updatedAt } = meta ?? {};
    printDate('updated at ', updatedAt);
  },
};
