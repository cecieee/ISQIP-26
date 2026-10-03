import './App.css'
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './Components/Navbar'
import Hero from './Components/Hero'
import HeroMobile from './Components/HeroMobile'
import CountDown from "./Components/CountDown.jsx";
import About from './Components/About'
import WhyParticipate from './Components/WhyParticipate'
import EventDetails from './Components/EventDetails'
import LearningTracks from './Components/LearningTracks'
import Domains from "./Components/Domains.jsx"
import Highlights from "./Components/Highlights.jsx"
import OrganizedBy from './Components/OrganizedBy'
import FAQ from './Components/FAQ'
import Footer from './Components/Footer'
import LoadingScreen from "./Components/LoadingScreen.jsx"

import CodeofConduct from './Pages/CodeofConduct'
import Schedule from './Pages/Schedule'

/** Returns true when viewport width is ≤ 768 px */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 768
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

function LandingPage() {
  const isMobile = useIsMobile();
  return (
    <main>
      <LoadingScreen/>
      {isMobile ? <HeroMobile /> : <Hero />}
      <CountDown />
      <About />
      <WhyParticipate />
      <EventDetails />
      <LearningTracks />
      <Domains />
      <Highlights />
      <OrganizedBy />
      <FAQ />
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/code-of-conduct" element={<CodeofConduct />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App
