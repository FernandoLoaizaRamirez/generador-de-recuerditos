# Generador de Recuerditos

App web para crear **caballetes / recuerdos de mesa de XV años** listos para
imprimir en **4×6 pulgadas**. El usuario elige una plantilla, sube y encuadra
fotos (recorte + zoom + paneo), edita los textos y exporta un PNG/PDF de alta
resolución. Frontend puro, sin backend: las fotos nunca salen del dispositivo.

> Planeación completa del producto y la arquitectura en
> `C:\Users\megag\.claude\plans\rol-act-a-como-un-snoopy-teapot.md`.

## Stack

- **Vite + React + TypeScript** — base de la app.
- **Tailwind CSS v4** — UI responsiva (PC / tablet).
- **Prettier + ESLint** — formato y linting.

_Por fase posterior:_ Konva.js (lienzo y export 300 DPI), Zustand (estado),
Dexie/IndexedDB (guardado local), jsPDF (PDF), Web Workers (fotos pesadas), PWA.

## Scripts

```bash
npm install       # instalar dependencias
npm run dev       # servidor de desarrollo (HMR)
npm run build     # type-check + build de producción a /dist
npm run preview   # previsualizar el build
npm run lint      # ESLint
npm run format    # formatear con Prettier
```

## Estructura

```
src/
  types/       # esquemas TemplateDef (plantilla) y Project (contenido)
  templates/   # registro declarativo de plantillas (vacío en Fase 0)
  lib/         # constantes (medidas de impresión, DPI)
  App.tsx      # shell de la app
```

Arquitectura clave: **plantilla = layout declarativo + proyecto = contenido**.
Agregar una plantilla nueva = un `TemplateDef` + sus assets, sin tocar el motor.

## Roadmap

- **Fase 0 — Fundaciones** ✅ andamiaje, Tailwind, Prettier, esquema `TemplateDef`.
- **Fase 1** — galería + render de la 1ª plantilla («Mariposas Doradas») en lienzo.
- **Fase 2** — carga/recorte/zoom/paneo de fotos, texto dinámico, guardado local.
- **Fase 3** — exportación PNG/PDF 300 DPI, sangrado/marcas de corte, PWA, pulido.

## Despliegue

Build estático en `/dist`, desplegable en Vercel / Netlify / Cloudflare Pages /
GitHub Pages (conectar el repo al proveedor para CD).
