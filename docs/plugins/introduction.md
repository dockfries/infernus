# Plugins

## Necessary work

::: warning
You must place `samp-node` after other plugins in `pawn.legacy_plugins` to ensure that other plugins are loaded first.
:::

If you need to use legacy plugins, you must place the plugin's `dll/so` file in the `plugins` folder, configure it in the `config.json` file under `pawn.legacy_plugins`, and include the `.inc` files of these plugins through `pawno/qawno`. Then, modify `pawn.main_scripts` to point to the `.amx` file you compiled.

Due to the various possible combinations of plugins, `infernus-starter` only includes common versions without `raknet` and versions with `raknet`.

If you are not able to use the plugins correctly, you will usually receive error messages similar to the following during server startup, and some plugins may have runtime issues:

```
[Error] Function not registered: CA_DestroyObject
[Error] File or function is not found
```

## Wrapper development

For the implementation of wrappers, please refer to the relevant code of `infernus` and the `samp-node` `wiki`.

Due to the underlying implementation of plugins or `samp-node` or `sampgdk` or `omp`, you may not be able to directly call `native` functions of `plugins/omp components` using `samp-node`, or directly register callback functions.

For example, `raknet` cannot be called directly, so `infernus` took a detour and implemented the call through a `polyfill`.

If you encounter similar issues when developing wrappers, you may need to refer to the `polyfill` implementation for `raknet` to work around the problem, unless someday in the future `samp-node` and other ecosystems become fully compatible with `omp`.
