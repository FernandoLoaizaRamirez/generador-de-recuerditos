# Guía: crear plantillas fotorrealistas (tipo «Deluxe Valentina»)

Cómo agregar una plantilla con **imágenes PNG realistas** (fondos, marcos de
oro, tarjetas), a diferencia de las plantillas **SVG vectoriales**. Es más
laboriosa pero se ve como una foto de producto real.

El ejemplo de referencia es `deluxe-valentina` (un caballete que se dobla en 2
mitades). Los pasos sirven igual para una plantilla de una sola cara.

---

## 0. ¿PNG o SVG?

| | SVG (vectorial) | PNG (fotorrealista) |
|---|---|---|
| Aspecto | Limpio, plano, nítido | Realista (mármol, oro con textura, flores) |
| Peso | KB | ~1 MB por imagen |
| Cómo se crea | Se dibuja a mano / con código | Se **genera con IA** (tú) y se integra |
| Cuándo usar | La mayoría de plantillas | Cuando el cliente quiere lujo/realismo |

> Los PNG grandes **no** entran en la precache de la PWA (solo js/css/svg/html),
> pero se sirven normal desde `public/`.

---

## 1. Genera los assets con IA

Claude **no** genera imágenes; las creas tú (Midjourney, DAL·E, etc.) y las
integramos. Reglas clave para que encajen en el motor:

- **Lienzo 2:3 vertical**, pensando en 1200×1800 px (o por mitad, ~1200×900).
- **Separa por capas / por mitad.** No metas todo en una sola imagen. Para un
  caballete plegable genera, por ejemplo:
  - `FondoArriba.png` — solo el fondo de la mitad superior.
  - `MarcoArriba.png` — los marcos + adornos, **con fondo transparente** y las
    aberturas de foto **también transparentes** (esto es lo que permite alinear
    las fotos por detrás; ver paso 3).
  - `TarjetaAbajo.png` — la tarjeta de la mitad inferior.
- **Transparencia obligatoria** en los marcos/adornos que van *encima* de las
  fotos: exporta PNG con canal alfa (colorType 6). Sin alfa, no hay ventanas.
- **Evita texto "quemado".** Si la IA hornea texto de relleno en la imagen (muy
  común en tarjetas), tápalo después con una placa (paso 5). Mejor aún: pide la
  tarjeta **sin texto**.

### Ejemplos de prompt (traducidos a inglés al usarlos)
- Fondo: *"soft romantic pink floral bokeh background, blurred roses, elegant,
  vertical 2:3, no text"*.
- Marco: *"two ornate polished gold photo frames tilted slightly, pink
  butterflies, pearls, on a transparent background, the inside of each frame
  fully transparent (cut-out), PNG with alpha, no text"*.
- Tarjeta: *"elegant white card with a rounded gold ornamental border and
  watercolor roses, vertical, empty center, no text"*.

---

## 2. Copia los assets con nombres limpios

Crea `public/templates/<id>/` y copia los PNG con nombres cortos y estables
(sin espacios ni acentos). Ej.: `FondoArriba.png`, `MarcoArriba.png`,
`TarjetaAbajo.png`.

> Deja los archivos crudos con nombre largo **fuera** del commit (son
> duplicados que inflan el deploy). Commitea solo los que usa la plantilla.

---

## 3. Detecta las ventanas del marco (canal alfa)

Para que las fotos caigan **exactas** dentro de las aberturas del marco, no
adivines coordenadas: mídelas con el detector incluido.

```bash
node scripts/analyze-alpha-windows.mjs public/templates/<id>/MarcoArriba.png
```

Imprime cada abertura interior como **fracciones** del tamaño de la imagen:

```
Ventana 1: fx=0.148 fy=0.200 fw=0.287 fh=0.243
Ventana 2: fx=0.572 fy=0.580 fw=0.285 fh=0.237
```

Notas:
- Puede encontrar huecos pequeños extra (espacios entre adornos). Quédate con
  las aberturas reales, o filtra subiendo el área mínima:
  `node scripts/analyze-alpha-windows.mjs <png> 40 0.035`.
- Las fracciones son independientes de la resolución: se multiplican por el
  tamaño de la **mitad** donde va el marco (ej. 1200×900), no por todo el lienzo.

---

## 4. Escribe la definición de la plantilla

Copia el patrón de [`src/templates/deluxe-valentina.ts`](../src/templates/deluxe-valentina.ts).
Piezas clave del esquema ([`src/types/template.ts`](../src/types/template.ts)):

