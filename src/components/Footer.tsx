import { Link } from 'react-router-dom'
import { Music } from 'lucide-react' // Assuming you're using lucide-react for icons

const Footer = () => {
  return (
    <footer className="py-20 flex flex-col items-center justify-center p-4 bg-white text-black">
      {/* Logo Section */}
      <div className="flex items-center mb-4">
        <Music className="w-6 h-6 mr-2" />
        <h1 className="text-2xl font-bold">Lyricfy</h1>
      </div>

      {/* Social Links Section */}
      <div className="flex space-x-4 mb-4">
        <a
          href="https://www.linkedin.com/in/adedamola-alausa"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-purple-600"
        >
          in
        </a>
        <a
          href="https://x.com/Theadedamola_"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-purple-600"
        >
          tw
        </a>
        <a
          href="https://www.behance.net/damolaalausa"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-purple-600"
        >
          be
        </a>
      </div>

      {/* Copyright Section */}
      <div className="text-lg">
        &copy; {new Date().getFullYear()} Designed and developed by{' '}
        <Link
          to="https://adedamola-pf.netlify.app"
          className="text-purple-800 font-cehua hover:underline"
        >
          adedamola
        </Link>
      </div>
    </footer>
  )
}

export default Footer
