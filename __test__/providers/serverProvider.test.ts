import { expect, test, describe, vi } from "vitest";
import { localization } from "../../src/providers/server";

describe("Test for `providers:server`", () => {
  test("Create new instance of localization must throw error", () => {
    expect(() => new localization()).toThrow();
  });

  describe("Test for functionality `without` partition", () => {
    localization.init({
      path: "/__test__/locales",
      locales: ["fa", "en"],
      defaultLocale: "en",
      textDirection: {
        en: "ltr",
        fa: "rtl",
      },
    });

    test("call before pass handler to set locale", () => {
      expect(localization.locale).toBe("en");
    });

    localization.setLocale(() => "en");

    test("get: with empty array", () => {
      expect(() => localization.get([])).toThrow();
    });

    test("call fn on mismatch", async () => {
      const fn = vi.fn();
      localization.onMismatchLocale("de", fn);

      expect(fn).toHaveBeenCalled();
    });

    test("get: return all translation", async () => {
      const trx = await localization.get();
      expect(Object.keys(trx)).toStrictEqual(["Home", "About"]);
      expect(trx.Home.home).toBe("H O M E");
    });

    test("get: return Home translation", async () => {
      const trx = await localization.get(["Home"]);
      expect(Object.keys(trx)).toStrictEqual(["Home"]);
      expect(trx.Home.home).toBe("H O M E");
    });

    test("get current locale", () => {
      expect(localization.locale).toBe("en");
    });

    test("get locale direction", () => {
      expect(localization.localeDirection).toBe("ltr");
    });
  });
});
