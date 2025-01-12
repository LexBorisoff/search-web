import * as fs from 'node:fs';
import * as path from 'node:path';

import { execa } from 'execa';
import { PackageJson } from 'type-fest';

import { getPackageJson } from '../../helpers/project/get-package-json.js';
import { parseData } from '../../helpers/utils/parse-data.js';
import { readFile } from '../../helpers/utils/read-file.js';

import { srcFiles } from './create-project-files.js';
import { PackageManager } from './package-manager/package-manager.enum.js';
import { pmCommands } from './package-manager/pm-commands.js';

const packageVersion = getPackageJson().version!;
const packageName = getPackageJson().name!;

export const initializeProject = {
  async git() {
    await execa('git', ['init']);
  },

  async dependencies(projectName: string, pm: PackageManager) {
    if (projectName.startsWith('.')) {
      fs.writeFileSync(
        'package.json',
        JSON.stringify({ name: projectName.replace(/^\.+/, '') }),
      );
    }

    await execa('npm', ['init', '-y']);

    const thisProject = `${packageName}@${process.env.WEB_CLI_VERSION || packageVersion}`;
    const dependencies = [thisProject];

    const devDependencies = [
      `typescript`,
      `tsx`,
      `eslint`,
      `prettier`,
      `@typescript-eslint/eslint-plugin`,
      `@typescript-eslint/parser`,
      `eslint-config-prettier`,
      `eslint-import-resolver-typescript`,
      `eslint-plugin-import`,
      `eslint-plugin-prettier`,
    ];

    // do not install this project when in dev environment
    const { install, saveDev } = pmCommands[pm];

    if (dependencies.length > 0) {
      await execa(pm, [install, ...dependencies]);
    }

    if (devDependencies.length > 0) {
      await execa(pm, [install, saveDev, ...devDependencies]);
    }

    const configFile = path.resolve(process.cwd(), 'package.json');
    const contents = readFile(configFile);
    const data = parseData<PackageJson>(contents) ?? {};

    data.type = 'module';
    data.scripts = {
      config: `${pm} run config:browsers && ${pm} run config:engines`,
      'config:browsers': `tsx ${srcFiles.browsers.fileName}`,
      'config:engines': `tsx ${srcFiles.engines.fileName}`,
    };

    const space = 2;
    fs.writeFileSync(configFile, JSON.stringify(data, null, space));
  },
};
