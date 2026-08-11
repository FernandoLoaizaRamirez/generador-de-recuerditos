# Generador de Recuerditos

App web para crear **caballetes de mesa** —XV años, bodas y graduaciones—
listos para imprimir en **4×6 pulgadas a 300 DPI**. Se elige una plantilla, se
suben y encuadran las fotos, se escriben los textos y se exporta un PNG, JPG o
PDF de imprenta.

**Sin backend: las fotos nunca salen del dispositivo.** Todo vive en el
navegador (IndexedDB).

## El formato: caballete plegable

Las 21 plantillas comparten el mismo formato, y no es negociable: **hoja
vertical de 1200×1800 px (4×6" a 300 DPI) que se dobla por la mitad**, en
y=900, y se para en ⋀.

```
  MITAD SUPERIOR (0..900)     escena decorativa + 2 fotos enmarcadas + lettering
  ── doblez ──────────────
  MITAD INFERIOR (900..1800)  tarjeta: retrato a la izquierda, textos a la derecha
```

**La mitad de arriba se imprime girada 180°**, para que al doblar la hoja las
dos caras queden derechas. Ese giro lo aplica el motor **solo al exportar**
(`fold` → `partitionByFold` + `FoldGroup`): en el editor y en la galería
las dos mitades se ven al derecho, que es como hace falta para encuadrar.

Una comprobación en `src/templates/index.ts` avisa en consola, solo en
desarrollo, si alguna plantilla se sale del formato.

## Catálogo

21 plantillas en 3 categorías: **XV Años** (15), **Boda** (3) y
**Graduación** (3). La galería las agrupa según `CATEGORIES`
(`src/templates/index.ts`), donde vive el rótulo y el orden de las secciones.

## Stack

| | |
|---|---|
| Base | Vite · React · TypeScript |
| Lienzo y export | Konva / react-konva · jsPDF |
| Estado del editor | Zustand (con deshacer/rehacer) |
| Guardado local | Dexie sobre IndexedDB |
| UI | Tailwind CSS v4 |
| Distribución | PWA (vite-plugin-pwa) · hash router |

Tipografías (Google Fonts): Great Vibes, Playfair Display, Orbitron,
JetBrains Mono y Space Grotesk.

## Comandos

```bash
npm install
npm run dev       # servidor de desarrollo
npm run build     # type-check + build de producción a /dist
npm run preview   # previsualizar el build
npm run lint
npm run format
```

## Arquitectura

El principio del que cuelga todo:

> **Plantilla = layout declarativo. Proyecto = contenido del usuario.**

- `TemplateDef` (`src/types/template.ts`) dice **dónde** va todo: lienzo,
  fondo, `underlays`, `photoSlots`, `overlays`, `textFields` y `fold`.
- `Project` (`src/types/project.ts`) guarda solo **qué** puso el usuario: por
  hueco un id de imagen y su encuadre; por campo, su texto.

```
src/
  types/       esquemas TemplateDef y Project
  templates/   registro del catálogo + la fábrica `_caballete`
  lib/         geometría de fotos, texto, doblez, export, IndexedDB
  components/  lienzos de Konva (editor, export, vista previa)
  store/       estado del editor (Zustand)
  pages/       galería, vista previa, editor, perfil
```

Editor, exportador y miniatura comparten las mismas funciones de geometría
(`slotImageLayout`, `fitFontSize`, `slotClip`, `textStyleProps`), que es lo
que hace que lo impreso coincida con lo que se ve en pantalla.

### La fábrica de caballetes

Como las 21 comparten estructura, el layout se define **una sola vez** en
`src/templates/_caballete.ts`. Cada plantilla declara solo su identidad:

```ts
export const corazonesRosados = caballete({
  id: 'corazones-rosados',
  name: 'Corazones Rosados',
  category: 'xv',
  kind: 'xv',
  premium: true,
  nameColor: '#c8a04a',
  ink: '#6f6252',
  inkSoft: '#8a7355',
  business: '#9a7434',
})
```

Devuelve un `TemplateDef` normal: el editor y el exportador no saben que la
fábrica existe. 18 plantillas la usan; 3 tienen definición propia por llevar
assets fotorrealistas o composición a medida.

`premium: true` engancha tres capas de adorno más: molduras biseladas con
relieve, decoración que monta sobre los marcos y adornos sobre la tarjeta.

## Añadir una plantilla

**Con la fábrica** (lo habitual): añade su paleta y motivo a `TEMPLATES` en
`scripts/build-caballete-assets.mjs`, ejecuta el generador, y crea el `.ts`
con una llamada a `caballete()`. Registra el módulo en `src/templates/index.ts`.

```bash
node scripts/build-caballete-assets.mjs mi-plantilla
```

El generador emite los assets por mitades a partir de la paleta, así que la
plantilla conserva su identidad visual sin dibujar nada a mano.

**Con assets propios**: sáltate el generador y escribe el `TemplateDef`
directamente. Guía completa para assets fotorrealistas —incluidos los prompts
de IA y cómo medir las aberturas de un marco por su canal alfa— en
[`docs/plantillas-fotorrealistas.md`](docs/plantillas-fotorrealistas.md).

Otros scripts:

- `analyze-alpha-windows.mjs` — mide las aberturas transparentes de un PNG de
  marco, para colocar los huecos sin adivinar coordenadas.
- `compose-preview.mjs` — compositor offline: arma el layout y escribe un PNG
  sin abrir el navegador.

### Formas de hueco

`clipShape` acepta `'rect'`, `'rounded'` (con `cornerRadius`) y `'custom'`.
Con `'custom'`, `clipPath` es un path de SVG en coordenadas locales del hueco,
así que una ventana en arco es una línea:

```ts
clipShape: 'custom',
clipPath: 'M0,655 L0,200 A200,200 0 0 1 400,200 L400,655 Z',
```

## Exportación

PNG y JPG a resolución de impresión, y PDF con página en pulgadas exactas.
Sangrado de 0.125"/lado y marcas de corte opcionales. Antes de exportar avisa
si alguna foto bajaría de 150 DPI efectivos.

El editor trabaja con una copia reducida de cada foto para ir fluido; al
exportar recupera los **originales** de IndexedDB.

## Caché y PWA

Solo se precarga el armazón de la app. Las plantillas se piden **a la red
primero**, con la caché de respaldo a los 3 segundos: así un rediseño se ve al
recargar, sin tener que cerrar pestañas. La contrapartida asumida es que una
plantilla nunca abierta no está disponible sin internet.

## Despliegue

Build estático en `/dist`. GitHub Actions publica en Pages en cada push a
`main`. La ruta base se resuelve en build: `/` en Vercel y en desarrollo,
`/generador-de-recuerditos/` en Pages.
