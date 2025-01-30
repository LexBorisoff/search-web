import chalk from 'chalk';

export type HeaderKey = 'key' | 'alias';

interface BaseColumnsInterface {
  key: string;
  alias: string;
}

interface HeaderColumns extends BaseColumnsInterface {
  [key: string]: string;
}

interface Options {
  key: string;
  headerKey: HeaderKey;
  headerColumns: HeaderColumns;
  longestCell: BaseColumnsInterface;
  minFill: number;
}

export function fillCell({
  key,
  headerKey,
  headerColumns,
  longestCell,
  minFill,
}: Options): string {
  const header = headerColumns[headerKey];
  const cell = longestCell[headerKey];
  const longest = header.length > cell.length ? header.length : cell.length;

  const columnFill = '.'.repeat(longest - key.length + minFill);
  const styled = chalk.gray(columnFill);
  const empty = chalk.gray('.');
  return key.length === 0 ? empty + styled + ' ' : ' ' + styled + ' ';
}

export function fillHeaderCell({
  headerKey,
  headerColumns,
  longestCell,
  minFill,
}: Omit<Options, 'key'>): string {
  const header = headerColumns[headerKey];
  const cell = longestCell[headerKey];
  const column = header.length > cell.length ? header.length : cell.length;
  return ' ' + ' '.repeat(column + minFill - header.length) + ' ';
}
