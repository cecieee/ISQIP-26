import './App.css'
import Navbar from './Components/Navbar'
import Hero from './Components/Hero'
import CountDown from "./Components/CountDown.jsx";
import About from './Components/About'
import WhyParticipate from './Components/WhyParticipate'
import EventDetails from './Components/EventDetails'
import LearningTracks from './Components/LearningTracks'
import OrganizedBy from './Components/OrganizedBy'
import Schedule from './Components/Schedule'
import FAQ from './Components/FAQ'
import Footer from './Components/Footer'


import Highlights from "./Components/Highlights.jsx"
import Domains from "./Components/Domains.jsx"

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CountDown />
        <About />
        <WhyParticipate />
        <EventDetails />
        <LearningTracks />
        <Domains />
         <Schedule />
        <Highlights />
        <OrganizedBy />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}

export default App
