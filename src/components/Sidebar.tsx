import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  PenToolIcon,
  Users,
  Menu,
  X,
  LogOut,
  SidebarIcon,
  Code,
} from 'lucide-react'
import { useAuth } from '../lib/AuthContext'
import logo from '../assets/logo.svg'

// Add this to your imports and props
interface SidebarProps {
  onToggle?: (isOpen: boolean) => void
}

const Sidebar = ({ onToggle }: SidebarProps = {}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDesktopOpen, setIsDesktopOpen] = useState(true)
  const { user, logout } = useAuth()
  const location = useLocation()

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const toggleDesktopSidebar = () => {
    const newState = !isDesktopOpen
    setIsDesktopOpen(newState)
    // Notify parent component about the state change
    if (onToggle) {
      onToggle(newState)
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  const navItems = [
    {
      name: 'Create',
      path: '/dashboard',
      icon: <PenToolIcon className="w-5 h-5" />,
    },
    {
      name: 'Code Beautify',
      path: '/dashboard/code-beautify',
      icon: <Code className="w-5 h-5" />,
    },
    {
      name: 'Community',
      path: '/dashboard/community',
      icon: <Users className="w-5 h-5" />,
    },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-lg shadow-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 m-8 rounded-3xl h-[90vh] bg-white border border-[#f0f0f0] z-40 transition-all duration-300 ease-in-out shadow-[0px_6px_40px_rgba(0,0,0,0.06)] ${
          isOpen ? 'w-64' : 'w-0 md:w-auto'
        } ${isDesktopOpen ? 'md:w-64' : 'md:w-24'} overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and brand */}
          <div className="flex items-center gap-2 p-6">
            <img src={logo} alt="lyricfy logo" className="w-8 h-8" />
            <span
              className={`font-bold text-xl ${
                isDesktopOpen ? 'block' : 'hidden'
              }`}
            >
              Lyricfy
            </span>
            <div
              className={`${
                isDesktopOpen ? 'w-full' : ''
              } flex items-end justify-end`}
            >
              <SidebarIcon
                onClick={toggleDesktopSidebar}
                className="w-4 h-4 cursor-pointer"
                color="#1e1e1e"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-purple-100 text-purple-700'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setIsOpen(false)
                  }
                }}
              >
                {item.icon}
                <span className={isDesktopOpen ? 'block' : 'hidden'}>
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Logout button */}
          <div className="p-4">
            {/* User profile */}
            {user && (
              <div
                className={`pb-4 border-b ${
                  isDesktopOpen ? 'block' : 'hidden md:flex md:justify-center'
                }`}
              >
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                      {user.displayName?.charAt(0) ||
                        user.email?.charAt(0) ||
                        '?'}
                    </div>
                  )}
                  <div
                    className={`flex-1 min-w-0 ${
                      isDesktopOpen ? 'block' : 'hidden'
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
            >
              <LogOut
                className={`${isDesktopOpen ? '' : 'mx-auto'}`}
                size={24}
              />
              <span className={isDesktopOpen ? 'block' : 'hidden'}>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
