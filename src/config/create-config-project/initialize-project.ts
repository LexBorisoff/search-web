import * as fs from 'node:fs';
import * as path from 'node:path';

import { execa } from 'execa';
import { PackageJson } from 'type-fest';

import { getPackageJson } from '../../helpers/project/get-package-json.js';
import { parseData } from '../../helpers/utils/parse-data.js';
import { readFile } from '../../helpers/utils/read-file.js';

import { srcFiles } from './create-project-files.js';

const packageVersion = getPackageJson().version!;
const packageName = getPackageJson().name!;

export const initializeProject = {
  async git() {
    await execa('git', ['init']);
  },

  async dependencies(projectName: string) {
    if (projectName.startsWith('.')) {
      fs.writeFileSync(
        'package.json',
        JSON.stringify({ name: projectName.replace(/^\.+/, '') }),
      );
    }

    await execa('npm', ['init', '-y']);

    const dependencies: string[] = [];

    if (process.env.IS_DEV_SEARCH_WEB !== 'true') {
      dependencies.push(`${packageName}@${packageVersion}`);
    }

    const devDependencies = [
      'typescript',
      'tsx',
      '@lexjs/eslint-plugin',
      'prettier',
    ];

    if (dependencies.length > 0) {
      await execa('npm', ['install', ...dependencies]);
    }

    if (devDependencies.length > 0) {
      await execa('npm', ['install', '--save-dev', ...devDependencies]);
    }

    const configFile = path.resolve(process.cwd(), 'package.json');
    const contents = readFile(configFile);
    const data = parseData<PackageJson>(contents) ?? {};

    data.type = 'module';
    data.scripts = {
      config: `npm run config:browsers && npm run config:engines`,
      'config:browsers': `tsx ${srcFiles.browsers.fileName}`,
      'config:engines': `tsx ${srcFiles.engines.fileName}`,
    };

    const space = 2;
    fs.writeFileSync(configFile, JSON.stringify(data, null, space));
  },
};
