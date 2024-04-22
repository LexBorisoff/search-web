import {
  defaultEngine,
  defaultDelimiter as delimiter,
} from "../helpers/config/defaults.js";
import { initialEngines } from "../helpers/config/initial-engines.js";
import type { ConfigEngine, DefaultsData, IsDefault } from "../config/types.js";
import { getEnginesData } from "./get-engines-data.js";
import { getProfilesData } from "./get-profiles-data.js";
import { getBrowsersData } from "./get-browsers-data.js";

function getDefault<Data extends IsDefault>(
  data: Data
): [string, Data[keyof Data]] | null {
  const withDefault = Object.entries(data).find(
    ([, item]: [key: string, item: Data]) => !!item.isDefault
  );

  if (withDefault != null) {
    return withDefault;
  }

  const first = Object.entries(data).at(0);
  if (first != null) {
    return first;
  }

  return null;
}

function getDefaultEngine(): DefaultsData["engine"] {
  const engines = getEnginesData();
  const fallback: [string, ConfigEngine] = [
    defaultEngine,
    initialEngines[defaultEngine],
  ];
  return getDefault(engines) ?? fallback;
}

function getDefaultBrowser(): DefaultsData["browser"] {
  const browsers = getBrowsersData();
  return getDefault(browsers);
}

const getDefaultProfile: DefaultsData["profile"] = (browserName) => {
  const profiles = getProfilesData(browserName);
  return getDefault(profiles);
};

export function getDefaultsData(): DefaultsData {
  return {
    delimiter,
    engine: getDefaultEngine(),
    browser: getDefaultBrowser(),
    profile: getDefaultProfile,
  };
}
