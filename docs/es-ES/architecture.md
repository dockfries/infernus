---
title: Arquitectura
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

// La proporcion incluye el relleno interno de 8px del visor, de modo que el
// lienzo no queda recortado ni con bandas dentro del marco.
const ratio = {
  "infernus-architecture": "1362 / 507",
  "infernus-core-internals": "1372 / 559",
  "infernus-sampnode-internals": "1300 / 583",
  "infernus-event-flow": "1080 / 509",
  "infernus-core-sampnode-bridge": "1080 / 589",
};
</script>

<div class="arch-prose">

# Arquitectura

Estos cinco diagramas documentan el monorepo `@infernus/*` de fuera hacia dentro: el grafo de paquetes y lo que hace cada envoltorio; el interior de `@infernus/core`; el interior del plugin C++ `samp-node` que embebe Node.js; el recorrido de un evento por core; y por ultimo el viaje completo entre core y el plugin.

Cada diagrama es un artefacto autocontenido y sigue el idioma en el que estás leyendo la documentación. La vista incrustada es un lienzo estático: abre el enlace bajo cada diagrama para desplazar y ampliar, buscar y enfocar nodos, rastrear relaciones, cambiar el tema y exportar a PNG/SVG.

</div>

<div class="arch-prose">

## Monorepo y detalle de paquetes

Los 25 paquetes compilables en `packages/*`, más `types`, `shared`, el host de ejecución y la cadena de compilación. La columna de dependencias va de izquierda a derecha: un gamemode sobre `@infernus/core`, a través del plugin `samp-node`, hasta el servidor open.mp. Las cuatro regiones agrupan los paquetes por dominio y cada nodo indica una implementación concreta: el nativo que envuelve o el mecanismo que usa.

Los nombres de paquetes y de funciones nativas se mantienen en inglés; las etiquetas de región y las tarjetas resumen están escritas en el idioma de esta página.

</div>

<div class="arch-canvas">
  <iframe :src="embed('infernus-architecture')" :style="{ aspectRatio: ratio['infernus-architecture'] }" title="Monorepo Infernus y detalle de paquetes" loading="lazy" referrerpolicy="no-referrer"></iframe>
</div>

<ul class="diagram-links">
  <li><a :href="open('infernus-architecture')" target="_blank" rel="noopener">Abrir el diagrama interactivo</a></li>
  <li><a :href="spec('infernus-architecture')" target="_blank" rel="noopener">Ver la especificación del diagrama</a></li>
</ul>

<div class="arch-prose">

## Dentro de `@infernus/core`

Los subsistemas internos: `components` (entidades, el cargador `filterscript`, el despachador `CmdBus` y el ciclo de vida de `GameMode`), `utils` (el motor de eventos `bus.ts`, la interceptacion de `hook.ts` y los registros de entidades de `pools.ts`) y `wrapper` (los enlaces nativos tipados y las tablas `__inject__` intercambiables).

`internalPlayerProps` usa una clave `Symbol`, por eso un plugin puede extender `Player` sin chocar con los campos privados de core.

</div>

<div class="arch-canvas">
  <iframe :src="embed('infernus-core-internals')" :style="{ aspectRatio: ratio['infernus-core-internals'] }" title="Subsistemas internos de @infernus/core" loading="lazy" referrerpolicy="no-referrer"></iframe>
</div>

<ul class="diagram-links">
  <li><a :href="open('infernus-core-internals')" target="_blank" rel="noopener">Abrir el diagrama interactivo</a></li>
  <li><a :href="spec('infernus-core-internals')" target="_blank" rel="noopener">Ver la especificación del diagrama</a></li>
</ul>

<div class="arch-prose">

## Dentro del plugin `samp-node`

`@infernus/core` no es una libreria autonoma: cada llamada nativa y cada evento pasan por el plugin C++ `samp-node`, que embebe Node.js como libreria compartida (`libnode`) dentro del proceso del servidor. Este diagrama cubre ese plugin: sus exportaciones `PLUGIN_EXPORT` (`Load`/`Unload`, `OnPublicCall`, `AmxLoad`, `ProcessTick`), el runtime V8 y `uv_loop` aislados que crea `nodeimpl.cpp`, el bootstrap de `resource.cpp` y las capas de marshalling `events.cpp`, `natives.cpp` y `callbacks.cpp`.

