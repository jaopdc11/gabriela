import { useMemo, useState } from 'react'
import { NAMORO_DATE, worlds, type Milestone } from '../data'
import { buildChapters } from '../chapters'
import { project, type Constellation, type ProjectedStar } from '../constellations'

const dateFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
const fmtDate = (d: Date) => dateFmt.format(d).replace(/\sde\s/g, ' ').replace('.', '')

/** Caminho de uma estrela de 4 pontas (sparkle) centrada em (cx, cy). */
function sparkle(cx: number, cy: number, R: number) {
  const r = R * 0.3
  let out = ''
  for (let k = 0; k < 8; k++) {
    const ang = (k * Math.PI) / 4
    const rad = k % 2 === 0 ? R : r
    out += (k === 0 ? 'M' : 'L') + (cx + rad * Math.sin(ang)).toFixed(2) + ' ' + (cy - rad * Math.cos(ang)).toFixed(2) + ' '
  }
  return out + 'Z'
}

/** Uma vaga do desenho: a estrela real e o nosso momento, se já tiver acendido. */
type Slot = ProjectedStar & { moment?: Milestone; kind?: 'momento' | 'marco' }

/**
 * O molde de uma constelação real com os nossos momentos acesos nela. As vagas
 * que a gente ainda não viveu ficam de fantasma — é o desenho esperando a vida
 * acontecer.
 */
