import * as fs from 'node:fs';

import $_ from '@lexjs/prompts';

import { getConfigFilePath } from '@helpers/config/get-config-path.js';

export enum ConfigAction {
  Directory = 'directory',
  Updated = 'updated',
  Created = 'created',
  NewConfig = 'newConfig',
}

export async function getConfigAction(): Promise<ConfigAction | undefined> {
  const configPath = getConfigFilePath();
  const configExists = fs.existsSync(configPath);

  const actions = [
    {
      title: 'Directory',
      value: ConfigAction.Directory,
      description: 'Show config project directory',
      show: configExists,
    },
    {
      title: 'Updated',
      value: ConfigAction.Updated,
      description: 'Show when config was last updated',
      show: configExists,
    },
    {
      title: 'Created',
      value: ConfigAction.Created,
      description: 'Show when config was created',
      show: configExists,
    },
    {
      title: 'New Config',
      value: ConfigAction.NewConfig,
      description: 'Create a new config project',
      show: true,
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
