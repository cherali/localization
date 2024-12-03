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
   * list of supported locales, all reads and fetches uses this locale array
   */
  readonly locales: readonly T[];

  /**
   * default locale, this must be one of items in locales array
   */
  readonly defaultLocale: T;

  /**
   * default text direction, if you want to prioritize a text direction, mainly for rtl languages
   *
   * this is useful when you have lots of `rtl` text direction locales, and few ltr text direction locales
   *
   * if you have lots of `ltr` text direction locales, you don't need to set this
   *
   * the `localeDirection` getter uses textDirection object and this direction to find the text direction
   *
   * setting this to `ltr` is not necessarily, because if you don't set this, the default value is `ltr`
   */
  readonly defaultTextDirection?: Directions;

  /**
   * text direction for locales
   *
   * you just need to set the locale that have a different text direction than `defaultTextDirection` (which is `ltr` by default)
   *
   * if `defaultTextDirection` is not set, any locale that is `NOT` in this object will have `ltr` text direction, so you just need to define `rtl` locales in this object
   *
   * if `defaultTextDirection` is set to `rtl`, any locale that is `NOT` in this object will have `rtl` text direction, so you just need to define `ltr` locales in this object
   *
   * setting `defaultTextDirection` is to `ltr` is NOT useful, and if you have lots of `ltr` text direction you can remove this, by setting this to `ltr` you need to define all locales that have `rtl` text direction
   *
   * also you can set all locales with text direction, but you don't need to do this
   *
   * so, if you have lots of `ltr` text direction locales, just set define the locales that have `rtl` text direction in this object
   * if you have lots of `rtl` text direction locales, first set `defaultTextDirection` to `rtl`, then define the locales that have `ltr` text direction in this object
   *
   * the `localeDirection` getter first use this object for returning the text direction, thus if you set `en` to `rtl` in this object, localeDirection will return `rtl`
   */
  readonly textDirection?: TextDirectionObject<T>;

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

/**
 * all available directions, which is `ltr` or `rtl`
 * @public
 */
export type Directions = "rtl" | "ltr";

/**
 * type of text direction object in init function
 *
 * just a record (object) with locales as key (optional), and `rtl` or 'ltr' as value
 *
 * @public
 */
export type TextDirectionObject<T extends string> = {
  [K in T]?: Directions;
};
