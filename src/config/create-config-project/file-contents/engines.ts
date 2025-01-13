import { getPackageJson } from '@helpers/project/get-package-json.js';

const projectName = getPackageJson().name!;

export const engines = `import { defineConfig, clearEngines } from '${projectName}/config';

clearEngines();
defineConfig(({ engine }) => ({
  google: engine('google.com', {
    search: 'search?q=',
    isDefault: true,
  }),
  duckduckgo: engine('duckduckgo.com', {
    search: '?q=',
    delimiter: '+',
    alias: ['duck'],
  }),
  github: engine('github.com', {
    search: 'search?q=',
    resources: {
      tabs: {
        repos: '?tab=repositories',
        projects: '?tab=projects',
        stars: '?tab=stars',
      },
    },
  }),
  mdn: engine('developer.mozilla.org', {
    search: 'search?q=',
  }),
  npm: engine('npmjs.com', {
    search: 'search?q=',
  }),
  youtube: engine('youtube.com', {
    search: 'results?search_query=',
    delimiter: '+',
  }),
}));
`;
