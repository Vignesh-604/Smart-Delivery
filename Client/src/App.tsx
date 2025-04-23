import { Outlet } from "react-router-dom"
import Navbar from "./pages/Navbar"

function App() {

  return (
    <div className="bg-gray-200/20">
      <Navbar />
      <Outlet/>
    </div>
  )
}

export default App
