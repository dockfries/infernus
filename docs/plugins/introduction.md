# Plugins

## Prerequisites

::: warning
You must place `samp-node` after other plugins in `pawn.legacy_plugins` to ensure other plugins load first.
:::

To use legacy plugins, place their `dll/so` files in the `plugins` folder, configure them under `pawn.legacy_plugins` in `config.json`, include their `.inc` files via `pawno/qawno`, and set `pawn.main_scripts` to point to your compiled `.amx` file.

Given the numerous possible plugin combinations, `infernus-starter` only provides two variants: without `raknet` and with `raknet`.

If plugins are not configured correctly, you will typically see errors like these during server startup (or encounter runtime issues):

```
[Error] Function not registered: CA_DestroyObject
[Error] File or function is not found
```

## Wrapper Development

For wrapper implementation, refer to the `infernus` source code and the `samp-node` wiki.

Due to the underlying implementation of plugins, `samp-node`, `sampgdk`, or `omp`, you may not be able to call plugin/component native functions directly via `samp-node`, or register callbacks directly.

For example, `raknet` cannot be called directly, so `infernus` takes a detour by implementing calls through a `polyfill`.

If you encounter similar issues when developing wrappers, you may need to follow the `polyfill` approach used for `raknet` as a workaround — unless `samp-node` and related ecosystems eventually achieve full OMP compatibility.
