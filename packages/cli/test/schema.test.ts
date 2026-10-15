/**
 * Validate the shipped JSON schema against the real files and against the
 * version strings the CLI actually accepts.
 *
 * Run from the repository root:
 *   npx tsx packages/cli/test/schema.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv/dist/2020.js";
import { validRange } from "../src/utils/semver";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const schema = JSON.parse(
  fs.readFileSync(path.resolve(packageRoot, "schemas", "infernus.schema.json"), "utf8"),
);

const validate = new Ajv({ strict: true, allErrors: true }).compile(schema);

const manifest = (dependencies: Record<string, unknown>) => ({ dependencies });

/**
 * The CLI writes `$schema` into both of the files it owns, so the helpers here
 * build what a project really contains rather than a simplified shape; a
 * lockfile without it is not something the CLI ever produces.
 */
const SCHEMA_URL =
  "https://raw.githubusercontent.com/dockfries/infernus/main/packages/cli/schemas/infernus.schema.json";

const lockfile = (dependencies: Record<string, unknown>, lockfileVersion: unknown = 1) => ({
  $schema: SCHEMA_URL,
  lockfileVersion,
  dependencies,
});

describe("infernus.schema.json", () => {
  it("accepts the project files the CLI writes", () => {
    assert.equal(
      validate({
        $schema: SCHEMA_URL,
        dependencies: {
          "dockfries/samp-node": "^2.6.1",
          "openmultiplayer/open.mp": "^1.5.8",
          "dockfries/samp-streamer-plugin": "^2.9.6",
        },
      }),
      true,
      JSON.stringify(validate.errors),
    );

    // exactly what writeLockFile leaves on disk, $schema included
    assert.equal(
      validate(
        lockfile({
          "openmultiplayer/open.mp": { version: "v1.5.8.3079" },
          "dockfries/samp-node": { version: "2.6.1", component: false },
        }),
      ),
      true,
      JSON.stringify(validate.errors),
    );
  });

  it("accepts a lockfile that carries the schema key", () => {
    assert.equal(
      validate(lockfile({ "dockfries/samp-node": { version: "2.6.1" } })),
      true,
      "the CLI writes $schema into the lockfile, so the schema must allow it",
    );
  });

  it("accepts every version shape the CLI accepts in a manifest", () => {
    const specs = ["*", "^1.5.8", "1.6.7", "~2.9.6", ">=1.0.0", "v1.6.7.3218", "1.6.7.3217"];

    for (const spec of specs) {
      assert.equal(validRange(spec), true, `the CLI accepts ${spec}`);
      assert.equal(
        validate(manifest({ "openmultiplayer/open.mp": spec })),
        true,
        `the schema accepts ${spec}: ${JSON.stringify(validate.errors)}`,
      );
    }
  });

  it("rejects a manifest that is really a lockfile, and the other way round", () => {
    assert.equal(validate(manifest({ "openmultiplayer/open.mp": { version: "1" } })), false);
    assert.equal(validate(lockfile({ "openmultiplayer/open.mp": "^1.5.8" })), false);
    assert.equal(validate({ lockfileVersion: 1, dependencies: {}, extra: true }), false);
  });

  it("rejects the mistakes a hand edit makes", () => {
    assert.equal(validate(manifest({ openmp: "^1.5.8" })), false, "identifier without owner");
    assert.equal(validate(manifest({ "a/b/c": "^1.5.8" })), false, "too many slashes");
    assert.equal(validate(manifest({ "openmultiplayer/open.mp": "latest" })), false);
    assert.equal(validate(manifest({ "openmultiplayer/open.mp": "^" })), false);
    assert.equal(validate(lockfile({ "openmultiplayer/open.mp": {} })), false, "version required");
    assert.equal(
      validate(lockfile({ "openmultiplayer/open.mp": { version: "v1.5.8.3079", bogus: 1 } })),
      false,
      "unknown keys inside a locked dependency",
    );
    assert.equal(validate(lockfile({}, "1")), false, "lockfileVersion is a number");
  });
});
