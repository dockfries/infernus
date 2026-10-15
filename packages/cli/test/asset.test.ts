import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assetExtension, isIncludeAsset, isPluginAsset } from "../src/utils/asset";

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
