import { expect, test, describe } from "vitest";
import { delay } from "../../src/utils/promise";

describe("Test for `utils:promise`", () => {
  describe("Test for `delay`", () => {
    test("should resolve after specific timeout", async () => {
      const start = Date.now();
      const timeout = 200;

      await delay(timeout);
      const end = Date.now();
      const duration = end - start;
      expect(duration).toBeGreaterThanOrEqual(timeout);
    });
  });
});
