import './App.css'
import Navbar from './Components/Navbar'
import Hero from './Components/Hero'
import About from './Components/About'
import WhyParticipate from './Components/WhyParticipate'
import LearningTracks from './Components/LearningTracks'
import OrganizedBy from './Components/OrganizedBy'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <WhyParticipate />
        <LearningTracks />
        <OrganizedBy />
      </main>
    </>
  )
}

export default App
