import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Home } from '../pages/Home'
import { Community } from '../pages/Community'
import LandingPage from '../pages/LandingPage'
import LyricfyApp from '../pages'
import Auth from '../pages/Auth'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LyricfyApp />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: '/auth',
        element: <Auth />,
      },
      {
        path: '/dashboard',
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: 'community',
            element: <Community />,
          },
        ],
      },
    ],
  },
])
