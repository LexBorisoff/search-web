import { getListAction } from './get-list-action.js';
import { showConfigData } from './show-config/show-config-data.js';

export async function listConfig(): Promise<void> {
  const action = await getListAction();
  if (action != null) {
    showConfigData[action]();
  }
}
