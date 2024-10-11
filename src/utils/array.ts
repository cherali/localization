/**
 * Unique Primitive types [number, string, ...]
 * @param array - array input that want to be unique
 * @returns unique array
 * @internal
 */
export function uniquePrimitiveArray<T extends Array<unknown>>(array: T) {
  return [...new Set(array)] as T;
}
