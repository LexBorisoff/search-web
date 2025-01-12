import { createConfigProject } from './create-config-project/create-config-project.js';
import { getConfigAction, ConfigAction } from './get-config-action.js';
import { showConfigData } from './show-config/show-config-data.js';
import { showConfigMeta } from './show-config/show-config-meta.js';

const actions: Record<ConfigAction, () => void | Promise<void>> = {
  ...showConfigMeta,
  ...showConfigData,
  [ConfigAction.NewConfig]: createConfigProject,
};

export async function handleConfig(): Promise<void> {
  const action = await getConfigAction();
  if (action != null) {
    actions[action]();
  }
}
