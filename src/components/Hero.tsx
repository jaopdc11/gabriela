import { useState, type CSSProperties } from 'react'
import { START_DATE, NAMORO_DATE } from '../data'
import { useElapsed } from '../useElapsed'
import { CounterTimecode } from './CounterTimecode'
import { AUDIO_PLAY_EVENT } from './AmbientAudio'

const delay = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` })

/** Abertura: título de cinema sobre o céu. */
export function Hero() {
  const elapsedConhecemos = useElapsed(START_DATE)
  const elapsedNamoro = useElapsed(NAMORO_DATE)
  const [mode, setMode] = useState<'conhecemos' | 'namoro'>('conhecemos')
  const elapsed = mode === 'conhecemos' ? elapsedConhecemos : elapsedNamoro

  return (
    <header className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <p className="label animate-title-in" style={delay(200)}>
        a nossa história, pra ti
      </p>

      <h1
        className="mt-8 font-display font-light leading-[0.9] tracking-title text-star"
        style={{ textShadow: '0 0 50px rgba(230, 192, 122, 0.14)' }}
      >
        <span className="block animate-title-in text-[3.4rem] sm:text-[7rem]" style={delay(500)}>
          Jão
        </span>
        <span
          className="my-2 block animate-title-in font-light italic text-ember sm:my-3"
          style={delay(800)}
        >
          <span className="text-2xl sm:text-4xl">&amp;</span>
        </span>
        <span className="block animate-title-in text-[3.4rem] sm:text-[7rem]" style={delay(1050)}>
          Gabi
        </span>
      </h1>

      <p className="label mt-10 animate-title-in text-ember/80" style={delay(1500)}>
        06 · 06 · 2026
      </p>

      <div className="mt-14 animate-title-in" style={delay(1900)}>
        {elapsed && <CounterTimecode elapsed={elapsed} />}
        {/* botão que alterna o contador entre "nos conhecemos" e "namorando" */}
        <div className="mb-4 mt-5 flex items-center justify-center gap-1.5">
          {(['conhecemos', 'namoro'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`label rounded-full px-3.5 py-1.5 transition-colors ${
                mode === m
                  ? 'bg-ember/15 text-ember ring-1 ring-ember/40'
                  : 'text-mist hover:text-star'
              }`}
            >
              {m === 'conhecemos' ? 'desde que nos conhecemos' : 'namorando'}
            </button>
          ))}
        </div>
      </div>
      <p className="sr-only">
        Nos conhecemos 6 de junho de 2026 e começamos a namorar 23 de julho de 2026.
      </p>

      <a
        href="#antes"
        onClick={() => window.dispatchEvent(new Event(AUDIO_PLAY_EVENT))}
        className="group absolute bottom-[8vh] flex animate-title-in items-center gap-2.5 rounded-full border border-ember/40 bg-night-soft/40 px-7 py-3 text-ember backdrop-blur-sm transition-all duration-300 hover:border-ember/70 hover:bg-ember/10 hover:text-star"
        style={delay(2100)}
        aria-label="Começar a nossa história"
      >
        <span className="font-mono text-xs tracking-[0.18em]">Aperta aí</span>
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          className="animate-hint-fade transition-transform duration-300 group-hover:translate-y-0.5"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </header>
  )
}
