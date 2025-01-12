import { getPackageJson } from '../../../helpers/project/get-package-json.js';

const projectName = getPackageJson().name!;

export const browsers = `import { defineConfig } from '${projectName}/config';

defineConfig(({ browser }) => ({
  chrome: browser(),
}));
`;
