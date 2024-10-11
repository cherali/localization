import { describe, test, expect } from "vitest";
import { capitalize, unCapitalize } from "../../src/utils/string";

describe("Test for `utils:string`", () => {
  describe("Test for `capitalize`", () => {
    const text = "a sample Text";
    test("Capitalize", () => {
      expect(capitalize(text)).toBe("A sample Text");
    });
  });

  describe("Test for `unCapitalize`", () => {
    const text = "A sample Text";
    test("UnCapitalize", () => {
      expect(unCapitalize(text)).toBe("a sample Text");
    });
  });
});
