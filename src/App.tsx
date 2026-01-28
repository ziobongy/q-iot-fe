import './App.css'
import MainTheme from "./theme/MainTheme.tsx";
import {Outlet} from "react-router";

function App() {

  return (
    <>
        <MainTheme children={<Outlet />}/>
    </>
  )
}

export default App
