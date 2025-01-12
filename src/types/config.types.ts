import type { OmitKey } from './omit-key.type.js';
import type {
  BrowserConfig,
  BrowserName,
  EngineConfig,
  ResourceConfig,
  SearchConfig,
} from '../api/index.js';

export interface WithAlias {
  alias?: string | string[];
}

export interface IsDefault {
  isDefault?: boolean;
}

export interface BaseConfigOptions extends WithAlias, IsDefault {}

/* ~~~ ENGINES ~~~ */

export interface ConfigEngineOptions<
  S extends SearchConfig = undefined,
  R extends ResourceConfig = undefined,
> extends EngineConfig<S, R>,
    BaseConfigOptions {}

export interface ConfigEngine
  extends ConfigEngineOptions<SearchConfig, ResourceConfig> {
  baseUrl: string;
}

/* ~~~ BROWSERS ~~~ */

export interface Profile extends BaseConfigOptions {
  directory: string;
}

export interface ConfigProfiles {
  [key: string]: string | Profile;
}

export type ProfilesData = {
  [K in keyof ConfigProfiles]: Exclude<ConfigProfiles[K], string>;
};

export interface ConfigBrowserOptions
  extends OmitKey<
      BrowserConfig<NonNullable<BrowserName>, undefined>,
      'profiles'
    >,
    BaseConfigOptions {
  appPath?: string;
  profiles?: ConfigProfiles;
}

export type ConfigBrowser = ConfigBrowserOptions;

/* ~~~ DEFINE CONFIG ~~~ */

export type CreateEngineFn = (
  baseUrl: string,
  config?: ConfigEngineOptions<SearchConfig, ResourceConfig>,
) => ConfigEngine;
export type CreateBrowserFn = (config?: ConfigBrowserOptions) => ConfigBrowser;

export type ClearEnginesFn = () => void;
export type ClearBrowsersFn = () => void;

export interface DefineConfigProps {
  engine: CreateEngineFn;
  browser: CreateBrowserFn;
}

export type DefineConfigCallback = (
  props: DefineConfigProps,
) => Record<string, ConfigEngine | ConfigBrowser>;

export type DefineConfigFn = (callback: DefineConfigCallback) => void;

/* ~~~ CONFIG DATA ~~~ */

export interface ConfigMetaDto {
  projectDir?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ConfigDataDto {
  meta?: ConfigMetaDto;
  browsers?: Record<string, ConfigBrowser>;
  engines?: Record<string, ConfigEngine>;
}

export interface ConfigMetaJson {
  projectDir?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConfigDataJson extends Omit<ConfigDataDto, 'meta'> {
  meta?: ConfigMetaJson;
}

/* ~~~ DEFAULTS ~~~ */

export interface DefaultsData {
  delimiter: string;
  engine: [string, ConfigEngine];
  browser: [string, ConfigBrowser] | null;
  profile: (browserName: string) => [string, Profile] | null;
}
