# Complementos

## Trabajo necesario

::: warning
Debes colocar `samp-node` después de otros plugins en `pawn.legacy_plugins` para asegurarte de que otros plugins se cargan primero.
:::

Si necesita utilizar plugins heredados, debe colocar el archivo `dll/so` del plugin en la carpeta `plugins`, configurarlo en el archivo `config.json` bajo `pawn.legacy_plugins`, e incluir los archivos `.inc` de estos plugins a través de `pawno/qawno`. A continuación, modifica `pawn.main_scripts` para que apunte al archivo `.amx` que has compilado.

Debido a las diversas combinaciones posibles de plugins, `infernus-starter` sólo incluye versiones comunes sin `raknet` y versiones con `raknet`.

Si no puede utilizar los plugins correctamente, normalmente recibirá mensajes de error similares a los siguientes durante el arranque del servidor, y algunos plugins pueden tener problemas de ejecución:

```
[Error] Function not registered: CA_DestroyObject
[Error] File or function is not found
```

## Desarrollo de envolturas

Para la implementación de wrappers, por favor consulta el código relevante de `infernus` y la `wiki` de `samp-node`.

Debido a la implementación subyacente de plugins o `samp-node` o `sampgdk` o `omp`, es posible que no puedas llamar directamente a funciones `nativas` de `plugins/omp components` usando `samp-node`, o registrar directamente funciones de callback.

Por ejemplo, `raknet` no se puede llamar directamente, por lo que `infernus` tomó un desvío e implementó la llamada a través de un `polyfill`.

Si te encuentras con problemas similares al desarrollar envoltorios, puede que tengas que referirte a la implementación `polyfill` para `raknet` para solucionar el problema, a menos que algún día en el futuro `samp-node` y otros ecosistemas sean totalmente compatibles con `omp`.
