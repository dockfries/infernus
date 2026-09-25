---
title: 架构总览
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

// 画框比例已计入查看器自身 8px 的内边距，避免图面被裁切或出现黑边。
const ratio = {
  "infernus-architecture": "1362 / 507",
  "infernus-core-internals": "1372 / 559",
  "infernus-sampnode-internals": "1300 / 583",
  "infernus-event-flow": "1080 / 509",
  "infernus-core-sampnode-bridge": "1080 / 589",
};
</script>

<div class="arch-prose">

# 架构总览

这五张图由外向内说明 `@infernus/*`：单仓子包及其实现、`@infernus/core` 内部、嵌入 Node.js 的 `samp-node` C++ 插件内部、一个事件在 core 中的运行链路，最后是 core 与插件之间的完整往返。

每张图都是自包含的成品文件，语言跟随你当前阅读的文档语言。嵌入的是静态图面；点开图下方的链接可用平移缩放、节点搜索与聚焦、关系追踪、明暗主题切换，以及导出 PNG/SVG。

</div>

<div class="arch-prose">

## 单仓全貌与子包实现

`packages/*` 下 26 个可构建子包，加上 `types`、`shared`、运行时宿主与构建管线。依赖主脊自左向右：基于 `@infernus/core` 的 Gamemode，经 `samp-node` 插件，接入 open.mp 服务端。四个带边框的区域按用途归类各封装子包，每个节点都标注了具体实现——封装了哪个原生，或用了什么机制。

包名与原生函数名保持英文原样，区域标题与结论卡片随本页语言。

</div>

<div class="arch-canvas">
  <iframe :src="embed('infernus-architecture')" :style="{ aspectRatio: ratio['infernus-architecture'] }" title="Infernus 单仓架构与子包实现" loading="lazy" referrerpolicy="no-referrer"></iframe>
</div>

<ul class="diagram-links">
  <li><a :href="open('infernus-architecture')" target="_blank" rel="noopener">打开交互版架构图</a></li>
  <li><a :href="spec('infernus-architecture')" target="_blank" rel="noopener">查看架构图规格</a></li>
</ul>

<div class="arch-prose">

## `@infernus/core` 内部

内部子系统：`components`（实体、`filterscript` 装载器、`CmdBus` 指令分发、`GameMode` 生命周期）、`utils`（`bus.ts` 事件引擎、`hook.ts` 拦截、`pools.ts` 实体池），以及 `wrapper`（带类型的原生封装与可替换的 `__inject__` 表）。

`internalPlayerProps` 用的是 `Symbol` 键，所以插件扩展 `Player` 时不会覆盖 core 的私有运行时字段。

</div>

<div class="arch-canvas">
  <iframe :src="embed('infernus-core-internals')" :style="{ aspectRatio: ratio['infernus-core-internals'] }" title="@infernus/core 内部子系统" loading="lazy" referrerpolicy="no-referrer"></iframe>
</div>

<ul class="diagram-links">
  <li><a :href="open('infernus-core-internals')" target="_blank" rel="noopener">打开交互版架构图</a></li>
  <li><a :href="spec('infernus-core-internals')" target="_blank" rel="noopener">查看架构图规格</a></li>
</ul>

<div class="arch-prose">

## `samp-node` 插件内部

`@infernus/core` 不是独立运行的库——每一次原生调用、每一个事件最终都要经过 C++ 写的 `samp-node` 插件，而该插件把 Node.js 以共享库形式（`libnode`）嵌进服务端进程。这张图覆盖插件本身：`PLUGIN_EXPORT` 导出入口（`Load`/`Unload`、`OnPublicCall`、`AmxLoad`、`ProcessTick`）、`nodeimpl.cpp` 里创建的独立 V8 与 `uv_loop` 运行时、`resource.cpp` 的 bootstrap，以及 `events.cpp` / `natives.cpp` / `callbacks.cpp` 三层编组。

