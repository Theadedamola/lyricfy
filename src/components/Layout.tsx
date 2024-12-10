import { Outlet, Link } from 'react-router-dom'
import { Music, PenToolIcon, Users } from 'lucide-react'
import Footer from './Footer'

export const Layout = () => {
  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center gap-2">
                <Music className="w-6 h-6" />
                <span className="font-bold text-xl">Lyricfy</span>
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                <PenToolIcon className="w-5 h-5" />
                <span>Create</span>
              </Link>
              <Link
                to="/dashboard/community"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                <Users className="w-5 h-5" />
                <span>Community</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
