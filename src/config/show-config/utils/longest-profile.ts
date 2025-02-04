import { getBrowsersData } from '@data/get-browsers-data.js';

import { separator } from './constants.js';

const browsers = getBrowsersData();

const { profiles } = Object.entries(browsers).sort(([, a], [, b]) => {
  const profilesA = Object.keys(a.profiles ?? {}).join(separator);
  const profilesB = Object.keys(b.profiles ?? {}).join(separator);
  return profilesB.length - profilesA.length;
})[0][1];

export const longestProfile = Object.keys(profiles ?? {}).join(separator);
