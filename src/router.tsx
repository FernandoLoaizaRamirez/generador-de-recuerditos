import { createHashRouter } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { HomePage } from './pages/HomePage'
import { GalleryPage } from './pages/GalleryPage'
import { ProfilePage } from './pages/ProfilePage'
import { EditorPage, TemplatePreviewPage } from './lazyRoutes'

/**
 * Hash router: amigable con hosting estático y PWA (no requiere reescrituras
 * en el servidor). Layout AppShell + páginas anidadas. Las páginas con Konva
 * (vista previa y editor) se cargan diferidas (ver ./lazyRoutes).
 */
export const router = createHashRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'plantillas', element: <GalleryPage /> },
      { path: 'plantillas/:templateId', element: <TemplatePreviewPage /> },
      { path: 'editor/:projectId', element: <EditorPage /> },
      { path: 'perfil', element: <ProfilePage /> },
    ],
  },
])
