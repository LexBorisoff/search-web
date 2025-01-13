import type { Arguments } from 'yargs';

export type Args = Arguments['_'];

export type Arg = Args[number];

export type Severity = 'neutral' | 'info' | 'success' | 'warning' | 'error';

export type BannerType = 'neutral' | 'header' | 'footer';
