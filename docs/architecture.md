---
title: Architecture
aside: false
---

<script setup>
import { computed } from "vue";
import { useData, withBase } from "vitepress";

const { lang, isDark } = useData();

const locales = { "en-US": "en", "zh-Hans": "zh-CN", "es-ES": "es" };
const suffix = computed(() => locales[lang.value] ?? "en");
const theme = computed(() => (isDark.value ? "dark" : "light"));

const open = (name) => withBase(`/diagrams/${name}.${suffix.value}.html`);
const spec = (name) => withBase(`/diagrams/${name}.${suffix.value}.json`);
const embed = (name) =>
  withBase(`/diagrams/${name}.${suffix.value}.html?embed=1&theme=${theme.value}`);

// Frame ratios include the viewer's own 8px container padding, so the canvas
// is neither clipped nor letterboxed inside the frame.
const ratio = {
  "infernus-architecture": "1362 / 507",
  "infernus-core-internals": "1372 / 559",
  "infernus-sampnode-internals": "1300 / 583",
  "infernus-event-flow": "1080 / 509",
  "infernus-core-sampnode-bridge": "1080 / 589",
};
</script>

<div class="arch-prose">

# Architecture

These five diagrams document the `@infernus/*` monorepo from the outside in: the package graph and what each wrapper does; inside `@infernus/core`; inside the `samp-node` C++ plugin that embeds Node.js; how one event flows through core; and finally the full round trip between core and the plugin.

Each diagram is a self-contained artifact and follows the language you are reading the docs in. The embedded view is a static canvas — follow the link below any diagram for pan and zoom, node search and focus, relationship tracing, theme switching, and PNG/SVG export.

</div>

<div class="arch-prose">

## Monorepo and package internals

All 26 buildable packages under `packages/*` plus `types`, `shared`, the runtime host, and the build pipeline. The dependency spine runs left to right: a gamemode on `@infernus/core`, through the `samp-node` plugin, into the open.mp server. The four bordered regions group the wrapper packages by domain, and each node carries a concrete implementation fact — the native it wraps or the mechanism it uses.

Package names and native identifiers stay in English; region labels and the summary cards are authored in this page's language.

</div>

<div class="arch-canvas">
  <iframe :src="embed('infernus-architecture')" :style="{ aspectRatio: ratio['infernus-architecture'] }" title="Infernus monorepo and package internals" loading="lazy" referrerpolicy="no-referrer"></iframe>
</div>

<ul class="diagram-links">
  <li><a :href="open('infernus-architecture')" target="_blank" rel="noopener">Open the interactive diagram</a></li>
  <li><a :href="spec('infernus-architecture')" target="_blank" rel="noopener">View the diagram specification</a></li>
</ul>

<div class="arch-prose">

## Inside `@infernus/core`

The internal subsystems: `components` (entities, the `filterScript` loader, the `CmdBus` command dispatcher, the `GameMode` lifecycle), `utils` (the `bus.ts` event engine, `hook.ts` interception, `pools.ts` entity registries), and `wrapper` (the typed native bindings and the swappable `__inject__` tables).

`internalPlayerProps` is a `Symbol` key, which is why plugins can extend `Player` without colliding with core's private runtime fields.

</div>

<div class="arch-canvas">
  <iframe :src="embed('infernus-core-internals')" :style="{ aspectRatio: ratio['infernus-core-internals'] }" title="Inside @infernus/core" loading="lazy" referrerpolicy="no-referrer"></iframe>
</div>

<ul class="diagram-links">
  <li><a :href="open('infernus-core-internals')" target="_blank" rel="noopener">Open the interactive diagram</a></li>
  <li><a :href="spec('infernus-core-internals')" target="_blank" rel="noopener">View the diagram specification</a></li>
</ul>

<div class="arch-prose">

## Inside the `samp-node` plugin

`@infernus/core` is not a standalone library — every native call and every event ultimately goes through the C++ `samp-node` plugin, which embeds Node.js as a shared library (`libnode`). This diagram covers that plugin: the `PLUGIN_EXPORT` entry points (`Load`/`Unload`, `OnPublicCall`, `AmxLoad`, `ProcessTick`), the isolated V8 and `uv_loop` runtime created in `nodeimpl.cpp`, the `resource.cpp` bootstrap, and the `events.cpp` / `natives.cpp` / `callbacks.cpp` marshalling layers.