export function ConstellationMap({
  constellation,
  poster = false,
  onBack,
}: {
  constellation: Constellation
  poster?: boolean
  onBack?: () => void
}) {
  const { slots, lit, total, height, leftOut } = useMemo(() => {
    const { stars, height } = project(constellation)

    // TODOS os nossos momentos: o céu do começo e o do namoro, inteiros
    const comeco = worlds.find((w) => w.id === 'comeco')
    const namoro = worlds.find((w) => w.id === 'namoro')
    const chapters = namoro
      ? buildChapters(namoro, NAMORO_DATE, new Date(), import.meta.env.DEV)
      : []

    const byDate = (a: Milestone, b: Milestone) => a.date.getTime() - b.date.getTime()
    // os marcos (o pedido e os fechos de mês) vão nas estrelas mais brilhantes
    const marks: Milestone[] = [
      ...(comeco?.finale ? [comeco.finale] : []),
      ...chapters.flatMap((c) => (c.finale ? [c.finale] : [])),
    ].sort(byDate)
    const moments: Milestone[] = [
      ...(comeco?.stars ?? []),
      ...chapters.flatMap((c) => c.stars),
    ].sort(byDate)

    // estrelas da mais brilhante pra mais fraca: primeiro os marcos, depois os
    // dias comuns em ordem de quando aconteceram
    const byMag = [...stars].sort((a, b) => a.mag - b.mag)
    const filled = new Map<string, { moment: Milestone; kind: 'momento' | 'marco' }>()
    marks.forEach((m, i) => {
      const star = byMag[i]
      if (star) filled.set(star.key, { moment: m, kind: 'marco' })
    })
    moments.forEach((m, i) => {
      const star = byMag[marks.length + i]
      if (star) filled.set(star.key, { moment: m, kind: 'momento' })
    })

    const slots: Slot[] = stars.map((s) => ({ ...s, ...filled.get(s.key) }))
    return {
      slots,
      lit: filled.size,
      total: stars.length,
      height,
      // momentos que não couberam no desenho (quando a vida passar as vagas)
      leftOut: marks.length + moments.length - filled.size,
    }
  }, [constellation])

  const pos = useMemo(() => new Map(slots.map((s) => [s.key, s])), [slots])
  const [sel, setSel] = useState<Slot | null>(null)
  const pad = 12

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-4 py-16">
      <p className="label text-mist">{constellation.who}</p>
      <h1 className="mt-4 text-center font-display text-3xl font-light italic text-star sm:text-5xl">
        {constellation.name}
      </h1>
      <p className="timecode mt-5 text-xl text-ember sm:text-2xl">
        {lit} <span className="text-mist">/</span> {total}
      </p>

      <svg
        className="mt-8 w-full max-w-4xl"
        viewBox={`${-pad} ${-pad} ${100 + pad * 2} ${height + pad * 2}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`${constellation.name}, com ${lit} de ${total} estrelas acesas`}
      >
        <defs>
          <filter id="cglow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        {/* o traçado: forte entre vagas acesas, fantasma no resto */}
        {constellation.lines.map(([a, b], i) => {
          const p = pos.get(a)
          const q = pos.get(b)
          if (!p || !q) return null
          const both = !!p.moment && !!q.moment
          return (
            <line
              key={`l${i}`}
              x1={p.x}
              y1={p.y}
              x2={q.x}
              y2={q.y}
              stroke="#e6c07a"
              strokeWidth={both ? 0.5 : 0.3}
              strokeLinecap="round"
              strokeDasharray={both ? undefined : '1.4 1.8'}
              opacity={both ? 0.55 : 0.14}
            />
          )
        })}

        {slots.map((s) => {
          const on = !!s.moment
          const isMark = s.kind === 'marco'
          // tamanho pela magnitude de verdade: quanto mais brilhante, maior
          const base = 0.42 + Math.max(0, 6.2 - s.mag) * 0.32
          const R = isMark ? base + 0.5 : on ? base + 0.25 : base
          const active = sel?.key === s.key
          return (
            <g
              key={s.key}
              onMouseEnter={() => setSel(s)}
              onMouseLeave={() => setSel((x) => (x?.key === s.key ? null : x))}
              onClick={() => setSel((x) => (x?.key === s.key ? null : s))}
              className="cursor-pointer"
            >
              {on && (
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={isMark ? 3.4 : 2.4}
                  fill="#e6c07a"
                  opacity={active ? 0.24 : 0.12}
                  filter="url(#cglow)"
                />
              )}
              <path
                d={sparkle(s.x, s.y, R)}
                fill={on ? '#fdf7ea' : '#cfd6e6'}
                opacity={on ? (active ? 1 : 0.95) : 0.42}
              />
              {on && <circle cx={s.x} cy={s.y} r={isMark ? 0.6 : 0.42} fill="#fff" />}
              <circle cx={s.x} cy={s.y} r={3.4} fill="transparent" />
            </g>
          )
        })}
      </svg>

      {/* o que a vaga escolhida é: a estrela de verdade e o nosso momento nela */}
      <div className="mt-6 flex min-h-[7rem] max-w-2xl flex-col items-center text-center">
        {sel ? (
          <>
            <p className="label text-ember/90">
              {sel.name}
              <span className="mx-2 text-mist">·</span>
              {sel.bayer}
              <span className="mx-2 text-mist">·</span>
              mag {sel.mag.toFixed(2)}
            </p>
            {sel.moment ? (
              <>
                <h2 className="mt-3 font-display text-xl font-light italic text-star sm:text-2xl">
                  {sel.moment.title}
                </h2>
                <p className="label mt-2 text-mist">{fmtDate(sel.moment.date)}</p>
              </>
            ) : (
              <p className="mt-3 font-display text-lg italic text-mist sm:text-xl">
                essa ainda não acendeu
              </p>
            )}
          </>
        ) : (
          <>
            <p className="text-sm leading-relaxed text-mist">
              {lit === total
                ? `as ${total} estrelas do desenho são nossas.`
                : `${lit} das ${total} estrelas do desenho já são nossas.`}
              <br />
              {leftOut > 0
                ? `e ${leftOut} ${leftOut === 1 ? 'momento já não cabe' : 'momentos já não cabem'} aqui: o céu vai precisar de outra constelação.`
                : lit === total
                  ? 'o desenho fechou. o próximo momento vai pedir um céu novo.'
                  : 'as apagadas são as que a gente ainda vai viver.'}
            </p>
            {!poster && (
              <p className="mt-3 text-xs text-mist/70">toque numa estrela</p>
            )}
          </>
        )}
      </div>

      {onBack && !poster && (
        <button
          onClick={onBack}
          className="label mt-8 rounded-full border border-ember/40 bg-night-soft/40 px-6 py-2.5 text-ember backdrop-blur-sm transition-all duration-300 hover:border-ember/70 hover:bg-ember/10 hover:text-star"
        >
          voltar
        </button>
      )}
    </section>
  )
}
