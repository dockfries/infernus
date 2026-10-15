import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { generateRandomString } from "../src/utils/random";

/**
 * The generated value becomes the rcon password of a new project, so it has to
 * be unpredictable and exactly as long as the prompt claims.
 */
describe("generateRandomString", () => {
  it("returns exactly the requested length", () => {
    for (const length of [1, 4, 12, 32, 64]) {
      for (let attempt = 0; attempt < 200; attempt++) {
        assert.equal(
          generateRandomString(length).length,
          length,
          `length ${length} was not honoured`,
        );
      }
    }
  });

  it("only emits characters the rcon prompt accepts", () => {
    for (let attempt = 0; attempt < 500; attempt++) {
      assert.match(generateRandomString(12), /^\w+$/);
    }
  });

  it("uses the whole alphabet instead of a predictable subset", () => {
    const seen = new Set<string>();
    for (let attempt = 0; attempt < 400; attempt++) {
      for (const char of generateRandomString(32)) seen.add(char);
    }

    const expected = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    assert.equal([...seen].sort().join(""), [...expected].sort().join(""));
  });

  it("does not repeat itself", () => {
    const values = new Set<string>();
    for (let attempt = 0; attempt < 1000; attempt++) values.add(generateRandomString(12));

    assert.equal(values.size, 1000, "generated passwords must be distinct");
  });
});
