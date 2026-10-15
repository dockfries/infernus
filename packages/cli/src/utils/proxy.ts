import { HttpsProxyAgent } from "https-proxy-agent";

/**
 * The proxy to reach a host through, taken from the environment.
 *
 * A Node program has no proxy support of its own, so a machine that reaches the
 * internet only through a proxy fails here unless the CLI reads the same
 * variables curl and git read. Both spellings are honoured, and `no_proxy`
 * exempts hosts so an internal mirror is not sent to the proxy.
 */
export function resolveProxyUrl(
  targetUrl: string | URL,
  env: NodeJS.ProcessEnv = process.env,
): string | null {
  const url = typeof targetUrl === "string" ? new URL(targetUrl) : targetUrl;

  if (isExempt(url, env.no_proxy ?? env.NO_PROXY)) return null;

  const proxy = env.https_proxy ?? env.HTTPS_PROXY ?? env.http_proxy ?? env.HTTP_PROXY;
  return proxy?.trim() ? proxy.trim() : null;
}

/** `no_proxy` is a comma separated list of hosts and optional ports */
function isExempt(url: URL, noProxy?: string) {
  if (!noProxy) return false;
  if (noProxy.trim() === "*") return true;

  const host = url.hostname.toLowerCase();
  const port = url.port || (url.protocol === "https:" ? "443" : "80");

  return noProxy
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
    .some((entry) => {
      // an entry may carry a port, and a leading dot means the whole domain
      const [entryHost, entryPort] = entry.split(":");
      if (entryPort && entryPort !== port) return false;
      if (entryHost === host) return true;

      const domain = entryHost.startsWith(".") ? entryHost.slice(1) : entryHost;
      return host.endsWith(`.${domain}`);
    });
}

/** An agent for this URL, or null when it should be reached directly. */
export function proxyAgentFor(targetUrl: string | URL) {
  const proxyUrl = resolveProxyUrl(targetUrl);
  return proxyUrl ? new HttpsProxyAgent(proxyUrl) : null;
}
