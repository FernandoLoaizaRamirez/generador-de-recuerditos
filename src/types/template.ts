/**
 * Esquema declarativo de una PLANTILLA (layout de solo lectura).
 *
 * Principio de arquitectura: plantilla = layout + proyecto = contenido.
 * Agregar una plantilla nueva debe requerir solo un `TemplateDef` + sus
 * assets, sin tocar el motor del editor ni el exportador (RNF-08).
 *
 * Todas las coordenadas y tamaños están en píxeles del sistema de
 * coordenadas de la plantilla (lienzo a 300 DPI, ver `src/lib/print.ts`).
 */

/** Ruta a un asset de imagen (relativa a /public o URL importada por Vite). */
export type AssetRef = string

/** Adorno posicionado (para elementos que no ocupan todo el lienzo). */
export interface PositionedOverlay {
  src: AssetRef
  /** Por defecto 0. */
  x?: number
  y?: number
  /** Por defecto = ancho/alto del lienzo (adorno a pantalla completa). */
  width?: number
  height?: number
}

/**
 * Capa de adorno: una ruta simple (se dibuja a lienzo completo) o un objeto
 * posicionado (`overlayUrl` a medida, p. ej. un divisor horizontal).
 */
export type OverlayLayer = AssetRef | PositionedOverlay

/** Forma del recorte aplicado a la foto dentro de un hueco. */
export type ClipShape = 'rect' | 'rounded' | 'custom'

/**
 * Estilo del marco dibujado alrededor de un hueco cuando no se usa un
 * `frameOverlay` (asset). El editor lo dibuja de forma vectorial.
 */
export type FrameStyle = 'goldOrnate' | 'thin' | 'silver' | 'none'

/**
 * Rol semántico de un campo de texto. Permite autocompletado desde el
 * Perfil del negocio y tratar la marca como contenido bloqueado.
 */
export type TextRole =
  | 'quinceaneraName'
  | 'message'
  | 'businessName'
  | 'phone'
  | 'custom'

/** Alineación horizontal del texto. */
export type TextAlign = 'left' | 'center' | 'right'

/**
 * Gradiente metálico del texto (oro/plata/etc.). `colorStops` sigue el
 * formato de `createLinearGradient`: [offset, color, offset, color, ...].
 */
export interface TextGradient {
  colorStops: (number | string)[]
  /** Dirección del barrido. Por defecto 'vertical' (sheen metálico). */
  angle?: 'vertical' | 'horizontal'
}

/** Borde del texto (ctx.strokeStyle + ctx.lineWidth). */
export interface TextStroke {
  color: string
  width: number
}

/** Sombra proyectada del texto (ctx.shadow*). */
export interface TextShadow {
  color: string
  blur: number
  offsetX?: number
  offsetY?: number
}

/** Caja posicionada en el lienzo. */
export interface Box {
  x: number
  y: number
  width: number
  height: number
  /** Rotación en grados (sentido horario). Por defecto 0. */
  rotation?: number
}

/** Hueco donde el usuario coloca y encuadra una foto (recorte + zoom + paneo). */
export interface PhotoSlot extends Box {
  id: string
  clipShape: ClipShape
  /** Radio de esquina en px cuando `clipShape === 'rounded'`. */
  cornerRadius?: number
  /** Path SVG del recorte cuando `clipShape === 'custom'`. */
  clipPath?: string
  /** Marco/adorno (asset) dibujado ENCIMA de la foto. Tiene prioridad sobre `frameStyle`. */
  frameOverlay?: AssetRef
  /** Marco vectorial dibujado por el editor cuando no hay `frameOverlay`. */
  frameStyle?: FrameStyle
  /** Ajuste inicial de la foto al entrar al hueco. */
  defaultFit: 'cover' | 'contain'
}

/** Campo de texto editable de la plantilla. */
export interface TextField {
  id: string
  x: number
  y: number
  width: number
  align: TextAlign
  fontFamily: string
  fontSize: number
  /** Estilo tipográfico para Konva ('normal', 'italic', 'bold', 'italic bold'). */
  fontStyle?: string
  /** Color en formato CSS (hex/rgb). */
  color: string
  /** Máximo de líneas antes de encoger el texto para que no se desborde. */
  maxLines: number
  /** Rol semántico (autocompletado / bloqueo de marca). */
  role?: TextRole
  /** Si es `true`, el usuario no puede mover/alterar el layout (p. ej. marca). */
  locked?: boolean
  /** Texto guía cuando el campo está vacío. */
  placeholder: string
  /** Contenido de ejemplo para previsualizar la plantilla (galería / preview). */
  sample?: string
  /** Estilos deluxe: gradiente metálico del relleno. */
  gradient?: TextGradient
  /** Estilos deluxe: borde del texto. */
  stroke?: TextStroke
  /** Estilos deluxe: sombra proyectada. */
  shadow?: TextShadow
}

/** Dimensiones del lienzo de la plantilla (px a 300 DPI). */
export interface CanvasSpec {
  /** Ancho del área de corte (trim). Ej.: 1200 px = 4". */
  width: number
  /** Alto del área de corte (trim). Ej.: 1800 px = 6". */
  height: number
  /** Sangrado por lado en px (ej.: 38 px ≈ 0.125" @ 300 DPI). */
  bleedPx: number
  /** Margen interior de zona segura en px. */
  safePx: number
}

/** Definición declarativa completa de una plantilla. */
export interface TemplateDef {
  id: string
  name: string
  thumbnail: AssetRef
  /** Versión del esquema/plantilla para migraciones futuras. */
  version: number
  canvas: CanvasSpec
  /** Fondo a pantalla completa del lienzo. */
  background: AssetRef
  /**
   * Adornos dibujados DEBAJO de las fotos (entre el fondo y las fotos). Útil
   * para decoraciones que deben quedar en los márgenes sin tapar las fotos.
   */
  underlays?: OverlayLayer[]
  /** Adornos sobre las fotos, en orden de z (primero = más atrás). */
  overlays: OverlayLayer[]
  photoSlots: PhotoSlot[]
  textFields: TextField[]
}