Two details explain most of the behaviour you observe in core. There is no separate Node thread: `ProcessTick` drives `Tick` on the server's main thread every frame. And since a listener may legitimately return a Promise, `handlePromiseReturnValue` spins `Tick` until that promise settles, which is why core can treat an `async` listener as returning a synchronous `0`/`1`.

</div>

<div class="arch-canvas">
  <iframe :src="embed('infernus-sampnode-internals')" :style="{ aspectRatio: ratio['infernus-sampnode-internals'] }" title="Inside the samp-node plugin" loading="lazy" referrerpolicy="no-referrer"></iframe>
</div>

<ul class="diagram-links">
  <li><a :href="open('infernus-sampnode-internals')" target="_blank" rel="noopener">Open the interactive diagram</a></li>
  <li><a :href="spec('infernus-sampnode-internals')" target="_blank" rel="noopener">View the diagram specification</a></li>
</ul>

<div class="arch-prose">

## How `defineEvent` runs

The runtime path behind every event, read straight from `packages/core/src/utils/bus.ts`. Registration is an import side effect: `defineEvent` calls `samp.registerEvent` to declare the native callback signature and `samp.on` to attach the `trigger`.

From there `trigger` runs the middleware chain — `beforeEach` parses the native arguments into a context object, each listener receives `{ next, defaultValue, ...context }`, and `next(value)` both advances the chain and merges `value` into that shared context. A listener that never calls `next()` halts propagation, and its return value becomes the event result after `transformReturnValue` normalizes it to `0` or `1`. `afterEach` runs once at the end.

That is what makes a listener chain compose: any link can inspect or rewrite what the downstream links see, or stop the event outright.

</div>

<div class="arch-canvas">
  <iframe :src="embed('infernus-event-flow')" :style="{ aspectRatio: ratio['infernus-event-flow'] }" title="defineEvent execution path" loading="lazy" referrerpolicy="no-referrer"></iframe>
</div>

<ul class="diagram-links">
  <li><a :href="open('infernus-event-flow')" target="_blank" rel="noopener">Open the interactive diagram</a></li>
  <li><a :href="spec('infernus-event-flow')" target="_blank" rel="noopener">View the diagram specification</a></li>
</ul>

<div class="arch-prose">

## core and the plugin, end to end

Putting both halves together: one native callback travelling inbound from open.mp through the plugin's AMX-to-V8 conversion into core's middleware chain, then outbound again through `callNative` and `InvokeNativeArray`.

The upper half of the timeline is plugin startup, including what the bootstrap script actually does; the lower half is the steady-state round trip. Read this diagram after the two above it — it is the join between them.

</div>

<div class="arch-canvas">
  <iframe :src="embed('infernus-core-sampnode-bridge')" :style="{ aspectRatio: ratio['infernus-core-sampnode-bridge'] }" title="core and samp-node bridge" loading="lazy" referrerpolicy="no-referrer"></iframe>
</div>

<ul class="diagram-links">
  <li><a :href="open('infernus-core-sampnode-bridge')" target="_blank" rel="noopener">Open the interactive diagram</a></li>
  <li><a :href="spec('infernus-core-sampnode-bridge')" target="_blank" rel="noopener">View the diagram specification</a></li>
</ul>

<style>
.arch-prose {
  max-width: 760px;
}

/* The diagram artifacts are self-contained viewers, so they are framed rather
   than inlined. A readable minimum width keeps node labels legible on narrow
   screens; the wrapper scrolls instead of shrinking the diagram. */
.arch-canvas {
  margin: 1.75rem 0 0;
  overflow-x: auto;
}

.arch-canvas iframe {
  display: block;
  width: 100%;
  min-width: 900px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.diagram-links {
  margin: 0.75rem 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.5rem;
}

/* `.vp-doc li + li` adds a top margin that would drop the second link out of
   the row, so it is reset with matching specificity. */
.vp-doc .diagram-links li + li {
  margin-top: 0;
}

.diagram-links a {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.diagram-links a:hover {
  text-decoration: underline;
}
</style>
