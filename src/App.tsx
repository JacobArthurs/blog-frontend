import { BrowserRouter, useRoutes } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import { routes } from './routes'

function AppRoutes() {
  return useRoutes(routes)
}

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </BrowserRouter>
  )
}

export default App
