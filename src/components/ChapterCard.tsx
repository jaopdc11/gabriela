import type { CSSProperties } from 'react'
import type { Chapter } from '../chapters'

const delay = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` })

const dayFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })
const fmtDay = (d: Date) => dayFmt.format(d).replace(/\sde\s/g, ' ').replace('.', '')

/** Intervalo do capítulo: "23 jul — 23 ago 2026". */
const fmtRange = (start: Date, end: Date) => {
  const last = new Date(end.getTime() - 1)
  return `${fmtDay(start)} — ${fmtDay(last)} ${last.getFullYear()}`
}

/**
 * Troca de capítulo: os numerais em fila, do jeito de uma cartela de filme. Quem
 * diz o nome do mês é a cartela logo abaixo — aqui em cima é só o romano, e o
 * fio âmbar embaixo do que está aberto.
 */
export function ChapterNav({
  chapters,
  current,
  onChange,
}: {
  chapters: Chapter[]
  current: number
  onChange: (n: number) => void
}) {
  return (
    <div className="no-scrollbar flex max-w-full items-center gap-2 overflow-x-auto px-2 sm:gap-4">
      {chapters.map((c) => {
        const open = c.n === current
        return (
          <button
            key={c.n}
            onClick={() => onChange(c.n)}
            aria-current={open ? 'true' : undefined}
            aria-label={`capítulo ${c.roman}, ${c.name}`}
            className={`group relative flex h-11 min-w-[2.75rem] shrink-0 items-center justify-center font-display text-xl tracking-title transition-colors duration-500 sm:text-2xl ${
              open ? 'text-ember' : 'text-mist/60 hover:text-star'
            }`}
          >
            <span style={open ? { textShadow: '0 0 24px rgba(230, 192, 122, 0.35)' } : undefined}>
              {c.roman}
            </span>

            {/* o fio embaixo: cresce no capítulo aberto, insinua no hover */}
            <span
              aria-hidden
              className={`absolute bottom-1.5 left-1/2 h-px -translate-x-1/2 bg-current transition-all duration-500 ${
                open
                  ? 'w-5 opacity-90 shadow-[0_0_10px_rgba(230,192,122,0.7)]'
                  : 'w-2 opacity-0 group-hover:opacity-40'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}

/** Cartela de abertura do capítulo: o numeral, o nome do mês e as datas dele. */
export function ChapterCard({
  chapter,
  chapters,
  onChange,
}: {
  chapter: Chapter
  chapters: Chapter[]
  onChange: (n: number) => void
}) {
  return (
    <section
      id="capitulo"
      className="relative flex min-h-[82svh] flex-col items-center justify-center gap-14 px-6 text-center"
    >
      <div className="animate-title-in" style={delay(100)}>
        <ChapterNav chapters={chapters} current={chapter.n} onChange={onChange} />
      </div>

      <div>
        <p className="label animate-title-in text-mist" style={delay(400)}>
          capítulo {chapter.roman}
        </p>

        <h2
          className="mt-7 animate-title-in font-display text-[2.6rem] font-light italic leading-none text-star sm:text-[4.5rem]"
          style={{ ...delay(700), textShadow: '0 0 50px rgba(230, 192, 122, 0.12)' }}
        >
          {chapter.name}
        </h2>

        <p className="label mt-8 animate-title-in text-ember/80" style={delay(1000)}>
          {fmtRange(chapter.start, chapter.end)}
        </p>
      </div>

      {/* a seta aponta pro que vem primeiro: a carta do mês, se tiver */}
      <a
        href={chapter.dedication ? '#dedicatoria' : '#ceu'}
        className="group flex animate-title-in flex-col items-center gap-3 text-mist transition-colors hover:text-star"
        style={delay(1500)}
        aria-label={`Começar ${chapter.name}`}
      >
        <span className="label text-[0.6rem]">
          {chapter.dedication
            ? 'a minha carta desse mês'
            : chapter.stars.length > 0
              ? 'as estrelas desse mês'
              : 'o céu desse mês'}
        </span>
        <span className="h-12 w-px animate-hint-fade bg-gradient-to-b from-ember to-transparent" />
      </a>
    </section>
  )
}
