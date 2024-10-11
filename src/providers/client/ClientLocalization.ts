import { capitalize, unCapitalize } from "../../utils/string.ts";
import { uniquePrimitiveArray } from "../../utils/array.ts";
import { delay } from "../../utils/promise.ts";
import type { ITranslation, LocalizationOptions, NestedObject } from "../../types/localization.ts";

/**
 * if you using CSR, use this class to add localization to your app.
 *
 * this use fetch to retrieve json files form server, when you calls get and the file doesn't exist
 *
 * recommend to set `enablePartition` and `capitalizePartitionName` to true
 * @public
 */

class ClientLocalization {
  static #translation: NestedObject = {};
  static #options: LocalizationOptions<string>;
  static #loading: Record<string, boolean> = {};
  static #loadingPromises: Record<string, Promise<boolean>> = {};
  static #loadingPromisesValue: boolean[] = [];

  static #locale = "";

  constructor() {
    throw new Error("Can't directly create new instance form this class.");
  }

  /**
   * store options in the localization class
   * calling this once per app in enough, but if call this few times, really doesn't matter
   * @param options - define how localization must behave
   * @public
   */
  static init<T extends string>(options: LocalizationOptions<T>) {
    this.#options = options;
  }

  /**
   * use to access the translations
   * @param parts - list of parts/partition in your translation, or undefined
   * @returns
   * - if calls with `no params`: returns existing translations base on locale.
   *
   * - if calls with `array of string`: if part exist get it from translation object then returns it, if not fetch the translation
   *
   * @public
   */
  static async get<K extends keyof Localization>(parts: K[]): Promise<ITranslation<K>> {
    this.#validateGet(parts);

    let loadings: Promise<boolean>[] = [];

    // fetch all partition is expensive, therefore just return translation if parts is undefined
    if (this.#options.enablePartition) {
      await this.#fetchTranslationWithPartition(parts);

      // map through parts to identify which one is is fetching
      loadings = parts.map(part => {
        const key = this.#getLoadingKeyWithPartition(this.#getPartName(part));
        return this.#loadingPromises[key]!;
      });
    } else {
      await this.#fetchTranslationWithoutPartition();

      // if translation file is fetching
      loadings.push(this.#loadingPromises[this.#locale]!);
    }

    // if some required partition is loading do nothing and await for it to be resolved
    do {
      this.#loadingPromisesValue = await Promise.all(loadings);
      await delay(0);
    } while (this.#loadingPromisesValue.some(result => result));

    return this.#getTranslation(parts);
  }

  /**
   * use to change locale
   * @param locale - the locale you want to set
   * @public
   */
  static setLocale(locale: string | undefined) {
    this.#locale = this.#options.locales.includes(locale || "") ? locale! : this.#options.defaultLocale;
  }

  /**
   * called when locale not exist on locales array
   * @param locale - app locale
   * @param callback - a callback function, executes if locale not exist in locales array
   * @public
   */
  static onMismatchLocale(locale: string | undefined, callback: (defaultLocale: string) => void) {
    if (locale == undefined || !this.#options.locales.includes(locale)) {
      callback(this.#options.defaultLocale);
    }
  }

  /**
   * get locale text direction
   * @public
   */
  static get localeDirection() {
    return this.#options.textDirection[this.#locale];
  }

  /**
   * return localization locale
   * @public
   */
  static get locale() {
    return this.#locale as Locales[number];
  }

  static async #fetchTranslationWithPartition<K extends keyof Localization>(parts: K[]) {
    this.#translation[this.#locale] = this.#translation[this.#locale] || {};

    const files = uniquePrimitiveArray(parts).map(async part => {
      const partName = this.#getPartName(part);

      const key = this.#getLoadingKeyWithPartition(partName);
      const translationKey = this.#options.capitalizePartitionName ? capitalize(partName) : partName;

      const isTranslationExist = (this.#translation[this.#locale] as NestedObject)[translationKey];

      if (!isTranslationExist && !this.#isLoading(key)) {
        const filePath = `${this.#options.path}/${key}.json`;

        const translation = await this.#fetchTranslation(filePath, key);

        // if succeeded to fetch, set translation and return file
        if (translation) {
          (this.#translation[this.#locale] as NestedObject)[translationKey] = translation;
          return translation;
        }
      }
    });

    await Promise.all(files);
  }

  static async #fetchTranslationWithoutPartition() {
    if (!this.#translation[this.#locale] && !this.#isLoading(this.#locale)) {
      const translation = await this.#fetchTranslation(`${this.#options.path}/${this.#locale}.json`, this.#locale);
      // if succeeded to fetch, set translation
      if (translation) {
        this.#translation[this.#locale] = translation;
      }
    }
  }

  static async #fetchTranslation(path: string, loadingKey: string) {
    this.#setLoading(loadingKey, true);
    return await fetch(path).then(res => {
      this.#setLoading(loadingKey, false);
      // if success return response
      if (res.ok) {
        return res.json();
      }
      // return false if failed
      return false;
    });
  }

  static #isLoading(key: string) {
    return this.#loading?.[key];
  }

  static #setLoading(key: string, value: boolean) {
    this.#loading[key] = value;
    this.#loadingPromises[key] = Promise.resolve(value);
  }

  static #getPartName(part: string) {
    return this.#options.capitalizePartitionName ? unCapitalize(part) : part;
  }

  static #getLoadingKeyWithPartition(partName: string) {
    return `${partName}/${partName}.${this.#locale}`;
  }

  static #validateGet(parts: string[]) {
    if (parts.length == 0) {
      throw new Error(
        "Can't use get with empty array, if you need to return all translations just call get without any parameters.",
      );
    }
  }

  static #getTranslation<K extends keyof Localization>(parts: K[]) {
    const translations: Partial<ITranslation<K>> = {};

    const localeTranslation = this.#translation[this.#locale] as unknown as Localization;

    uniquePrimitiveArray(parts).forEach(part => {
      const translation = localeTranslation?.[part];
      if (part && translation) {
        translations[part] = translation as Localization[K];
      }
    });
    return translations as ITranslation<K>;
  }
}

export { ClientLocalization };
