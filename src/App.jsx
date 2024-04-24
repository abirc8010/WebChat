import { BrowserRouter,Routes,Route } from "react-router-dom"
import Home from "./components/home/home"
import ResponsiveDrawer from "./components/drawer/drawer"
function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>    
    <Route path="/chat" element={<ResponsiveDrawer/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
