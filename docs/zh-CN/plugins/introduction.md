# 插件

## 必要工作

::: warning
您必须在`pawn.legacy_plugins`把 `samp-node` 放到其他插件的后面，以确保其他插件先加载。
:::

如果您需要用到传统的插件，您必须像传统的原生开发那样，将插件的 `dll/so` 放入 `plugins` 文件夹，然后在`config.json`中配置`pawn.legacy_plugins`，并且通过 `pawno/qawno` 引入这些插件的`.inc` 文件，然后修改`pawn.main_scripts`为您编译的`.amx`文件。

由于插件有数种搭配可能性，所以`infernus-starter`只组合了常见的无 `raknet` 和带 `raknet` 的版本。

如果您没能以正确的方式使用插件，在服务器启动时通常你会收到类似的错误信息，也有一些插件是由于运行时的问题。

```
[Error] Function not registered: CA_DestroyObject
[Error] File or function is not found
```

## 包装开发

有关包装的实现请参考 `infernus` 的相关代码和 `samp-node` 的 `wiki`。

由于一些可能是插件或`samp-node`，或`sampgdk`，又或是`omp`的底层实现，您有可能无法直接使用 `samp-node` 调用到插件/`omp` 组件的`native`函数，也可能无法直接注册回调函数。

例如 `raknet`无法被直接调用，所以`infernus`绕了很大的弯路，通过`polyfill`来实现调用。

如果您开发包装遇到类似的问题，可能需要参考 `raknet` 的 `polyfill` 绕弯路来实现，除非未来的某一天 `samp-node`和其他生态可以完全兼容`omp`。
