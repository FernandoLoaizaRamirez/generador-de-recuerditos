import { caballete } from './_caballete'

/**
 * «Corona de Amatista» — caballete plegable, XV años.
 *
 * El registro de princesa es el que más se pide en el negocio y el catálogo no
 * lo decía con todas sus letras: había pasteles lilas, pero ninguna plantilla
 * con corona.
 *
 * Terciopelo de amatista, del violeta iluminado del centro al berenjena del
 * borde. Lo que la separa de las otras tres oscuras es el METAL: Noche
 * Estelar, Rojo Pasión y Glam Negro y Oro comparten el mismo oro amarillo
 * (#d4af52), así que otra oscura con ese acento habría sido un recoloreado.
 * Aquí es oro rosa, que sobre el morado no compite y además tiñe gratis las
 * perlas de las esquinas y los pétalos de los racimos.
 *
 * Ojo con las tintas: el panel de una plantilla oscura no es blanco, es bg[0]
 * aclarado un 13% (#6a4381). Las tres tintas están medidas contra ESE color.
 */
export const coronaAmatista = caballete({
  id: 'corona-amatista',
  name: 'Corona de Amatista',
  category: 'xv',
  kind: 'xv',
  premium: true,
  featured: true,
  version: 1,
  retratoFrame: 'none',
  displayFont: 'Playfair Display',
  nameColor: '#e5a894',
  nameGradient: [
    0,
    '#ffe6d8',
    0.22,
    '#f2c0a6',
    0.42,
    '#dd9c81',
    0.52,
    '#fff2e6',
    0.62,
    '#c67f66',
    0.8,
    '#9a5744',
    1,
    '#eeb99e',
  ],
  nameStroke: { color: '#5e2f26', width: 1.8 },
  ink: '#f3e7dd',
  inkSoft: '#e0cdd6',
  business: '#f2c7b0',
})
