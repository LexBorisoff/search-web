import setupInitialConfig from "./setupInitialConfig";
import setupInitialEngines from "./setupInitialEngines";
import { getDefaultsData } from "../../data";
import { writeFile, hasData } from "../../helpers/config";
import { printBanner } from "../../helpers/print";

export default async function setupConfig(): Promise<void> {
  printBanner("Let's set up browser config", "header", "info");

  const config = await setupInitialConfig();
  if (config != null) {
    const { browsers, defaultBrowser } = config;
    const defaults = getDefaultsData();

    try {
      writeFile("config", {
        defaults: {
          ...defaults,
          browser: defaultBrowser,
        },
        browsers,
      });

      const hasEngines = hasData("engines");
      if (!hasEngines) {
        setupInitialEngines();
      }

      printBanner("You are good to go. Have fun!", "footer", "success");
    } catch (error) {
      printBanner("Couldn't create the config file :(", "footer", "error");
      console.error(error);
    }
  } else {
    printBanner("Browser config was not created", "footer", "error");
  }
}
