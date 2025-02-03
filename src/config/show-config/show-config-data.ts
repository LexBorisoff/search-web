import { ListAction } from '@config/get-list-action.js';

import { showBrowsers } from './show-browsers.js';
import { showEngines } from './show-engines.js';

export const showConfigData = {
  [ListAction.Browsers]: showBrowsers,
  [ListAction.Engines]: showEngines,
};
