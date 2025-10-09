import os from "node:os";
import { HttpsProxyAgent } from "https-proxy-agent";

export const isWindows = os.platform() === "win32";

export const ompRepository = "openmultiplayer/open.mp";

export const proxyAgent = process.env.https_proxy
  ? new HttpsProxyAgent(process.env.https_proxy)
  : null;
