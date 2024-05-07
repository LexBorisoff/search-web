type Alias<T extends string> = Partial<Record<T, string | string[]>>;
type OptionType = "string" | "number" | "boolean";

export const yargsOptions = ["_", "$0"];

// QUERY OPTIONS
export enum QueryOptions {
  Browser = "browser",
  Profile = "profile",
  Engine = "engine",
  Search = "search",
  Resource = "resource",
  Port = "port",
  Incognito = "incognito",
  Split = "split",
  Http = "http",
  Test = "test",
  Update = "update",
}

export const queryOptionTypes = {
  [QueryOptions.Browser]: "string" as const,
  [QueryOptions.Profile]: "string" as const,
  [QueryOptions.Engine]: "string" as const,
  [QueryOptions.Search]: "string" as const,
  [QueryOptions.Resource]: "string" as const,
  [QueryOptions.Port]: "number" as const,
  [QueryOptions.Incognito]: "boolean" as const,
  [QueryOptions.Split]: "boolean" as const,
  [QueryOptions.Http]: "boolean" as const,
  [QueryOptions.Test]: "boolean" as const,
  [QueryOptions.Update]: "boolean" as const,
} satisfies Record<QueryOptions, OptionType>;

export const queryAlias: Alias<QueryOptions> = {
  browser: ["b"],
  profile: ["p"],
  engine: ["e"],
  search: ["s"],
  resource: ["r"],
  port: [":"],
  incognito: ["i"],
  test: ["t"],
};

/**
 * CLI options and their aliases (excluding config options)
 */
export const queryOptions: string[] = [
  ...Object.values(QueryOptions),
  ...Object.values(queryAlias).flat(),
];

// CONFIG OPTIONS
export enum ConfigOptions {
  Config = "config",
}

/**
 * CLI options and their aliases related to config
 */
export const configOptions: string[] = Object.values(ConfigOptions);
