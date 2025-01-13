import * as os from 'node:os';
import * as path from 'node:path';

export function getConfigDirPath(): string {
  return path.join(os.homedir(), '.search-web');
}

export function getConfigFilePath(): string {
  const configPath = getConfigDirPath();
  return path.join(configPath, 'config.json');
}