- **`background`** — fondo de todo el lienzo (un `base.svg` sólido sirve).
- **`underlays`** — imágenes DEBAJO de las fotos: aquí van `FondoArriba` (mitad
  superior) y `TarjetaAbajo` (inferior), posicionadas con `{src,x,y,width,height}`.
- **`photoSlots`** — los huecos. Convierte cada ventana detectada:
  ```ts
  // ventana fx,fy,fw,fh sobre la mitad superior (1200×900); pad agranda un
  // poco para que la foto quede por debajo del filo del marco.
  const win = (fx,fy,fw,fh,pad) => ({
    x: Math.round(fx*1200 - pad), y: Math.round(fy*900 - pad),
    width: Math.round(fw*1200 + 2*pad), height: Math.round(fh*900 + 2*pad),
  })
  ```
  Usa `frameStyle: 'none'` (el marco ya viene en el PNG) y `clipShape:'rounded'`.
- **`overlays`** — imágenes ENCIMA de las fotos: `MarcoArriba` (para que el oro
  tape los filos de la foto) y la placa de texto (paso 5).
- **`textFields`** — nombre/mensaje/negocio/teléfono, colocados sobre la placa.

### Si es un caballete plegable
Añade `fold: { atY: 900 }`. Los elementos con `y < 900` (mitad superior) se
rotan 180° **solo al exportar** (para que, al doblar la hoja, esa mitad quede
al derecho del otro lado). En el editor y la galería se ven al derecho. No
tienes que hacer nada más: el motor ([`ExportStage`](../src/components/ExportStage.tsx),
[`FoldGroup`](../src/components/canvas/FoldGroup.tsx), [`partitionByFold`](../src/lib/fold.ts))
lo aplica según `fold`.

---

## 5. Tapa el texto "quemado" con una placa

Si el PNG de la tarjeta trae texto de relleno horneado, mide dónde está y
cúbrelo con una **placa** (un `parche.svg`: panel redondeado cálido con sombra
suave) puesta como `overlay`. Sirve además de fondo legible para tus textos.

Para medir el texto y los bordes reales (hasta dónde llega el texto, dónde
empieza el marco dorado) usa un análisis de píxeles puntual — mira el commit de
Deluxe Valentina o pídeselo a Claude. La placa se dimensiona para cubrir todo
el texto **sin** tapar el marco ni los adornos.

---

## 6. Verifica el layout SIN navegador

Konva/Chrome fallan seguido con canvas pesado. La forma más confiable es el
**compositor offline**: decodifica los PNG reales, arma el layout, aplica el
giro 180° de la mitad superior y escribe un PNG que puedes abrir para verlo.

1. Edita la sección `COMPOSICIÓN` de [`scripts/compose-preview.mjs`](../scripts/compose-preview.mjs)
   con las rutas y rects de tu plantilla (los huecos se pintan como bloques de
   color para comprobar que caen dentro de las aberturas del marco).
2. Ejecuta:
   ```bash
   node scripts/compose-preview.mjs preview.png
   ```
3. Abre `preview.png`. Ajusta coordenadas y repite hasta que:
   - las fotos caigan dentro de los marcos,
   - la placa cubra todo el texto quemado sin tapar adornos,
   - los textos queden centrados sobre la placa.

---

## 7. Registra y despliega

1. Añade la plantilla a [`src/templates/index.ts`](../src/templates/index.ts)
   (import + al arreglo `templates`).
2. `npm run lint` y `npm run build` (deben pasar).
3. Commit **solo** del `.ts` + los assets que usa (no los PNG crudos con nombre
   largo). Push a `main` → GitHub Actions despliega a Pages.
4. Verifica en vivo que los assets sirvan 200:
   `https://<usuario>.github.io/<repo>/templates/<id>/<asset>.png`

> Si el deploy de Pages falla con "queued/try again later", suele ser un hipo
> transitorio de GitHub Pages (revisa githubstatus.com → Pages). Relánzalo:
> pestaña *Actions* → *Run workflow*, o con el siguiente push.

---

## Checklist rápida

- [ ] Assets 2:3, separados por capa/mitad, marcos con alfa y aberturas transparentes.
- [ ] Copiados a `public/templates/<id>/` con nombres limpios.
- [ ] Ventanas medidas con `analyze-alpha-windows.mjs`.
- [ ] `TemplateDef` con background + underlays + overlays + photoSlots + textFields (+ `fold` si dobla).
- [ ] Texto quemado tapado con placa; textos sobre la placa.
- [ ] Verificado con `compose-preview.mjs`.
- [ ] Registrada en `index.ts`; `lint` + `build` OK.
- [ ] Commit de `.ts` + assets usados; push; assets 200 en vivo.
