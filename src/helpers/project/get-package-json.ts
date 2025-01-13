import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';

import { PackageJson } from 'type-fest';

import { parseData } from '../utils/parse-data.js';

export function getPackageJson(): PackageJson {
  const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
  const root = path.join(__dirname, '../../../../');

  try {
    const json = fs.readFileSync(path.resolve(`${root}/package.json`), {
      encoding: 'utf-8',
    });

    return parseData<PackageJson>(json) ?? {};
  } catch {
    return {};
  }
}
