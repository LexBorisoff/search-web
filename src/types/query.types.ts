import type { Browser, Engine } from '../api/index.js';

export interface BrowserProfileQuery {
  browser: string;
  profiles: string[];
}

export type QueryBrowser = [string, Browser<string, any>];
export type QueryEngine = [string, Engine<any, any>];
