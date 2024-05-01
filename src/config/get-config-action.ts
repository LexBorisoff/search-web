import * as fs from "node:fs";
import { prompts } from "../helpers/utils/prompts.js";
import { getConfigFilePath } from "../helpers/config/get-config-path.js";
import { getConfigData } from "../data/get-config-data.js";

export enum ConfigAction {
  Browsers,
  Engines,
  Directory,
  Updated,
  Created,
  NewConfig,
}

export async function getConfigAction(): Promise<ConfigAction | undefined> {
  const configPath = getConfigFilePath();
  const configExists = fs.existsSync(configPath);
  const configData = getConfigData();

  const actions = [
    {
      title: "Engines",
      value: ConfigAction.Engines,
      description: `show${
        Object.keys(configData.engines ?? {}).length > 0 ? " config" : ""
      } engines`,
      show: true,
    },
    {
      title: "Browsers",
      value: ConfigAction.Browsers,
      description: "show config browsers",
      show: configExists,
    },
    {
      title: "Directory",
      value: ConfigAction.Directory,
      description: "show config's project directory",
      show: configExists,
    },
    {
      title: "Updated",
      value: ConfigAction.Updated,
      description: "show when config was last updated",
      show: configExists,
    },
    {
      title: "Created",
      value: ConfigAction.Created,
      description: "show when config was created",
      show: configExists,
    },
    {
      title: "New Config",
      value: ConfigAction.NewConfig,
      description: "create new config project",
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

  const { answer } = await prompts.select({
    name: "answer",
    message: "Choose an option",
    choices,
  });

  return answer;
}
