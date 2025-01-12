import { Browser, Engine } from '@lexjs/web-search';

export interface BrowserProfileQuery {
  browser: string;
  profiles: string[];
}

export type QueryBrowser = [string, Browser<string, any>];
export type QueryEngine = [string, Engine<any, any>];
