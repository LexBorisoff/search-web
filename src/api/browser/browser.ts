import open, { apps, openApp } from 'open';

import { returnTypeGuard } from '../utils/return-type-guard.js';

import type {
  BrowserConfig,
  BrowserName,
  OpenMethodOptions,
  ProfileGetterFn,
  ProfilesConfig,
} from './browser.types.js';

export class Browser<
  N extends BrowserName = undefined,
  P extends ProfilesConfig = undefined,
> {
  #browserName?: N;

  #config?: BrowserConfig<N, P>;

  constructor(browserName?: N, config?: BrowserConfig<N, P>) {
    this.#browserName = browserName;
    this.#config = config;
  }

  public async open(
    url?: string | string[] | null,
    options: OpenMethodOptions<N, P> = {},
  ): Promise<void> {
    const urls = this.getUrls(url);

    if (this.#browserName == null) {
      if (urls.length > 0) {
        await Promise.all(
          urls.map(async (link) => {
            await open(link);
          }),
        );
      }

      return;
    }

    const browserAppName = this.getBrowserAppName(this.#browserName);

    if (urls.length > 0) {
      await Promise.all(
        urls.map(async (link) => {
          await this.handleOpen(async (browserArguments) => {
            await open(link, {
              app: {
                name: browserAppName,
                arguments: browserArguments,
              },
            });
          }, options);
        }),
      );

      return;
    }

    this.handleOpen(async (browserArguments) => {
      await openApp(browserAppName, {
        arguments: browserArguments,
      });
    }, options);
  }

  private async handleOpen(
    handler: (browserArguments: string[]) => Promise<void>,
    options: Pick<OpenMethodOptions<N, P>, 'profile' | 'incognito'>,
  ): Promise<void> {
    const { profile: profileValue, incognito = false } = options;
    const profiles = this.getProfiles(profileValue);

    if (profiles.length > 0) {
      await Promise.all(
        profiles.map(async (profile) => {
          const browserArguments = this.getBrowserArguments(incognito, profile);
          await handler(browserArguments);
        }),
      );

      return;
    }

    await handler(this.getBrowserArguments(incognito));
  }

  private getUrls(value: string | string[] | null | undefined): string[] {
    if (typeof value === 'string') {
      return [value];
    }

    if (
      Array.isArray(value) &&
      value.every((url): url is string => typeof url === 'string')
    ) {
      return value;
    }

    return [];
  }

  private getProfiles(
    profileValue: string | string[] | ProfileGetterFn<P> | undefined,
  ): string[] {
    if (typeof profileValue === 'string') {
      return [profileValue];
    }

    if (
      Array.isArray(profileValue) &&
      profileValue.every((value): value is string => typeof value === 'string')
    ) {
      return profileValue;
    }

    const { profiles } = this.#config ?? {};
    if (
      profileValue != null &&
      profileValue instanceof Function &&
      profiles != null
    ) {
      const result = returnTypeGuard(profileValue, profiles);
      if (result != null) {
        return Array.isArray(result) ? result : [result];
      }
    }

    return [];
  }

  private getBrowserAppName(browserName: string): string | readonly string[] {
    switch (browserName.toLowerCase()) {
      case 'chrome':
        return apps.chrome;
      case 'firefox':
        return apps.firefox;
      case 'edge':
        return apps.edge;
      default:
        return browserName;
    }
  }

  private getBrowserArguments(
    incognito: boolean,
    profileDirectory?: string,
  ): string[] {
    const browserName = this.#browserName;
    const browserArguments: string[] = [];

    if (profileDirectory != null) {
      browserArguments.push(`--profile-directory=${profileDirectory}`);
    }

    if (browserName != null && incognito) {
      let incognitoValue = 'incognito';

      if (browserName === 'edge') {
        incognitoValue = 'inprivate';
      } else if (browserName === 'firefox' || browserName === 'opera') {
        incognitoValue = 'private';
      }

      browserArguments.push(`--${incognitoValue}`);
    }

    return browserArguments;
  }
}
