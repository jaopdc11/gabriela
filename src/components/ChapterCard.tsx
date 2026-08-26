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

/** Troca de capítulo: as setas andam de mês em mês, as pílulas pulam direto. */
export function ChapterNav({
  chapters,
  current,
  onChange,
}: {
  chapters: Chapter[]
  current: number
  onChange: (n: number) => void
}) {
  const i = chapters.findIndex((c) => c.n === current)
  const prev = chapters[i - 1]
  const next = chapters[i + 1]

  const arrow = (c: Chapter | undefined, label: string, d: string) => (
    <button
      onClick={() => c && onChange(c.n)}
      disabled={!c}
      aria-label={label}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-mist transition-colors hover:text-star disabled:opacity-25 disabled:hover:text-mist"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d={d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )

  return (
    <div className="flex max-w-full items-center gap-1 rounded-full border border-white/10 bg-night-deep/60 p-1 backdrop-blur-md">
      {arrow(prev, 'Mês anterior', 'M15 5l-7 7 7 7')}
      <div className="no-scrollbar flex items-center gap-1 overflow-x-auto">
        {chapters.map((c) => (
          <button
            key={c.n}
            onClick={() => onChange(c.n)}
            aria-current={c.n === current ? 'true' : undefined}
            className={`label shrink-0 rounded-full px-3 py-1.5 transition-colors ${
              c.n === current
                ? 'bg-ember/15 text-ember ring-1 ring-ember/40'
                : 'text-mist hover:text-star'
            }`}
          >
            {c.nav}
          </button>
        ))}
      </div>
      {arrow(next, 'Mês seguinte', 'M9 5l7 7-7 7')}
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

        {chapter.current && (
          <p
            className="label mt-5 inline-block animate-title-in rounded-full bg-ember/10 px-3.5 py-1.5 text-ember/90 ring-1 ring-ember/30"
            style={delay(1200)}
          >
            acontecendo agora
          </p>
        )}
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
