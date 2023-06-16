import chalk from "chalk";
import queryBrowser from "./browser";
import { getUrlList } from "../helpers/search";
import { emptyLine } from "../helpers/print";
import { getArgs } from "../command";

const args = getArgs();

export default async function queryEngine(): Promise<void> {
  async function handleEngine(engineNameOrAlias?: string) {
    const urls = getUrlList(engineNameOrAlias);
    urls.forEach(async (url) => {
      console.log(`> ${chalk.green(url)}`);
      await queryBrowser(url);
    });

    emptyLine();
  }

  const engineArg = args.engine as typeof args.engine | string[];

  // single search engine / website to query
  if (!Array.isArray(engineArg)) {
    await handleEngine(engineArg);
  }
  // multiple search engines / websites to query
  else {
    Object.values(engineArg).forEach(async (engineName) => {
      await handleEngine(engineName);
    });
  }
}
