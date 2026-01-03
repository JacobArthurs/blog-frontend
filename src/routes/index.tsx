import HomePage from 'pages/Home'
import PostListPage from 'pages/PostList'
import PostPage from 'pages/Post'
import TagPage from 'pages/TagPage'
import AboutPage from 'pages/About'
import NotFoundPage from 'pages/NotFound'
import ErrorPage from 'pages/Error'

export const routes = [
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/posts',
    element: <PostListPage />
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
    path: '/about',
    element: <AboutPage />
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
