import * as fs from 'node:fs';

/**
 * Returns null if file does not exist or cannot be read
 */
export function readFile(filePath: string): string | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    return fs.readFileSync(filePath, { encoding: 'utf-8' });
  } catch {
    return null;
  }
}
