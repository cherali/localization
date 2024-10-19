import { expect, test, describe, vi } from "vitest";
import { localization } from "../../src/providers/client";

global.fetch = vi.fn();

describe("Test for `providers:client`", () => {
  describe("Test for functionality `with` partition, unCapitalize", () => {
    localization.init({
      path: "/__test__/locales",
      locales: ["fa", "en"],
      defaultLocale: "en",
      enablePartition: true,
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

    test("get: return Home translation", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          home: "H O M E",
        }),
      });

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

    test("get: request a partition that doesn't exist", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      const trx = await localization.get(["common"]);

      expect(Object.keys(trx)).toStrictEqual([]);
    });
  });
});
