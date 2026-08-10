import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
// En GitHub Pages la app se sirve en una subruta (/generador-de-recuerditos/);
// en Vercel y en desarrollo se sirve en la raíz (/).
export default defineConfig(({ command }) => ({
  base: process.env.VERCEL
    ? '/'
    : command === 'build'
      ? '/generador-de-recuerditos/'
      : '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon.svg'],
      manifest: {
        name: 'Generador de Recuerditos',
        short_name: 'Recuerditos',
        description: 'Caballetes de XV años listos para imprimir (4×6")',
        lang: 'es',
        theme_color: '#c8a04a',
        background_color: '#fbe4ea',
        display: 'standalone',
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // Solo el ARMAZÓN de la app va precargado. Antes entraban también los
        // SVG de las plantillas: 161 entradas y 2 MB en la primera visita, y
        // sobre todo, cada publicación dejaba obsoleta esa caché entera y los
        // cambios tardaban en verse. La app se usa siempre con conexión, así
        // que no compensa.
        globPatterns: ['**/*.{js,css,html,woff2}'],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Las plantillas se piden a la RED primero, así un rediseño se ve
            // al recargar. La caché queda de respaldo por si la red falla o
            // tarda, para no dejar la galería en blanco.
            urlPattern: /\/templates\/.*\.(?:svg|png|webp|jpe?g)$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'plantillas',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 400,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
}))
