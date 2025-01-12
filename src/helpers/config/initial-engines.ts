import type { ConfigDataDto } from '../../types/config.types.js';

export const initialEngines: NonNullable<ConfigDataDto['engines']> = {
  google: {
    baseUrl: 'google.com',
    search: 'search?q=',
  },
  duck: {
    baseUrl: 'duckduckgo.com',
    search: '?q=',
    delimiter: '+',
    alias: ['duckduckgo'],
  },
  github: {
    baseUrl: 'github.com',
    search: 'search?q=',
    resources: {
      tabs: {
        repos: '?tab=repositories',
        projects: '?tab=projects',
        stars: '?tab=stars',
      },
    },
  },
  mdn: {
    baseUrl: 'developer.mozilla.org',
    search: 'search?q=',
  },
  youtube: {
    baseUrl: 'youtube.com',
    search: 'results?search_query=',
    delimiter: '+',
  },
  npm: {
    baseUrl: 'npmjs.com',
    search: 'search?q=',
  },
};
