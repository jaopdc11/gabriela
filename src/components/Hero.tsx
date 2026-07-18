import type { CSSProperties } from 'react'
import { START_DATE } from '../data'
import { useElapsed } from '../useElapsed'
import { CounterTimecode } from './CounterTimecode'

const delay = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` })

/** Abertura: título de cinema sobre o céu. */
export function Hero() {
  const elapsed = useElapsed(START_DATE)

  return (
    <header className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <p className="label animate-title-in" style={delay(200)}>
        a nossa história, pra você
      </p>

      <h1
        className="mt-8 font-display font-light leading-[0.9] tracking-title text-star"
        style={{ textShadow: '0 0 50px rgba(230, 192, 122, 0.14)' }}
      >
        <span className="block animate-title-in text-[3.4rem] sm:text-[7rem]" style={delay(500)}>
          João
        </span>
        <span
          className="my-2 block animate-title-in font-light italic text-ember sm:my-3"
          style={delay(800)}
        >
          <span className="text-2xl sm:text-4xl">&amp;</span>
        </span>
        <span className="block animate-title-in text-[3.4rem] sm:text-[7rem]" style={delay(1050)}>
          Gabriela
        </span>
      </h1>

      <p className="label mt-10 animate-title-in text-ember/80" style={delay(1500)}>
        06 · 06 · 2026 · a noite em que tudo começou
      </p>

      <div className="mt-14 animate-title-in" style={delay(1900)}>
        <p className="label mb-4 text-mist">a gente se conhece há</p>
        {elapsed && <CounterTimecode elapsed={elapsed} />}
      </div>
      <p className="sr-only">A gente se conhece desde 6 de junho de 2026.</p>

      <a
        href="#antes"
        className="group absolute bottom-[8vh] flex flex-col items-center gap-3 text-mist transition-colors hover:text-star"
        aria-label="Começar"
      >
        <span className="label text-[0.6rem]">role, tem uma coisa antes</span>
        <span className="h-12 w-px animate-hint-fade bg-gradient-to-b from-ember to-transparent" />
      </a>
    </header>
  )
}
