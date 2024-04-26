interface NestedObject<V = any> {
  [key: string]: V | NestedObject<V>;
}

const isPrimitive = (value: unknown): value is string | number | boolean =>
  typeof value === "boolean" ||
  typeof value === "string" ||
  typeof value === "number";

/**
 * @param objectFallbackValue fallback value that is used when a matched property's value is an object
 */
export function findNested<
  V extends boolean | string | number,
  T extends NestedObject<V> = NestedObject<V>,
>(target: T, lookupKey: string, objectFallbackValue: V): V | null {
  return Object.keys(target).reduce<V | null>((result, key) => {
    if (result != null) {
      return result;
    }

    const value = target[key];

    if (key === lookupKey) {
      if (isPrimitive(value)) {
        return value;
      }

      return objectFallbackValue;
    }

    if (typeof value === "object") {
      return findNested(value, lookupKey, objectFallbackValue);
    }

    return null;
  }, null);
}
