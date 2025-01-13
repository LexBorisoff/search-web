import { getPackageJson } from '@helpers/project/get-package-json.js';

const projectName = getPackageJson().name!;

export const browsers = `import { defineConfig, clearBrowsers } from '${projectName}/config';

clearBrowsers();
defineConfig(({ browser }) => ({
  chrome: browser(),
}));
`;
