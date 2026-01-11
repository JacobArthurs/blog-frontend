import HomePage from '@/pages/public/Home'
import PostPage from '@/pages/public/Post'
import TagPage from '@/pages/public/Tag'
import NotFoundPage from '@/pages/public/NotFound'
import LoginPage from '@/pages/public/Login'
import AdminPostPage from '@/pages/admin/Post'
import AdminTagPage from '@/pages/admin/Tag'
import Admin from '@/pages/admin/Admin/Admin'

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
    element: <Admin />
  },
  {
    path: '/admin/post/:id?',
    element: <AdminPostPage />
  },
  {
    path: '/admin/tag/:id?',
    element: <AdminTagPage />
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]
