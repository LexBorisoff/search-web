import * as fs from 'node:fs';
import * as path from 'node:path';

import { execa } from 'execa';

import { logger } from '../../helpers/utils/logger.js';

import { fileContents } from './file-contents.js';

interface File {
  fileName: string;
  contents: string;
}

type ConfigFile = 'eslint' | 'tsconfig' | 'gitignore' | 'eslintignore';
type SourceFile = 'engines' | 'browsers';

export const srcDir = 'src';
export const srcFiles: Record<SourceFile, File> = {
  engines: {
    fileName: `${srcDir}/engines.ts`,
    contents: fileContents.enginesConfig,
  },
  browsers: {
    fileName: `${srcDir}/browsers.ts`,
    contents: fileContents.browsersConfig,
  },
} as const;

const configFiles: Record<ConfigFile, File> = {
  tsconfig: {
    fileName: 'tsconfig.json',
    contents: fileContents.tsconfig,
  },
  eslint: {
    fileName: '.eslintrc.cjs',
    contents: fileContents.eslintrc,
  },
  eslintignore: {
    fileName: '.eslintignore',
    contents: fileContents.eslintignore,
  },
  gitignore: {
    fileName: '.gitignore',
    contents: fileContents.gitignore,
  },
};

export class ProjectFilesBuilder {
  #projectPath: string;

  constructor(projectPath: string) {
    this.#projectPath = projectPath;
  }

  public config(): void {
    Object.values(configFiles).map((configFile) => {
      this.#createFile(configFile);
    });
  }

  public async src(): Promise<void> {
    const srcPath = path.resolve(this.#projectPath, srcDir);

    try {
      fs.mkdirSync(srcPath);
      Object.values(srcFiles).map((srcFile) => {
        this.#createFile(srcFile);
      });

      await execa('npx', ['prettier', '--write', `${srcDir}/*.ts`]);
    } catch {
      logger.error(`Could not create directory "${srcDir}"`);
    }
  }

  #createFile({ fileName, contents }: File): void {
    const filePath = path.resolve(process.cwd(), fileName);
    try {
      fs.writeFileSync(filePath, contents);
    } catch {
      logger.error(`Could not write to file "${fileName}"`);
    }
  }
}

class CreateError extends Error {
  constructor(fileType: string) {
    super(`Could not create project ${fileType} files`);
  }
}

export async function createProjectFiles(projectPath: string): Promise<void> {
  const builder = new ProjectFilesBuilder(projectPath);

  try {
    builder.config();
  } catch {
    throw new CreateError('config');
  }

  try {
    await builder.src();
  } catch {
    throw new CreateError('source');
  }
}
