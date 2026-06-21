/**
 * Constantes de impresión. Fuente única de verdad para medidas y DPI.
 * Las plantillas se diseñan nativamente en estos píxeles (300 DPI).
 */

/** Puntos por pulgada para impresión fotográfica. */
export const DPI = 300

/** Convierte pulgadas a px a 300 DPI. */
export const inchToPx = (inches: number): number => Math.round(inches * DPI)

/**
 * Tamaño de impresión estándar del caballete: 4×6 pulgadas, vertical (2:3).
 * - trim   : área final tras el corte (1200×1800 px)
 * - bleed  : sangrado de 0.125" por lado (≈38 px) → 1276×1876 px con sangrado
 * - safe   : margen interior de zona segura para textos/elementos clave
 */
export const PRINT_4X6 = {
  widthIn: 4,
  heightIn: 6,
  widthPx: inchToPx(4), // 1200
  heightPx: inchToPx(6), // 1800
  bleedInPerSide: 0.125,
  bleedPxPerSide: inchToPx(0.125), // 38
  safeInPerSide: 0.125,
  safePxPerSide: inchToPx(0.125), // 38
} as const

/** Resolución mínima recomendada de una foto para no salir pixelada. */
export const MIN_PHOTO_DPI = 150
