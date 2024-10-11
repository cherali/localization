import { expect, test, describe } from "vitest";
import { uniquePrimitiveArray } from "../../src/utils/array";

describe("Test for `utils:array`", () => {
  describe("Test for `uniqueFlatArray`", () => {
    const testArray = ["a", "b", "c", "a", "c"];
    test("Unique array", () => {
      expect(uniquePrimitiveArray(testArray)).toStrictEqual(["a", "b", "c"]);
    });
  });
});
