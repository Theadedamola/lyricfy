import { Outlet } from "react-router-dom"

const LyricfyApp = () => {
  return (
    <div>
      <main className="max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
export default LyricfyApp