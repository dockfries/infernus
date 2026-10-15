import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveProxyUrl } from "../src/utils/proxy";

/**
 * A machine that only reaches the internet through a proxy configures it the way
 * curl and git do, so both spellings of every variable are honoured and
 * `no_proxy` keeps internal hosts out of the proxy.
 */
describe("resolveProxyUrl", () => {
  const target = "https://api.github.com/repos";

  it("uses the https proxy for an https target", () => {
    assert.equal(
      resolveProxyUrl(target, { https_proxy: "http://proxy.internal:3128" }),
      "http://proxy.internal:3128",
    );
  });

  it("accepts the upper case spelling", () => {
    assert.equal(
      resolveProxyUrl(target, { HTTPS_PROXY: "http://proxy.internal:3128" }),
      "http://proxy.internal:3128",
    );
  });

  it("falls back to the http proxy variables", () => {
    assert.equal(
      resolveProxyUrl(target, { http_proxy: "http://proxy.internal:8080" }),
      "http://proxy.internal:8080",
    );
    assert.equal(
      resolveProxyUrl(target, { HTTP_PROXY: "http://proxy.internal:8080" }),
      "http://proxy.internal:8080",
    );
  });

  it("prefers https_proxy when both are set", () => {
    assert.equal(
      resolveProxyUrl(target, {
        https_proxy: "http://secure:1",
        http_proxy: "http://plain:2",
      }),
      "http://secure:1",
    );
  });

  it("returns nothing when no proxy is configured", () => {
    assert.equal(resolveProxyUrl(target, {}), null);
    assert.equal(resolveProxyUrl(target, { https_proxy: "   " }), null);
  });

  it("respects no_proxy by host, domain and wildcard", () => {
    const env = { https_proxy: "http://proxy.internal:3128" };

    assert.equal(
      resolveProxyUrl("https://api.github.com/x", { ...env, no_proxy: "api.github.com" }),
      null,
    );
    assert.equal(
      resolveProxyUrl("https://api.github.com/x", { ...env, no_proxy: ".github.com" }),
      null,
    );
    assert.equal(resolveProxyUrl("https://api.github.com/x", { ...env, no_proxy: "*" }), null);
    assert.equal(
      resolveProxyUrl("https://api.github.com/x", { ...env, NO_PROXY: "github.com" }),
      null,
    );
  });

  it("still proxies a host that no_proxy does not cover", () => {
    const env = { https_proxy: "http://proxy.internal:3128", no_proxy: "example.com, .internal" };

    assert.equal(resolveProxyUrl("https://api.github.com/x", env), "http://proxy.internal:3128");
    // a suffix match must not swallow a lookalike domain
    assert.equal(
      resolveProxyUrl("https://notinternal.example/x", { ...env, no_proxy: "internal" }),
      "http://proxy.internal:3128",
    );
  });

  it("honours a port in no_proxy", () => {
    const env = { https_proxy: "http://proxy:3128", no_proxy: "api.github.com:8443" };

    assert.equal(resolveProxyUrl("https://api.github.com/x", env), "http://proxy:3128");
    assert.equal(resolveProxyUrl("https://api.github.com:8443/x", env), null);
  });
});
