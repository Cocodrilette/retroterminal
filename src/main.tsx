import './index.css'

import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, useRoutes } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import routes from '~react-pages'

import AppLayout from './layout/app.layout'

const components = {
  // Add custom components here if needed
}

function App() {
  const element = useRoutes(routes)

  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <MDXProvider components={components}>
        <AppLayout>
          {element}
        </AppLayout>
      </MDXProvider>
    </Suspense>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)