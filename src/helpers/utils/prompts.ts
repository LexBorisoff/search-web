import $_ from 'prompts';

import type {
  MultiSelectConfig,
  MultiSelectReturn,
  SelectConfig,
  SelectReturn,
  TextConfig,
  TextReturn,
  ToggleOptions,
  ToggleReturn,
} from '@app-types/prompts.types.js';
import type { Choice, Options } from 'prompts';

export const prompts = {
  select<C extends Choice, Name extends string = string>(
    config: SelectConfig<C, Name>,
    options?: Options,
  ): SelectReturn<C, Name> {
    return $_({ ...config, type: 'select' }, options);
  },

  multiselect<C extends Choice, Name extends string = string>(
    config: MultiSelectConfig<C, Name>,
    options?: Options,
  ): MultiSelectReturn<C, Name> {
    return $_({ ...config, type: 'multiselect' }, options);
  },

  text<Name extends string = string>(
    config: TextConfig<Name>,
    options?: Options,
  ): TextReturn<Name> {
    return $_({ ...config, type: 'text' }, options);
  },

  toggle<Name extends string>(
    {
      active = 'yes',
      inactive = 'no',
      initial = false,
      ...config
    }: ToggleOptions<Name>,
    options?: Options,
  ): ToggleReturn<Name> {
    return $_(
      {
        ...config,
        type: 'toggle',
        initial,
        active,
        inactive,
      },
      options,
    );
  },
};
