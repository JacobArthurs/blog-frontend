import { BrowserRouter, useRoutes } from 'react-router-dom'
import { Toaster } from 'sonner'
import MainLayout from './components/layout/MainLayout'
import { routes } from './routes'
import { ThemeProvider } from './contexts/theme'

function AppRoutes() {
  return useRoutes(routes)
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
