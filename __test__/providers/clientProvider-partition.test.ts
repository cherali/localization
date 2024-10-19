import { expect, test, describe, vi } from "vitest";
import { localization } from "../../src/providers/client";

global.fetch = vi.fn();

describe("Test for `providers:client`", () => {
  describe("Test for functionality `with` partition, and capitalize", () => {
    localization.init({
      path: "/__test__/locales",
      locales: ["fa", "en"],
      defaultLocale: "fa",
      defaultTextDirection: "rtl",
      textDirection: {
        en: "ltr",
      },
      capitalizePartitionName: true,
      enablePartition: true,
    });

    localization.setLocale("en");

    test("call fn on mismatch", async () => {
      const fn = vi.fn();
      localization.onMismatchLocale("de", fn);

      expect(fn).toHaveBeenCalled();
    });

    test("set locale with undefined: must set defaultLocale", async () => {
      localization.setLocale("en");

      localization.setLocale(undefined);

      expect(localization.locale).toBe("fa");
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

      const trx = await localization.get(["Home"]);
      expect(Object.keys(trx)).toStrictEqual(["Home"]);
      expect(trx.Home.home).toBe("H O M E");
    });

    test("get current locale", () => {
      expect(localization.locale).toBe("fa");
    });

    test("get locale direction", () => {
      expect(localization.localeDirection).toBe("rtl");
    });

    test("get: request a partition that doesn't exist", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      const trx = await localization.get(["Common"]);

      expect(Object.keys(trx)).toStrictEqual([]);
    });

    test("get: request a partition that takes time", async () => {
      (global.fetch as any)
        .mockImplementationOnce(() => {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve({
                json: () => Promise.resolve({}),
              });
            }, 500);
          });
        })
        .mockImplementationOnce(() => {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve({
                json: () => Promise.resolve({}),
              });
            }, 500);
          });
        });

      const trx = await localization.get(["Home"]);
      const trx2 = await localization.get(["Home"]);

      expect(Object.keys(trx)).toStrictEqual(["Home"]);
      expect(Object.keys(trx2)).toStrictEqual(["Home"]);
    });
  });
});
