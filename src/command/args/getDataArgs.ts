import getArgs from "./getArgs";
import { combineArgLists } from "./utils";
import { options } from "../options";
import { getBrowsersData, getEnginesData, getProfilesData } from "../../data";
import { WithAlias } from "../../types/utility.types";

const args = getArgs();
const browsersData = getBrowsersData();
const enginesData = getEnginesData();

interface Data<T> {
  [key: string]: T;
}

function getUniqueList(
  optionArg: string | string[] | undefined,
  customArgs: string[],
  removeEmptyArg: boolean
) {
  const list = combineArgLists(optionArg, customArgs);
  const uniqueList = [...new Set(list)];
  return removeEmptyArg ? uniqueList.filter((arg) => arg !== "") : uniqueList;
}

/**
 * Returns a list of arg options supplied to the CLI that are
 * specific to config data and do not match standard args
 */
function getCustomArgs<T extends Partial<WithAlias>>(data: Data<T>): string[] {
  const customArgs = Object.keys(args).filter((key) => !options.includes(key));

  return Object.entries(data)
    .map(([key, { alias }]) => {
      if (alias != null) {
        return Array.isArray(alias) ? [key, ...alias] : [key, alias];
      }
      return key;
    })
    .flat()
    .filter((nameOrAlias) => customArgs.includes(nameOrAlias));
}

const getDataArgs = {
  /**
   * Returns a unique list of engine args provided to the CLI
   *
   * @param removeEmptyArg
   * If true, removes the empty value from the list
   */
  engine: function getEngineArgs(removeEmptyArg = true): string[] {
    const { engine } = args;
    const optionArg = engine as typeof engine | string[];
    const customArgs = getCustomArgs(enginesData);
    return getUniqueList(optionArg, customArgs, removeEmptyArg);
  },
  /**
   * Returns a unique list of browser args provided to the CLI
   *
   * @param removeEmptyArg
   * If true, removes the empty value from the list
   */
  browser: function getBrowserArgs(removeEmptyArg = true): string[] {
    const { browser } = args;
    const optionArg = browser as typeof browser | string[];
    const customArgs = getCustomArgs(browsersData);
    return getUniqueList(optionArg, customArgs, removeEmptyArg);
  },
  /**
   * Returns a unique list of profile args provided to the CLI.
   *
   * @param browserName
   * If value is provided, returns profile args for that browser name,
   * otherwise returns all profile args supplied to the CLI
   *
   * @param removeEmptyArg
   * If true, removes an empty arg value from the list
   */
  profile: function getProfileArgs(
    browserName?: string | null,
    removeEmptyArg = true
  ): string[] {
    const { profile } = args;
    const optionArg = profile as typeof profile | string[];

    if (browserName == null) {
      const list: string[] = [];

      // push option arg values (--profile <name>) to the list
      if (optionArg != null) {
        list.push(...(Array.isArray(optionArg) ? optionArg : [optionArg]));
      }

      // push custom args (--profileName) to the list
      Object.keys(browsersData).forEach((arg) => {
        const profilesData = getProfilesData(arg);
        const customArgs = getCustomArgs(profilesData);
        list.push(...customArgs);
      });

      return [
        ...new Set(removeEmptyArg ? list.filter((arg) => arg !== "") : list),
      ];
    }

    const profilesData = getProfilesData(browserName);
    const customArgs = getCustomArgs(profilesData);
    return getUniqueList(optionArg, customArgs, removeEmptyArg);
  },
};

export default getDataArgs;
