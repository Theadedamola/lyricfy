import { Music, PenToolIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './ui/Button'

const Navbar = () => {
  return (
    <nav className="fixed w-full z-50 top-8 px-6">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 bg-white border rounded-full border-gray-100 shadow-[0px_4px_40px_rgba(0,0,0,0.08)]">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center gap-2">
              <Music className="w-6 h-6" />
              <span className="font-bold text-xl">Lyricfy</span>
            </Link>
          </div>
          <div className="flex items-center">
            <Link to="/dashboard" className="">
              <Button className="gap-2">
                <PenToolIcon className="w-4 h-4" />
                <span className="text-sm">Create</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
export default Navbar
