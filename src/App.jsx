import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './Components/Navbar'
import Hero from './Components/Hero'
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

import CodeofConduct from './Pages/CodeofConduct'
import Schedule from './Pages/Schedule'

function LandingPage() {
  return (
    <main>
      <Hero />
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
