import $_ from '@lexjs/prompts';

import { getBrowsersData } from '@data/get-browsers-data.js';

export enum ListAction {
  Engines = 'engines',
  Browsers = 'browsers',
}

export async function getListAction(): Promise<ListAction | undefined> {
  const browsers = getBrowsersData();

  const actions = [
    {
      title: 'Engines',
      value: ListAction.Engines,
      description: `List engines`,
      show: true,
    },
    {
      title: 'Browsers',
      value: ListAction.Browsers,
      description: 'List browsers',
      show: Object.keys(browsers).length > 0,
    },
  ];

  const choices = actions
    .filter(({ show }) => show)
    .map(({ title, value, description }) => ({
      title,
      value,
      description,
    }));

  const { answer } = await $_.select({
    name: 'answer',
    message: 'Choose an option',
    choices,
  });

  return answer;
}
