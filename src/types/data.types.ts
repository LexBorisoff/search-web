import { WithAlias } from "./utility.types";

// DEFAULTS
export interface DefaultsConfig {
  browser?: string;
  profile?: { [key: string]: string };
  engine?: string;
  delimiter?: string;
}

// BROWSERS
export interface BrowserObject extends WithAlias {
  name: string;
  path?: string;
}

export type Browser = string | BrowserObject;

export type BrowsersConfig<B = Browser> = Array<B>;

// PROFILES
export interface Profile extends WithAlias {
  directory: string; // --profile-directory
  path?: string;
}

export interface BrowserProfiles {
  [profile: string]: Profile;
}

export interface ProfilesConfig {
  [browser: string]: BrowserProfiles;
}

export interface Config {
  defaults?: DefaultsConfig;
  browsers?: BrowsersConfig;
  profiles?: ProfilesConfig;
}
