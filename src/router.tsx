import { createHashRouter } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { HomePage } from './pages/HomePage'
import { GalleryPage } from './pages/GalleryPage'
import { TemplatePreviewPage } from './pages/TemplatePreviewPage'

/**
 * Hash router: amigable con hosting estático y PWA (no requiere reescrituras
 * en el servidor). Layout AppShell + páginas anidadas.
 */
export const router = createHashRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'plantillas', element: <GalleryPage /> },
      { path: 'plantillas/:templateId', element: <TemplatePreviewPage /> },
    ],
  },
])
