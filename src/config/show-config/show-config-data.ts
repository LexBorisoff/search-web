import { ConfigAction } from '../get-config-action.js';

import { showBrowsers } from './show-browsers.js';
import { showEngines } from './show-engines.js';

export const showConfigData = {
  [ConfigAction.Browsers]: showBrowsers,
  [ConfigAction.Engines]: showEngines,
};
