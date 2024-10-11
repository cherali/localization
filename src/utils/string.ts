/**
 * Capitalize string
 * @param str - string
 * @returns capitalized string
 * @internal
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * unCapitalize string - lowercase first character
 * @param str - string
 * @returns unCapitalized string
 * @internal
 */
export function unCapitalize(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}
