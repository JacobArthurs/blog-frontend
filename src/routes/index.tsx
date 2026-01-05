import HomePage from '../pages/Home'
import PostPage from '../pages/Post'
import TagPage from '../pages/Tag'
import NotFoundPage from '../pages/NotFound'
import ErrorPage from '../pages/Error'

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
    path: '/error',
    element: <ErrorPage />
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]
