# 插件

## 准备工作

::: warning
必须在 `pawn.legacy_plugins` 中将 `samp-node` 放在其他插件之后，以确保其他插件优先加载。
:::

如需使用传统插件，需将插件的 `dll/so` 放入 `plugins` 文件夹，在 `config.json` 的 `pawn.legacy_plugins` 中配置，通过 `pawno/qawno` 引入这些插件的 `.inc` 文件，然后将 `pawn.main_scripts` 指向您编译的 `.amx` 文件。

由于插件组合方式繁多，`infernus-starter` 仅提供了无 `raknet` 和带 `raknet` 两种常见版本。

如果插件未能正确使用，服务器启动时通常会显示类似以下的错误信息，部分插件也可能在运行时出现问题：

```
[Error] Function not registered: CA_DestroyObject
[Error] File or function is not found
```

## 封装开发

有关封装的实现，请参考 `infernus` 的相关代码和 `samp-node` 的 wiki。

由于插件、`samp-node`、`sampgdk` 或 `omp` 的底层实现限制，您可能无法直接使用 `samp-node` 调用插件/`omp` 组件的 native 函数，也无法直接注册回调函数。

例如，`raknet` 无法被直接调用，因此 `infernus` 另辟蹊径，通过 `polyfill` 实现了对其的调用。

自 `@infernus/raknet@0.14.0+` 起，已提供**无 polyfill 版本**，详情请参阅[生态系统](/zh-Hans/ecosystem)页面。

如果您在开发封装时遇到类似问题，可能需要参考 `raknet` 的 `polyfill` 实现来绕过限制——除非未来某天 `samp-node` 和其他生态能完全兼容 `omp`。
