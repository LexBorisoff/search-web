import { stdout } from 'process';

interface Options {
  bar?: string;
  maxBars?: number;
  message?: string;
}

type OnCancelFn = () => void;

const defaultOptions: Required<Options> = {
  bar: '☕',
  maxBars: 5,
  message: '',
};

const ms = 250;
const start = 1;

function hideCursor(): void {
  stdout.write('\u001b[?25l\r');
}

function showCursor(): void {
  stdout.write('\u001b[?25h\r');
}

function clearLine(): void {
  stdout.write('\r' + ' '.repeat(80) + '\r');
}

function cleanup(interval: NodeJS.Timeout): void {
  clearLine();
  showCursor();
  clearInterval(interval);
}

export async function loading(
  task: (onCancel: OnCancelFn) => any | Promise<any>,
  options: Options = {},
): Promise<void> {
  const { maxBars, bar, message } = {
    ...defaultOptions,
    ...options,
  };
  const max = maxBars + start;

  function showLoading(i: number): void {
    if (i % max === 0) {
      clearLine();
    }
    stdout.write('\r' + `${message} ` + bar.repeat(i % max));
  }

  let i = start;
  hideCursor();

  const interval = setInterval(() => {
    showLoading(i);
    i = i % max === 0 ? start : i + 1;
  }, ms);

  try {
    await task(() => {
      cleanup(interval);
      stdout.write('\r❌ Cancelled');
    });
  } finally {
    cleanup(interval);
  }
}
