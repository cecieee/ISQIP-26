import './App.css'
import Navbar from './Components/Navbar'
import Hero from './Components/Hero'
import LearningTracks from './Components/LearningTracks'
import Footer from './Components/Footer'
function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LearningTracks />
      </main>
      <Footer />
    </>
  )
}

export default App
