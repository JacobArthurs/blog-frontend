import HomePage from '@/pages/public/Home'
import PostPage from '@/pages/public/Post'
import TagPage from '@/pages/public/Tag'
import NotFoundPage from '@/pages/public/NotFound'
import LoginPage from '@/pages/public/Login'
import AdminPostPage from '@/pages/admin/Post'
import AdminTagPage from '@/pages/admin/Tag'
import Admin from '@/pages/admin/Admin/Admin'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export const routes = [
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/post/:slug',
    element: <PostPage />
  },
  {
    path: '/tag/:slug',
    element: <TagPage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/post/:id?',
    element: (
      <ProtectedRoute>
        <AdminPostPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/tag/:id?',
    element: (
      <ProtectedRoute>
        <AdminTagPage />
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]
