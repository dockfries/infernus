# Complementos

## Requisitos previos

::: warning
Debe colocar `samp-node` después de otros complementos en `pawn.legacy_plugins` para asegurarse de que los demás se carguen primero.
:::

Para usar complementos heredados, coloque sus archivos `dll/so` en la carpeta `plugins`, configúrelos en `pawn.legacy_plugins` dentro de `config.json`, incluya sus archivos `.inc` mediante `pawno/qawno` y establezca `pawn.main_scripts` para que apunte al archivo `.amx` compilado.

Dadas las numerosas combinaciones posibles de complementos, `infernus-starter` solo proporciona dos variantes: sin `raknet` y con `raknet`.

Si los complementos no están configurados correctamente, durante el inicio del servidor verá errores similares a los siguientes (o pueden aparecer problemas en tiempo de ejecución):

```
[Error] Function not registered: CA_DestroyObject
[Error] File or function is not found
```

## Desarrollo de envoltorios

Para la implementación de envoltorios, consulte el código fuente de `infernus` y la wiki de `samp-node`.

Debido a la implementación subyacente de los complementos, `samp-node`, `sampgdk` u `omp`, es posible que no pueda llamar directamente a las funciones nativas de los complementos o componentes mediante `samp-node`, ni registrar retrollamadas directamente.

~~Por ejemplo, `raknet` no se puede llamar directamente, por lo que `infernus` da un rodeo implementando las llamadas a través de un `polyfill`.~~

~~Si encuentra problemas similares al desarrollar envoltorios, puede ser necesario seguir el enfoque de `polyfill` usado para `raknet` como solución alternativa — a menos que `samp-node` y los ecosistemas relacionados logren compatibilidad total con `omp` en el futuro.~~

En la práctica, para los complementos incompatibles, básicamente reescribimos sus envoltorios para que sean compatibles con el mecanismo de llamadas basado en `fakeamx` que subyace a `sampgdk`.

### Sampgdk Index Mismatch

Al usar varios complementos heredados, es posible que encuentre el error `Sampgdk Index Mismatch`: diferentes complementos pueden incluir diferentes versiones de `sampgdk`, mientras que nosotros usamos una versión modificada de `sampgdk`. En otras palabras, cualquier complemento heredado que dependa de `sampgdk` debe usar la misma versión de `sampgdk`; de lo contrario, se producirán conflictos de índice al cargar.

Actualmente, las bibliotecas comunes de nuestro ecosistema que dependen de `sampgdk` son `samp-node`, `streamer` y `omp-cef`, todas construidas con nuestra versión más reciente de `sampgdk` modificada; por lo tanto, no mezcle las versiones de los autores originales. El código fuente de nuestro fork de `sampgdk` está disponible en [sampgdk-backup](https://github.com/dockfries/sampgdk-backup).