有两点能解释你在 core 里看到的大部分行为。第一，没有独立的 Node 线程：`ProcessTick` 在服务端主线程上每帧驱动 `Tick`。第二，监听器可以合法地返回 Promise，于是 `handlePromiseReturnValue` 会自旋调用 `Tick` 直到该 promise settled——这就是 core 能把 `async` 监听器当作同步返回 `0`/`1` 处理的原因。

</div>

<div class="arch-canvas">
  <iframe :src="embed('infernus-sampnode-internals')" :style="{ aspectRatio: ratio['infernus-sampnode-internals'] }" title="samp-node 插件内部架构" loading="lazy" referrerpolicy="no-referrer"></iframe>
</div>

<ul class="diagram-links">
  <li><a :href="open('infernus-sampnode-internals')" target="_blank" rel="noopener">打开交互版架构图</a></li>
  <li><a :href="spec('infernus-sampnode-internals')" target="_blank" rel="noopener">查看架构图规格</a></li>
</ul>

<div class="arch-prose">

## `defineEvent` 的运行链路

这是所有事件背后的运行路径，直接取自 `packages/core/src/utils/bus.ts`。注册是 import 时的副作用：`defineEvent` 调 `samp.registerEvent` 声明原生回调参数表，再调 `samp.on` 挂上 `trigger`。

之后 `trigger` 跑整条中间件链——`beforeEach` 把原生参数解析成上下文对象，每个监听器收到 `{ next, defaultValue, ...上下文 }`；`next(value)` 既前进到下一个监听器，也把 `value` 合并进这个共享上下文。监听器不调用 `next()` 就中断传播，其返回值经 `transformReturnValue` 归一化成 `0` 或 `1` 后成为事件结果。链结束后 `afterEach` 执行一次。

这正是监听器链能组合的原因：每一环都能查看或改写下游所见，也可以直接终止事件。

</div>

<div class="arch-canvas">
  <iframe :src="embed('infernus-event-flow')" :style="{ aspectRatio: ratio['infernus-event-flow'] }" title="defineEvent 事件运行链路" loading="lazy" referrerpolicy="no-referrer"></iframe>
</div>

<ul class="diagram-links">
  <li><a :href="open('infernus-event-flow')" target="_blank" rel="noopener">打开交互版架构图</a></li>
  <li><a :href="spec('infernus-event-flow')" target="_blank" rel="noopener">查看架构图规格</a></li>
</ul>

<div class="arch-prose">

## core 与插件的端到端往返

把两半合起来看：一次原生回调从 open.mp 进入，经插件的 AMX→V8 转换进入 core 的中间件链，再经 `callNative` 与 `InvokeNativeArray` 走出去。

时间线上半段是插件启动，包括 bootstrap 脚本究竟做了什么；下半段是稳态下的往返。这张图建议放在上面两张之后读——它是两者的接缝。

</div>

<div class="arch-canvas">
  <iframe :src="embed('infernus-core-sampnode-bridge')" :style="{ aspectRatio: ratio['infernus-core-sampnode-bridge'] }" title="core 与 samp-node 的双向桥接" loading="lazy" referrerpolicy="no-referrer"></iframe>
</div>

<ul class="diagram-links">
  <li><a :href="open('infernus-core-sampnode-bridge')" target="_blank" rel="noopener">打开交互版架构图</a></li>
  <li><a :href="spec('infernus-core-sampnode-bridge')" target="_blank" rel="noopener">查看架构图规格</a></li>
</ul>

<style>
.arch-prose {
  max-width: 760px;
}

/* 图表成品是自包含的查看器，因此以画框嵌入而非内联。窄屏下保留可读的
   最小宽度，由图框横向滚动，避免把整图缩小到看不清。 */
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

/* .vp-doc li + li 会给第二个链接加上上外边距，导致两个链接不在同一行，
   这里用同级特异性复位。 */
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
