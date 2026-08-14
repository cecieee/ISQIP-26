import './App.css'
import Navbar from './Components/Navbar'
import Hero from './Components/Hero'
import CountDown from "./Components/CountDown.jsx";
import About from './Components/About'
import WhyParticipate from './Components/WhyParticipate'
import LearningTracks from './Components/LearningTracks'
import OrganizedBy from './Components/OrganizedBy'
import FAQ from './Components/FAQ'
import Footer from './Components/Footer'



function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div className="min-h-screen bg-black">
          <CountDown />
        </div>
        <About />
        <WhyParticipate />
        <LearningTracks />
        <OrganizedBy />
        <FAQ />
      </main>
      <Footer />     
    </>
  );
}

export default App
