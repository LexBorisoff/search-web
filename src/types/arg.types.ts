import {
  QueryOptions as Options,
  queryOptionTypes as types,
} from "../command/options.js";
import type { PrimitiveType } from "./primitive.type.js";

export interface ArgTypes {
  [Options.Browser]: PrimitiveType<(typeof types)[Options.Browser]>;
  [Options.Profile]: PrimitiveType<(typeof types)[Options.Profile]>;
  [Options.Engine]: PrimitiveType<(typeof types)[Options.Engine]>;
  [Options.Search]: PrimitiveType<(typeof types)[Options.Search]>;
  [Options.Resource]: PrimitiveType<(typeof types)[Options.Resource]>;
  [Options.Delimiter]: PrimitiveType<(typeof types)[Options.Delimiter]>;
  [Options.Port]: PrimitiveType<(typeof types)[Options.Port]>;
  [Options.Incognito]: PrimitiveType<(typeof types)[Options.Incognito]>;
  [Options.Split]: PrimitiveType<(typeof types)[Options.Split]>;
  [Options.Http]: PrimitiveType<(typeof types)[Options.Http]>;
  [Options.Test]: PrimitiveType<(typeof types)[Options.Test]>;
  [Options.Update]: PrimitiveType<(typeof types)[Options.Update]>;
}

export type ArrayArgType<O extends Options> =
  | ArgTypes[O]
  | ArgTypes[O][]
  | undefined;

export interface ArrayArgs {
  [Options.Browser]: ArrayArgType<Options.Browser>;
  [Options.Profile]: ArrayArgType<Options.Profile>;
  [Options.Engine]: ArrayArgType<Options.Engine>;
  [Options.Search]: ArrayArgType<Options.Search>;
  [Options.Resource]: ArrayArgType<Options.Resource>;
  [Options.Port]: ArrayArgType<Options.Port>;
}
