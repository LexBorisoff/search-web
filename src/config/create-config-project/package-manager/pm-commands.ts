import { PackageManager } from './package-manager.enum.js';

export interface PmCommand {
  install: string;
  saveDev: string;
}

export const pmCommands: Record<PackageManager, PmCommand> = {
  [PackageManager.NPM]: {
    install: 'install',
    saveDev: '--save-dev',
  },
  [PackageManager.PNPM]: {
    install: 'add',
    saveDev: '--save-dev',
  },
  [PackageManager.YARN]: {
    install: 'add',
    saveDev: '--dev',
  },
};
