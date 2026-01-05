import { BrowserRouter, useRoutes } from 'react-router-dom'
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
    </ThemeProvider>
  )
}

export default App