Dos detalles explican casi todo lo que se observa en core. No hay un hilo Node aparte: `ProcessTick` impulsa `Tick` en el hilo principal del servidor en cada frame. Y como un listener puede devolver legitimamente una Promise, `handlePromiseReturnValue` gira en `Tick` hasta que esa promise se resuelve, que es lo que permite a core tratar un listener `async` como un retorno sincrono `0`/`1`.

</div>

<div class="arch-canvas">
  <iframe :src="embed('infernus-sampnode-internals')" :style="{ aspectRatio: ratio['infernus-sampnode-internals'] }" title="Arquitectura interna del plugin samp-node" loading="lazy" referrerpolicy="no-referrer"></iframe>
</div>

<ul class="diagram-links">
  <li><a :href="open('infernus-sampnode-internals')" target="_blank" rel="noopener">Abrir el diagrama interactivo</a></li>
  <li><a :href="spec('infernus-sampnode-internals')" target="_blank" rel="noopener">Ver la especificación del diagrama</a></li>
</ul>

<div class="arch-prose">

## Como se ejecuta `defineEvent`

La ruta de ejecución de todos los eventos, leída directamente de `packages/core/src/utils/bus.ts`. El registro es un efecto de importar el modulo: `defineEvent` llama a `samp.registerEvent` para declarar la firma del callback nativo y a `samp.on` para enganchar el `trigger`.

Despues `trigger` ejecuta la cadena de middleware: `beforeEach` convierte los argumentos nativos en un contexto, cada listener recibe `{ next, defaultValue, ...contexto }`, y `next(value)` avanza la cadena ademas de fusionar `value` en ese contexto compartido. Un listener que nunca llama a `next()` corta la propagacion, y su valor de retorno pasa a ser el resultado del evento tras normalizarlo `transformReturnValue` a `0` o `1`. `afterEach` se ejecuta una vez al final.

Eso es lo que permite componer cadenas: cualquier eslabon puede inspeccionar o reescribir lo que ven los siguientes, o detener el evento por completo.

</div>

<div class="arch-canvas">
  <iframe :src="embed('infernus-event-flow')" :style="{ aspectRatio: ratio['infernus-event-flow'] }" title="Ruta de ejecucion de defineEvent" loading="lazy" referrerpolicy="no-referrer"></iframe>
</div>

<ul class="diagram-links">
  <li><a :href="open('infernus-event-flow')" target="_blank" rel="noopener">Abrir el diagrama interactivo</a></li>
  <li><a :href="spec('infernus-event-flow')" target="_blank" rel="noopener">Ver la especificación del diagrama</a></li>
</ul>

<div class="arch-prose">

## core y el plugin, de extremo a extremo

Con las dos mitades juntas: un callback nativo que entra desde open.mp, pasa por la conversion AMX a V8 del plugin, llega a la cadena de middleware de core y vuelve a salir por `callNative` e `InvokeNativeArray`.

La mitad superior de la linea de tiempo es el arranque del plugin, incluido lo que hace realmente el script de bootstrap; la inferior es el viaje en estado estacionario. Conviene leer este diagrama despues de los dos anteriores: es la union entre ambos.

</div>

<div class="arch-canvas">
  <iframe :src="embed('infernus-core-sampnode-bridge')" :style="{ aspectRatio: ratio['infernus-core-sampnode-bridge'] }" title="Puente entre core y samp-node" loading="lazy" referrerpolicy="no-referrer"></iframe>
</div>

<ul class="diagram-links">
  <li><a :href="open('infernus-core-sampnode-bridge')" target="_blank" rel="noopener">Abrir el diagrama interactivo</a></li>
  <li><a :href="spec('infernus-core-sampnode-bridge')" target="_blank" rel="noopener">Ver la especificación del diagrama</a></li>
</ul>

<style>
.arch-prose {
  max-width: 760px;
}

/* Los artefactos son visores autocontenidos, por eso se enmarcan en lugar de
   incorporarse. Un ancho minimo legible mantiene las etiquetas de los nodos
   legibles en pantallas estrechas; el contenedor se desplaza en horizontal. */
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

/* `.vp-doc li + li` anade un margen superior que sacaria el segundo enlace de
   la fila, por eso se restablece con la misma especificidad. */
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
