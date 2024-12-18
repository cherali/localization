import { expect, test, describe, vi } from "vitest";
import { localization } from "../../src/providers/server";

describe("Test for `providers:server`", () => {
  test("Create new instance of localization must throw error", () => {
    expect(() => new localization()).toThrow();
  });

  describe("Test for functionality `with` partition, unCapitalize", () => {
    localization.init({
      path: "/__test__/locales",
      locales: ["fa", "en"],
      defaultLocale: "en",
      enablePartition: true,
    });

    test("call before pass handler to set locale", () => {
      expect(localization.localeDirection).toBe("ltr");
    });

    test("call fn on mismatch", async () => {
      const fn = vi.fn();
      localization.onMismatchLocale("de", fn);

      expect(fn).toHaveBeenCalled();
    });

    test("get: return all translation", async () => {
      localization.setLocale(() => "en");

      const trx = await localization.get();
      expect(Object.keys(trx)).toStrictEqual(["about", "home"]);
      expect(trx.home.home).toBe("H O M E");
    });

    test("get: return Home translation", async () => {
      const trx = await localization.get(["home"]);
      expect(Object.keys(trx)).toStrictEqual(["home"]);
      expect(trx.home.home).toBe("H O M E");
    });

    test("get current locale", () => {
      expect(localization.locale).toBe("en");
    });

    test("get locale direction", () => {
      expect(localization.localeDirection).toBe("ltr");
    });
  });
});
