import './App.css'
import CountDown from "./Components/CountDown.jsx";
import Highlights from "./Components/Highlights.jsx"
import Domains from "./Components/Domains.jsx"

function App() {

  return (
    <>
      <div className="min-h-screen bg-black">
        <CountDown />
        <Domains/>
        <Highlights/>
      </div>
     
    </>
  );
}

export default App
