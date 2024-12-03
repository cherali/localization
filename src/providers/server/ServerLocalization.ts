import path from "path";
import { readFileSync, readdirSync } from "fs";
import { ITranslation, LocalizationOptions, NestedObject, Directions } from "../../types/localization";
import { capitalize } from "../../utils/string";
import { uniquePrimitiveArray } from "../../utils/array";

/**
 * if you want render files on server and send rendered page to client use this class.
 *
 * this uses fs and path to read all files, and you can access translation by using `get`.
 * @public
 */
class ServerLocalization {
  static #translation: NestedObject = {};
  static #options: LocalizationOptions<string>;

  static #getLocale: () => string = () => this.#options?.defaultLocale;

  constructor() {
    throw new Error("Can't directly create new instance form this class.");
  }

  /**
   * this methods read all localization files based on locales, path and enablePartition.
   *
   * you must make sure this init only calls once per app, because calling init on every request is costly operation.
   * @param options - define how localization must behave
   * @public
   */
  static init<T extends string>(options: LocalizationOptions<T>) {
    this.#options = options;

    const dirPath = this.#getPath(options.path);

    if (options.enablePartition) {
      this.#readTranslationWithPartition(options.locales, dirPath, options.capitalizePartitionName);
    } else {
      this.#readTranslationWithoutPartition(options.locales, dirPath);
    }
  }

  /**
   * use to access the translations
   * @param parts - list of parts/partition in your translation, or undefined
   * @returns
   * - if calls with `no params`: returns all the translation object base on locale.
   *
   * - if calls with `array of string`: get that parts from translation object then returns it
   *
   * @public
   */
  static get<K extends keyof Localization>(parts?: K[]): Localization | ITranslation<K> {
    this.#validateGet(parts);

    const locale = this.#getLocale();

    if (parts == undefined) {
      return this.#translation[locale] as unknown as Localization;
    }

    return this.#getTranslation(parts, locale);
  }

  /**
   * use to change locale
   * @param handler - the handler which retrieve the locale
   * @public
   */
  static setLocale(handler: () => string) {
    this.#getLocale = handler;
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
  static get localeDirection(): Directions {
    const direction = this.#options.textDirection?.[this.#getLocale()];
    return direction ?? this.#options.defaultTextDirection ?? "ltr";
  }

  /**
   * return localization locale
   * @public
   */
  static get locale() {
    return this.#getLocale() as Locales[number];
  }

  static #readTranslationWithPartition(locales: string[], dirPath: string, capitalizePartitionName: boolean = false) {
    const folders = readdirSync(process.cwd() + dirPath, { withFileTypes: true })
      .filter(f => f.isDirectory())
      .map(f => f.name);

    locales.forEach(locale => {
      this.#translation[locale] = {};

      folders.forEach(folder => {
        const filePath = this.#joinPaths(dirPath, folder, `${folder}.${locale}.json`);
        const translationKey = capitalizePartitionName ? capitalize(folder) : folder;
        const file = this.#readSingleFile(filePath);

        (this.#translation[locale] as NestedObject)[translationKey] = JSON.parse(file);
      });
    });
  }

  static #readTranslationWithoutPartition(locales: string[], path: string) {
    locales.forEach(locale => {
      const file = this.#readSingleFile(this.#joinPaths(path, `${locale}.json`));

      this.#translation[locale] = JSON.parse(file);
    });
  }

  static #getPath(dirPath: string) {
    return path.sep + path.join(...dirPath.split("/").filter(f => f));
  }

  static #joinPaths(...args: Array<string>) {
    return path.join(...args);
  }

  static #readSingleFile(path: string) {
    return readFileSync(process.cwd() + path, "utf8");
  }

  static #validateGet<K extends keyof Localization>(parts?: K[]) {
    if (parts?.length == 0) {
      throw new Error(
        "Can't use get with empty array, if you need to return all translations just call get without any parameters.",
      );
    }
  }

  static #getTranslation<K extends keyof Localization>(parts: K[], locale: string) {
    const translations: Partial<ITranslation<K>> = {};

    const localeTranslation = this.#translation[locale] as unknown as Localization;

    uniquePrimitiveArray(parts).forEach(part => {
      const translation = localeTranslation?.[part];
      if (part && translation) {
        translations[part] = translation as Localization[K];
      }
    });
    return translations as ITranslation<K>;
  }
}

export { ServerLocalization };
