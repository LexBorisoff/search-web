import { findEngine } from './find-engine.js';
import { findNested } from './find-nested.js';

export function findResource(
  engineArg: string,
  resourceName: string,
): string | null {
  const [, found] = findEngine(engineArg) ?? [];

  if (found == null || found.resources == null) {
    return null;
  }

  return findNested<string>(found.resources, resourceName, '');
}
