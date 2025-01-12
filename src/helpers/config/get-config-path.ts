import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

export const CONFIG_FILE_NAME = 'web-cli.config.json';

export function getConfigDirPath(): string {
  const homedir = os.homedir();
  let directory: string | undefined;
  const { platform } = process;

  switch (platform) {
    case 'win32': {
      directory = path.join(homedir, 'AppData', 'Roaming');
      break;
    }
    case 'darwin': {
      directory = path.join(homedir, 'Library', 'Application Support');
      break;
    }
    case 'linux': {
      const configPath = path.join(homedir, '.config');
      directory = fs.existsSync(configPath) ? configPath : homedir;
      break;
    }
    default: {
      directory = homedir;
      break;
    }
  }

  return path.join(directory, '@lexjs', 'web-cli');
}

export function getConfigFilePath(): string {
  const configPath = getConfigDirPath();
  return path.join(configPath, CONFIG_FILE_NAME);
}
