import { Outlet } from 'react-router-dom'
// import Footer from './Footer'
import Sidebar from './Sidebar'
import { useState, useEffect } from 'react'

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Listen for sidebar state changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar onToggle={(open) => setIsSidebarOpen(open)} />

      <main className={`flex-1 transition-all duration-300 px-4 sm:px-6 md:px-8 py-8 pt-16 md:pt-8 overflow-y-auto scroll-smooth ${
        isSidebarOpen ? 'md:ml-64' : 'md:ml-24'
      }`}>
        <div className={`mx-auto ${isSidebarOpen ? 'max-w-5xl' : 'max-w-6xl pl-6'}`}>
          <Outlet />
        </div>
      </main>

      {/* <Footer className="md:ml-64" /> */}
    </div>
  )
}
