import type { ConfigDataJson } from "../types/config.types.js";
import { initialEngines } from "../helpers/config/initial-engines.js";
import { getConfigData } from "./get-config-data.js";

export function getEnginesData(): NonNullable<ConfigDataJson["engines"]> {
  const configData = getConfigData().engines ?? {};
  return Object.keys(configData).length > 0 ? configData : initialEngines;
}
