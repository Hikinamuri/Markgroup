import { Outlet } from "react-router-dom";

import './App.css'

function App() {
  return (
    <>
      <div id="sidebar"></div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  )
}

export default App
