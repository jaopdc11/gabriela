import { Starfield } from './components/Starfield'
import { CursorGlow } from './components/CursorGlow'
import { Hero } from './components/Hero'
import { Prologue } from './components/Prologue'
import { NightJourney } from './components/NightJourney'
import { PhotoCarousel } from './components/PhotoCarousel'
import { Epilogue } from './components/Epilogue'
import { AmbientAudio } from './components/AmbientAudio'

export default function App() {
  return (
    <div className="grain vignette relative">
      <Starfield />
      <CursorGlow />
      <AmbientAudio />

      {/* abertura de cinema: a tela nasce do preto */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80] bg-night-deep"
        style={{ animation: 'fade-from-black 1.9s ease-out forwards' }}
      />

      <main className="relative z-10">
        <Hero />
        <Prologue />
        <NightJourney />
        <PhotoCarousel />
        <Epilogue />
      </main>
    </div>
  )
}
