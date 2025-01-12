import * as fs from 'node:fs';

export function createProjectDir(projectPath: string): void {
  if (fs.existsSync(projectPath)) {
    throw new Error('Project already exists');
  }

  fs.mkdirSync(projectPath);
}
