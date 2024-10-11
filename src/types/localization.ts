/**
 * The options props for init function
 * @public
 */
export interface LocalizationOptions<T extends string> {
  /**
   * the translation directory path
   */
  readonly path: string;

  /**
   * list of supported locales, all reads and fetch's uses this locale array
   */
  readonly locales: Array<T>;

  /**
   * default locale, this must be one of items in locales array
   */
  readonly defaultLocale: T;

  /**
   * text direction for each locale
   */
  readonly textDirection: Record<T, "rtl" | "ltr">;

  /**
   * whether you want to have multiple files for language or have single file for a language.
   *
   * if you want separate your translation set this to true
   */
  readonly enablePartition?: boolean;

  /**
   * you have lowercase partition name and want to uppercase that partition when retrieve those partition
   *
   * only works if enablePartition is true
   */
  readonly capitalizePartitionName?: boolean;
}

/**
 * the abstract representation of translation object, which key is string and value can be string or object
 * @public
 */
export type NestedObject = {
  [key: string]: string | NestedObject;
};

/**
 * get localization hierarchy, a few part of it or the entire hierarchy.
 *
 * this is return type of `get` methods
 * @public
 */
export type ITranslation<T extends keyof Localization> = {
  [key in T]: Localization[key];
};
