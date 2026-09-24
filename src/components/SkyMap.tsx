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

/** A cor do mês `n` do namoro — a mesma no mapa e no céu do capítulo. */
export const chapterColor = (n: number) => CHAPTER_COLORS[(n - 1) % CHAPTER_COLORS.length]

/**
 * Faixa por capítulo: todo mês do namoro é desenhado na MESMA curva do mundo
 * (14 de altura: base 21, amplitude 7), então eles cairiam quase um dentro do
 * outro — um empurrãozinho de 5 não separava nada. Aqui cada mês desce uma faixa
 * e anda um pouco de lado. `BAND` é o botão: menor que a altura da curva (14) de
 * propósito, pra as constelações ainda se cruzarem em vez de virarem pauta de
 * caderno; com 10 elas separam completamente. Tudo fixo por índice, nunca
 * sorteado: o mapa é sempre o mesmo mapa. O começo fica na faixa de cima (dy 0).
 */
const BAND = 4.5
const SQUASH = 0.75
const nudge = (i: number) => ({ dx: ((i % 3) - 1) * 6, dy: BAND * (i + 1) })

/** distância mínima entre duas estrelas de céus diferentes */
const GAP = 3.6

/**
 * Desencosta as estrelas que caíram uma em cima da outra. Afastar as camadas
 * inteiras não resolve isso: o encontro é local (uma estrela de um mês que
 * calha de bater numa de outro), e afastar tudo até o pior par se resolver
 * deixa os céus longe demais, cada um na sua pauta. Então aqui as faixas ficam
 * perto de propósito e só os pares que se tocam abrem caminho, empurrando um
 * pra cima e o outro pra baixo, o de cima sendo sempre o do céu mais antigo.
 * Roda uma vez, na montagem, e é determinístico: o mapa é sempre o mesmo mapa.
 */
function spread(ls: Layer[]) {
  const all = ls.flatMap((l, li) =>
    [...l.stars, ...(l.finale ? [l.finale] : [])].map((s) => ({ s, li })),
  )
  for (let pass = 0; pass < 24; pass++) {
    let moved = false
    for (let i = 0; i < all.length; i++) {
      for (let j = i + 1; j < all.length; j++) {
        if (all[i].li === all[j].li) continue
        const a = all[i].s
        const b = all[j].s
        const d = Math.hypot(b.x - a.x, b.y - a.y)
        if (d >= GAP) continue
        const push = (GAP - d) / 2 + 0.02
        const [up, down] = all[i].li < all[j].li ? [a, b] : [b, a]
        up.y -= push
        down.y += push
        moved = true
      }
    }
    if (!moved) break
  }
}

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
        // cópia: daqui pra frente as coordenadas são mexidas (ver `spread`)
        stars: (comeco.stars ?? []).map((s) => ({ ...s })),
        finale: comeco.finale && { ...comeco.finale },
        line: 0.32,
        color: SILVER,
      })
    }

    const namoro = worlds.find((w) => w.id === 'namoro')
    if (namoro) {
      const chapters = buildChapters(namoro, NAMORO_DATE, new Date(), import.meta.env.DEV)
      /**
       * No mapa cada mês vira uma faixa mais fina: a curva do capítulo é
       * achatada em volta da própria linha de base, senão três céus de 14 de
       * altura não cabem um embaixo do outro sem estrela cair em cima de
       * estrela. No céu do capítulo, sozinho na tela, ela continua inteira.
       */
      const base = namoro.arc.base
      chapters.forEach((c, i) => {
        if (c.stars.length === 0 && !c.finale) return
        const { dx, dy } = nudge(i)
        // a faixa do mês já entra resolvida: achatada, descida e deslocada
        const put = <T extends PlacedStar>(s: T): T => ({
          ...s,
          x: s.x + dx,
          y: (s.y - base) * SQUASH + base + dy,
        })
        out.push({
          key: `namoro-${c.n}`,
          label: c.name,
          stars: c.stars.map(put),
          finale: c.finale ? put(c.finale) : undefined,
          line: 0.6,
          color: chapterColor(c.n),
        })
      })
    }
    spread(out)
    return out
  }, [])

  const points = useMemo<Point[]>(
    () =>
      layers.flatMap((l) => [
        ...l.stars.map((s) => ({
          ...s,
          layer: l.label,
          isFinale: false,
          color: l.color,
        })),
        ...(l.finale
          ? [
              {
                ...l.finale,
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
                x1={m.x}
                y1={m.y}
                x2={next.x}
                y2={next.y}
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
            {/* a legenda veste a cor do mês da estrela, não o âmbar de sempre */}
            <p className="label" style={{ color: sel.color }}>
              {sel.layer}
              <span className="mx-2 opacity-50">·</span>
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
