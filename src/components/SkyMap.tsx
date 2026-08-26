import { useMemo, useState } from 'react'
import { NAMORO_DATE, START_DATE, worlds, type Finale, type PlacedStar } from '../data'
import { buildChapters } from '../chapters'

const dateFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
const fmtDate = (d: Date) => dateFmt.format(d).replace(/\sde\s/g, ' ').replace('.', '')

/** Caminho de uma estrela de 4 pontas (sparkle) centrada em (cx, cy). */
function sparkle(cx: number, cy: number, R: number) {
  const r = R * 0.3
  let d = ''
  for (let k = 0; k < 8; k++) {
    const ang = (k * Math.PI) / 4
    const rad = k % 2 === 0 ? R : r
    d += (k === 0 ? 'M' : 'L') + (cx + rad * Math.sin(ang)).toFixed(2) + ' ' + (cy - rad * Math.cos(ang)).toFixed(2) + ' '
  }
  return d + 'Z'
}

/** Uma camada do mapa: um céu inteiro, com as suas ligações. */
type Layer = {
  key: string
  /** de que céu essa camada é (aparece na legenda) */
  label: string
  stars: PlacedStar[]
  finale?: Finale
  /** deslocamento da camada, pra sobrepor sem as estrelas coincidirem */
  dx: number
  dy: number
  /** força das linhas da constelação */
  line: number
  /** cor do corpo das estrelas dessa camada */
  color: string
}

type Point = PlacedStar & { layer: string; isFinale: boolean; color: string }

/** O céu do começo é prata. */
const SILVER = '#fdf7ea'
/**
 * Cada mês do namoro tem a sua cor, na ordem: o primeiro é âmbar, o segundo é
 * azul, e a partir daí a paleta se repete. Assim dá pra bater o olho no mapa e
 * saber de que mês é cada estrela.
 */
const CHAPTER_COLORS = ['#e8b869', '#93b8ea', '#c9a3d4', '#8fd0c0']

/**
 * Sobreposição por camada: cada capítulo do namoro usa a mesma curva, então sem
 * um empurrãozinho as estrelas de meses diferentes cairiam exatamente uma em
 * cima da outra. O deslocamento é fixo por índice (nunca sorteado): o mapa é
 * sempre o mesmo mapa.
 */
const nudge = (i: number) => ({ dx: ((i % 3) - 1) * 4.5, dy: (((i * 2) % 5) - 2) * 2.6 })

/**
 * Todas as estrelas de todos os céus, sobrepostas num mapa só.
 * `poster` tira o que é de navegação (botão e dica de toque), pra virar imagem
 * limpa — é o modo que a URL ?mapa=1&poster=1 liga.
 */
