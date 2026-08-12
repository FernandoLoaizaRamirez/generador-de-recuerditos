import { caballete } from './_caballete'

/**
 * «Otoño Terracota» — caballete plegable, XV años.
 *
 * De las quince plantillas de XV que había, ninguna era cálida de tierra: casi
 * todas rosas y pasteles, y las demás oscuras de gala. La terracota con pampa
 * es tendencia real en fiestas y no estaba cubierta.
 *
 * El acento va INVERTIDO respecto al resto del catálogo. Lo normal aquí es un
 * oro medio sobre un fondo claro, pero con un borde terracota el oro medio y
 * el fondo quedaban a Δlum 0.095 y las molduras desaparecían: el marco se
 * fundía con el fondo justo donde tenía que despegarse. Así que el acento es
 * oro viejo CLARO sobre ladrillo hondo, que da Δlum 0.376.
 *
 * Ésta sí lleva el script de la casa: unos XV boho piden caligrafía, y era la
 * única de la tanda nueva de XV que no se jugaba nada con ella.
 */
export const otonoTerracota = caballete({
  id: 'otono-terracota',
  name: 'Otoño Terracota',
  category: 'xv',
  kind: 'xv',
  premium: true,
  featured: true,
  version: 1,
  nameColor: '#b06437',
  nameGradient: [
    0,
    '#f7dcbe',
    0.2,
    '#dda06a',
    0.42,
    '#b96f3c',
    0.52,
    '#fff0d8',
    0.62,
    '#9c5227',
    0.8,
    '#6b3216',
    1,
    '#c98a52',
  ],
  nameStroke: { color: '#4d2310', width: 1.8 },
  ink: '#4f3326',
  inkSoft: '#8a6047',
  business: '#a05327',
})
