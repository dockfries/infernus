import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assetExtension,
  assetMatchesPattern,
  isIncludeAsset,
  isPluginAsset,
} from "../src/utils/asset";

/**
 * `path.extname` keeps the leading dot, and comparing its result against `dll`
 * is how plugin files once stopped being placed into projects, so the
 * normalisation is pinned here.
 */
describe("asset classification", () => {
  it("reports an extension without the dot", () => {
    assert.equal(assetExtension("samp-node.dll"), "dll");
    assert.equal(assetExtension("plugins/streamer.so"), "so");
    assert.equal(assetExtension("samp-node.inc"), "inc");
    assert.equal(assetExtension("no-extension"), "");
  });

  it("is not confused by case or by a dot in a directory name", () => {
    assert.equal(assetExtension("SAMP-NODE.DLL"), "dll");
    assert.equal(assetExtension("v1.2/samp-node.dll"), "dll");
    assert.equal(assetExtension("libnode.so.127"), "127");
  });

  it("recognises plugin binaries", () => {
    assert.equal(isPluginAsset("samp-node.dll"), true);
    assert.equal(isPluginAsset("streamer.so"), true);
    assert.equal(isPluginAsset("samp-node.inc"), false);
    assert.equal(isPluginAsset("samp-node.tar.gz"), false);
  });

  it("recognises include files", () => {
    assert.equal(isIncludeAsset("streamer.inc"), true);
    assert.equal(isIncludeAsset("streamer.dll"), false);
  });
});

/**
 * The pattern is read out of someone else's `pawn.json` and used as a regular
 * expression, so a nested quantifier in it makes matching backtrack
 * exponentially: the payloads below never return if they are run. They are
 * refused instead, and the patterns real repositories declare still work.
 */
describe("asset pattern matching", () => {
  const longName = `${"a".repeat(40)}.zip`;

  it("refuses a pattern that would backtrack forever", () => {
    for (const pattern of ["(a+)+$", String.raw`(a+)+\$`, "(?:a+)+$", "([a-z]+)*$"]) {
      assert.throws(
        () => assetMatchesPattern(pattern, longName),
        /nests quantifiers/,
        `expected "${pattern}" to be refused`,
      );
    }
  });

  it("refuses an absurdly long pattern", () => {
    assert.throws(() => assetMatchesPattern("a".repeat(600), longName), /too long/);
  });

  it("refuses a pattern that is not a valid expression", () => {
    assert.throws(() => assetMatchesPattern("evil(win32", longName), /Invalid regular expression/);
  });

  it("still matches what repositories actually declare", () => {
    const cases: [string, string[], string][] = [
      [
        String.raw`^samp-streamer-plugin-(.*)-win32\.zip$`,
        ["samp-streamer-plugin-2.9.6-win32.zip", "samp-streamer-plugin-2.9.6-linux-i386.tar.gz"],
        "samp-streamer-plugin-2.9.6-win32.zip",
      ],
      [
        "samp-node-windows.zip",
        ["samp-node-windows-x64.zip", "samp-node-windows.zip"],
        "samp-node-windows.zip",
      ],
      [String.raw`^open\.mp-win-x86\.zip$`, ["open.mp-win-x86.zip"], "open.mp-win-x86.zip"],
    ];

    for (const [pattern, assets, expected] of cases) {
      const matched = assets.filter((asset) => assetMatchesPattern(pattern, asset));
      assert.deepEqual(matched, [expected], `pattern "${pattern}"`);
    }
  });
});