export function SkyMap({ onBack, poster = false }: { onBack?: () => void; poster?: boolean }) {
  const layers = useMemo<Layer[]>(() => {
    const out: Layer[] = []

    const comeco = worlds.find((w) => w.id === 'comeco')
    if (comeco) {
      out.push({
        key: 'comeco',
        label: 'como tudo começou',
        stars: comeco.stars ?? [],
        finale: comeco.finale,
        dx: 0,
        dy: 0,
        line: 0.32,
        color: SILVER,
      })
    }

    const namoro = worlds.find((w) => w.id === 'namoro')
    if (namoro) {
      const chapters = buildChapters(namoro, NAMORO_DATE, new Date(), import.meta.env.DEV)
      chapters.forEach((c, i) => {
        if (c.stars.length === 0 && !c.finale) return
        out.push({
          key: `namoro-${c.n}`,
          label: c.name,
          stars: c.stars,
          finale: c.finale,
          ...nudge(i),
          line: 0.6,
          color: CHAPTER_COLORS[(c.n - 1) % CHAPTER_COLORS.length],
        })
      })
    }
    return out
  }, [])

  const points = useMemo<Point[]>(
    () =>
      layers.flatMap((l) => [
        ...l.stars.map((s) => ({
          ...s,
          x: s.x + l.dx,
          y: s.y + l.dy,
          layer: l.label,
          isFinale: false,
          color: l.color,
        })),
        ...(l.finale
          ? [
              {
                ...l.finale,
                x: l.finale.x + l.dx,
                y: l.finale.y + l.dy,
                layer: l.label,
                isFinale: true,
                color: l.color,
              },
            ]
          : []),
      ]),
    [layers],
  )

  const total = points.length
  const [sel, setSel] = useState<Point | null>(null)

  // o quadro se ajusta às estrelas que existem: sem faixa vazia sobrando
  const box = useMemo(() => {
    const pad = 9
    const xs = points.map((p) => p.x)
    const ys = points.map((p) => p.y)
    const x0 = Math.min(...xs) - pad
    const y0 = Math.min(...ys) - pad
    return {
      viewBox: `${x0} ${y0} ${Math.max(...xs) - Math.min(...xs) + pad * 2} ${
        Math.max(...ys) - Math.min(...ys) + pad * 2
      }`,
    }
  }, [points])

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-4 py-16">
      <p className="label text-mist">todas as nossas estrelas</p>
      <h1 className="mt-4 text-center font-display text-3xl font-light italic text-star sm:text-5xl">
        Nosso Céu
      </h1>
      <p className="timecode mt-5 text-2xl text-ember sm:text-3xl">{total}</p>

      <svg
        className="mt-6 w-full max-w-6xl"
        viewBox={box.viewBox}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Mapa com as ${total} estrelas da nossa história`}
      >
        <defs>
          <filter id="mapglow" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
          <linearGradient id="mapSpikeH" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff6e2" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff6e2" stopOpacity="0.9" />
            <stop offset="1" stopColor="#fff6e2" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="mapSpikeV" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff6e2" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff6e2" stopOpacity="0.9" />
            <stop offset="1" stopColor="#fff6e2" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* as ligações de cada céu, uma camada por vez */}
        {layers.map((l) => {
          const seq = [...l.stars, ...(l.finale ? [l.finale] : [])]
          return seq.slice(0, -1).map((m, i) => {
            const next = seq[i + 1]
            return (
              <line
                key={`${l.key}-l${i}`}
                x1={m.x + l.dx}
                y1={m.y + l.dy}
                x2={next.x + l.dx}
                y2={next.y + l.dy}
                stroke={l.color}
                strokeWidth={0.22}
                strokeLinecap="round"
                opacity={l.line}
              />
            )
          })
        })}

        {/* as estrelas: o fecho de cada céu é maior que os momentos */}
        {points.map((p, i) => {
          const R = p.isFinale ? 2.4 : 1.7
          const active = sel === p
          return (
            <g
              key={`p${i}`}
              onMouseEnter={() => setSel(p)}
              onMouseLeave={() => setSel((s) => (s === p ? null : s))}
              onClick={() => setSel((s) => (s === p ? null : p))}
              className="cursor-pointer"
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={p.isFinale ? 4.4 : 3}
                fill={p.color}
                opacity={active ? 0.24 : 0.13}
                filter="url(#mapglow)"
              />
              <g opacity={active ? 1 : 0.8}>
                <rect x={p.x - R * 1.9} y={p.y - 0.1} width={R * 3.8} height={0.2} fill="url(#mapSpikeH)" />
                <rect x={p.x - 0.1} y={p.y - R * 1.9} width={0.2} height={R * 3.8} fill="url(#mapSpikeV)" />
              </g>
              <path d={sparkle(p.x, p.y, R)} fill={p.color} opacity={active ? 1 : 0.92} />
              <circle cx={p.x} cy={p.y} r={p.isFinale ? 0.62 : 0.45} fill="#ffffff" />
              {/* alvo generoso pro toque no celular */}
              <circle cx={p.x} cy={p.y} r={3.2} fill="transparent" />
            </g>
          )
        })}
      </svg>

      {/* legenda / estrela escolhida */}
      <div className="mt-4 flex min-h-[6.5rem] max-w-2xl flex-col items-center justify-start text-center">
        {sel ? (
          <>
            <p className="label text-ember/90">
              {sel.layer}
              <span className="mx-2 text-mist">·</span>
              {fmtDate(sel.date)}
            </p>
            <h2 className="mt-2 font-display text-xl font-light italic text-star sm:text-2xl">
              {sel.title}
            </h2>
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {layers.map((l) => (
                <span key={l.key} className="label flex items-center gap-2 text-mist">
                  <span
                    aria-hidden
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: l.color }}
                  />
                  {l.label}
                  <span className="text-mist/50">
                    {l.stars.length + (l.finale ? 1 : 0)}
                  </span>
                </span>
              ))}
            </div>
            {!poster && (
              <p className="mt-3 text-xs text-mist/70">toque numa estrela pra ver que momento é</p>
            )}
          </>
        )}
      </div>

      {onBack && !poster && (
        <button
          onClick={onBack}
          className="label mt-8 rounded-full border border-ember/40 bg-night-soft/40 px-6 py-2.5 text-ember backdrop-blur-sm transition-all duration-300 hover:border-ember/70 hover:bg-ember/10 hover:text-star"
        >
          voltar pra história
        </button>
      )}

      <p className="label mt-10 text-mist/60">
        {fmtDate(START_DATE)} — hoje
      </p>
    </section>
  )
}
