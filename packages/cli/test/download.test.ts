import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { createHash } from "node:crypto";
import fs from "fs-extra";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { downloadFile } from "../src/utils/api";

/**
 * The download path is where a CLI can hang forever, so every failure mode is
 * pinned here: a body that errors, a body that goes quiet, and a body that does
 * not match the digest the repository published.
 */
describe("downloadFile", () => {
  const tempDirs: string[] = [];
  let server: http.Server;
  let baseUrl: string;

  /** per-path behaviour, so one server can serve every case */
  const routes = new Map<string, (res: http.ServerResponse) => void>();

  before(async () => {
    server = http.createServer((req, res) => {
      const handler = routes.get(req.url ?? "/");
      if (!handler) {
        res.writeHead(404).end("not found");
        return;
      }
      handler(res);
    });

    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    baseUrl = `http://127.0.0.1:${typeof address === "object" && address ? address.port : 0}`;
  });

  after(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await Promise.all(tempDirs.map((dir) => fs.remove(dir)));
  });

  async function target(name = "file.bin") {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "infernus-download-"));
    tempDirs.push(dir);
    return path.resolve(dir, name);
  }

  const sha256 = (content: Buffer) =>
    `sha256:${createHash("sha256").update(content).digest("hex")}`;

  it("downloads a body and verifies its digest", async () => {
    const body = Buffer.from("the whole file");
    routes.set("/ok", (res) => {
      res.writeHead(200, { "content-length": String(body.length) });
      res.end(body);
    });

    const file = await target();
    await downloadFile(`${baseUrl}/ok`, file, 0, { digest: sha256(body) });

    assert.equal(await fs.readFile(file, "utf8"), "the whole file");
    assert.equal(await fs.pathExists(`${file}.tmp`), false, "the temp file is renamed away");
  });

  it("rejects a body that does not match the published digest", async () => {
    routes.set("/corrupt", (res) => {
      res.writeHead(200);
      res.end(Buffer.from("tampered"));
    });

    const file = await target();
    await assert.rejects(
      () =>
        downloadFile(`${baseUrl}/corrupt`, file, 0, { digest: sha256(Buffer.from("original")) }),
      /checksum mismatch/,
    );
    assert.equal(await fs.pathExists(file), false, "nothing is left behind");
  });

  it("rejects a truncated body instead of accepting it", async () => {
    routes.set("/short", (res) => {
      res.writeHead(200, { "content-length": "1000" });
      res.end(Buffer.from("far less than promised"));
    });

    const file = await target();
    // the client aborts a body that ends before its declared length, so this
    // surfaces as a failed transfer rather than as the size check
    await assert.rejects(() => downloadFile(`${baseUrl}/short`, file));
    assert.equal(await fs.pathExists(file), false, "a short file is never installed");
  });

  it("cross-checks the received size when a server disagrees with itself", async () => {
    const body = Buffer.from("actual bytes sent");
    // the repository claims a different size than the server sent, which the
    // size guard catches before the digest is even computed
    routes.set("/size-mismatch", (res) => {
      res.writeHead(200, { "content-length": String(body.length) });
      res.end(body);
    });

    const file = await target();
    await assert.rejects(
      () => downloadFile(`${baseUrl}/size-mismatch`, file, 0, { expectedSize: body.length + 1 }),
      /expected \d+ bytes, received \d+/,
    );
  });

  it("fails instead of hanging when the body goes quiet", async () => {
    routes.set("/stall", (res) => {
      res.writeHead(200, { "content-length": "1000000" });
      res.write(Buffer.alloc(64));
      // never finish
    });

    const file = await target();
    await assert.rejects(
      () => downloadFile(`${baseUrl}/stall`, file, 5, { stallTimeout: 300 }),
      /no data received/,
    );
  });

  it("fails instead of hanging when the body errors mid transfer", async () => {
    routes.set("/broken", (res) => {
      res.writeHead(200, { "content-length": "1000000" });
      res.write(Buffer.alloc(64));
      setTimeout(() => res.destroy(), 50);
    });

    const file = await target();
    await assert.rejects(() => downloadFile(`${baseUrl}/broken`, file, 5));
    assert.equal(await fs.pathExists(file), false);
  });

  it("gives up after the retry limit and reports it", async () => {
    let attempts = 0;
    routes.set("/gone", (res) => {
      attempts += 1;
      res.destroy();
    });

    const file = await target();
    await assert.rejects(
      () => downloadFile(`${baseUrl}/gone`, file),
      /Download failed after 5 attempts/,
    );
    assert.ok(attempts > 1, `expected retries, saw ${attempts} attempt(s)`);
  });

  it("does not retry a 404", async () => {
    let attempts = 0;
    routes.set("/missing", (res) => {
      attempts += 1;
      res.writeHead(404).end("nope");
    });

    const file = await target();
    await assert.rejects(() => downloadFile(`${baseUrl}/missing`, file));
    assert.equal(attempts, 1, "a missing asset is not a transient failure");
  });
});
