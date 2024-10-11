/**
 *
 * @param ms - delay amount base on milliseconds
 * @returns a promise that resolve after delay
 * @internal
 */
export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
