import { expect, test, describe, vi } from "vitest";
import { localization } from "../../src/providers/client";

global.fetch = vi.fn();

describe("Test for `providers:client`", () => {
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

    localization.setLocale("en");

    test("call fn on mismatch", async () => {
      const fn = vi.fn();
      localization.onMismatchLocale("de", fn);

      expect(fn).toHaveBeenCalled();
    });

    test("set locale with undefined: must set defaultLocale", async () => {
      localization.setLocale("fa");

      localization.setLocale(undefined);

      expect(localization.locale).toBe("en");
    });

    test("get: with empty array", async () => {
      await expect(localization.get([])).rejects.toThrow();
    });

    test("get: return existing translation", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          Home: {
            home: "H O M E",
          },
        }),
      });

      const trx = await localization.get(["Home"]);
      expect(Object.keys(trx)).toStrictEqual(["Home"]);
    });

    test("get current locale", () => {
      expect(localization.locale).toBe("en");
    });

    test("get locale direction", () => {
      expect(localization.localeDirection).toBe("ltr");
    });
  });
});
