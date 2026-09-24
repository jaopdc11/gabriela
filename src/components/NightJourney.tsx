import { useEffect, useId, useMemo, useRef, useState, type RefObject } from 'react'
import type { Finale, PlacedStar } from '../data'
import { ExuFigure } from './ExuFigure'

const dateFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
const fmtDate = (d: Date) =>
  dateFmt
    .format(d)
    .replace(/\sde\s/g, ' ')
    .replace('.', '')

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))

/** PRNG determinístico — mesmo céu em todo carregamento. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type FillerStar = { x: number; y: number; r: number; a: number; twinkle: boolean; dur: number; delay: number }

/** Campo de estrelas de apoio espalhado pelo céu (um por mundo, via semente). */
function buildFiller(seed: number): FillerStar[] {
  const rng = mulberry32(seed)
  return Array.from({ length: 56 }, () => ({
    x: 1 + rng() * 98,
    y: 0.5 + rng() * 43,
    r: 0.14 + rng() * 0.6,
    a: 0.1 + rng() * 0.4,
    twinkle: rng() > 0.7,
    dur: 2.6 + rng() * 3.4,
    delay: rng() * 4,
  }))
}

/** Caminho de uma estrela de 4 pontas (sparkle) centrada em (cx, cy). */
function sparkle(cx: number, cy: number, R: number) {
  const r = R * 0.3
  let d = ''
  for (let k = 0; k < 8; k++) {
    const ang = (k * Math.PI) / 4
    const rad = k % 2 === 0 ? R : r
    const x = cx + rad * Math.sin(ang)
    const y = cy - rad * Math.cos(ang)
    d += (k === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2) + ' '
  }
  return d + 'Z'
}

const reducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** Progresso de rolagem (0–1) da seção com sticky. */
function useSectionProgress(ref: RefObject<HTMLElement | null>) {
  const [p, setP] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const update = () => {
      const total = el.offsetHeight - window.innerHeight
      const scrolled = -el.getBoundingClientRect().top
      const next = total > 0 ? clamp(scrolled / total) : 0
      // ignora variações mínimas → menos re-render do SVG por frame (mobile mais leve)
      setP((prev) => (Math.abs(next - prev) < 0.0015 ? prev : next))
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ref])
  return p
}

/** Realça palavras sagradas (axé, Ora Ye Ye ô) no tom ember. */
const SACRED = ['axé', 'Ora Ye Ye ô']
function highlightSacred(text: string) {
  return text.split(/(axé|Ora Ye Ye ô)/g).map((part, i) =>
    SACRED.includes(part) ? (
      <span key={i} className="font-medium text-ember">
        {part}
      </span>
    ) : (
      part
    ),
  )
}

/**
 * A viagem por um céu: constelação que acende conforme a rolagem. Serve tanto
 * pro céu inteiro de um mundo quanto pro céu de um capítulo (um mês só).
 */
/**
 * Folga em volta do quadro do céu, em unidades do desenho. As estrelas de ponta
 * (a do fecho mora lá no canto) ficam coladas na borda da caixa, e o halo e a
 * cruz delas eram cortados num quadrado. O svg transborda a caixa nessa medida,
 * com o viewBox crescendo junto: nada muda de lugar nem de tamanho, só o brilho
 * ganha espaço. Limitado de propósito (e não `overflow: visible`), pra o
 * desfoque não ser repintado numa área sem fim a cada quadro da rolagem.
 */
const GLOW_PAD = 9

/** Tamanho das estrelas da constelação (corpo, brilho, cruz e pulso), em escala. */
const K = 0.84

export function NightJourney({
  stars,
  finale,
  seed,
  label,
  emptyNote,
  color,
}: {
  stars: PlacedStar[]
  finale?: Finale
  /** semente do céu de apoio: cada céu tem o seu próprio fundo de estrelas */
  seed: number
  label: string
  /** frase pro céu que ainda não tem estrela nenhuma */
  emptyNote?: string
  /**
   * Cor do capítulo (a mesma do mapa). Sem ela, o céu do começo: corpo prata e
   * brilho dourado.
   */
  color?: string
}) {
  const body = color ?? '#fdf7ea'
  const accent = color ?? '#e6c07a'
  const sectionRef = useRef<HTMLElement>(null)
  // ids dos gradientes por céu: cada capítulo tem a sua cor, e na página de
  // tudo vários céus convivem
  const uid = useId().replace(/:/g, '')
  const bloomAccent = `bloomA${uid}`
  const bloomWarm = `bloomW${uid}`
  const p = useSectionProgress(sectionRef)
  const reduced = reducedMotion()

  const N = stars.length
  const SCENES = N + (finale ? 1 : 0)

  // céu de apoio e "teia" (cada estrela principal ligada às 2 de apoio mais próximas)
  const { FILLER, WEB } = useMemo(() => {
    const filler = buildFiller(seed)
    const web = stars.flatMap((m, i) =>
      [...filler]
        .map((f) => ({ f, d: (f.x - m.x) ** 2 + (f.y - m.y) ** 2 }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 2)
        .map(({ f }) => ({ x1: m.x, y1: m.y, x2: f.x, y2: f.y, i })),
    )
    return { FILLER: filler, WEB: web }
  }, [seed, stars])

  /** Ponto de "acendimento" de cada cena ao longo do scroll (0–1). */
  const revealAt = (i: number) => (SCENES > 1 ? 0.05 + 0.92 * (i / (SCENES - 1)) : 0.05)
  const litOf = (prog: number, i: number) => clamp((prog - (revealAt(i) - 0.07)) / 0.09)

  // cena ativa (última acesa) → legenda no lower-third
  let active = 0
  for (let i = 0; i < SCENES; i++) if (p >= revealAt(i) - 0.03) active = i
  const onFinale = !!finale && active === N

  // presença da estrela final (fade-in ao chegar na última cena)
  const pp = finale ? clamp((p - (revealAt(N) - 0.14)) / 0.14) : 0
  // traço tracejado do último momento até a estrela final
  const last = stars[N - 1]
  const dashFrac =
    finale && N > 0 && SCENES > 1
      ? clamp((p - revealAt(N - 1)) / (revealAt(N) - revealAt(N - 1)))
      : 0

  // céu ainda sem estrela nenhuma: uma tela só, sem jornada de rolagem
  const height =
    SCENES === 0 ? '100lvh' : `calc(var(--scene-h, 56vh) * ${Math.max(SCENES, 2)} + 44vh)`

  /**
   * O quadro do céu segue a proporção da caixa onde ele está. Com um viewBox
   * fixo (100x44) e `meet`, uma caixa mais larga que isso escala o desenho pela
   * ALTURA e sobra faixa vazia dos dois lados — a constelação nunca chegava na
   * borda por mais que eu empurrasse as estrelas. Aqui a largura continua sendo
   * 0–100 (é nela que as estrelas são posicionadas) e é a altura do quadro que
   * se ajusta, sempre centrada na linha de base do céu: o desenho ocupa a caixa
   * inteira, de ponta a ponta, e as estrelas continuam redondas.
   */
  const skyRef = useRef<HTMLDivElement>(null)
  const [sky, setSky] = useState({ w: 0, h: 0 })
  const skyH = sky.w > 0 ? (100 * sky.h) / sky.w : 44

  useEffect(() => {
    const el = skyRef.current
    if (!el) return
    const fit = () => {
      const { width, height } = el.getBoundingClientRect()
      if (width > 0 && height > 0) setSky({ w: width, h: height })
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // 22 é o meio do céu antigo: o quadro cresce e encolhe em volta dele
  const skyBox = `${-GLOW_PAD} ${(22 - skyH / 2 - GLOW_PAD).toFixed(2)} ${100 + GLOW_PAD * 2} ${(
    skyH +
    GLOW_PAD * 2
  ).toFixed(2)}`
  // a mesma folga, em pixels: o svg transborda a caixa exatamente nessa medida
  const padPx = (sky.w / 100) * GLOW_PAD

  return (
    <section
      id="ceu"
      ref={sectionRef}
      style={{ height }}
      className="relative"
    >
      <div className="sticky top-0 flex h-[100lvh] flex-col overflow-hidden">
        <p className="label absolute left-1/2 top-[3vh] -translate-x-1/2 text-mist sm:top-[9vh]">
          {label}
        </p>

        {/* céu / constelação: a caixa manda no tamanho, o svg preenche ela */}
        <div
          ref={skyRef}
          style={{ left: '3vw', right: '3vw' }}
          className="absolute top-[23vh] h-[20vh] sm:top-[15vh] sm:h-[46vh]"
        >
        <svg
          className="absolute"
          style={{
            left: -padPx,
            top: -padPx,
            width: sky.w + padPx * 2,
            height: sky.h + padPx * 2,
          }}
          viewBox={skyBox}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            {/*
              O brilho das estrelas é um gradiente que já nasce desfocado, no
              lugar de um círculo com feGaussianBlur: o filtro era refeito a cada
              quadro da rolagem (a opacidade muda o tempo todo) e era o que mais
              pesava no céu. O raio do círculo cresce pra cobrir o que o desfoque
              espalhava.
            */}
            {[
              [bloomAccent, accent],
              [bloomWarm, '#fff3d6'],
            ].map(([id, c]) => (
              <radialGradient key={id} id={id}>
                <stop offset="0" stopColor={c} stopOpacity="1" />
                <stop offset="0.25" stopColor={c} stopOpacity="0.9" />
                <stop offset="0.5" stopColor={c} stopOpacity="0.5" />
                <stop offset="0.78" stopColor={c} stopOpacity="0.12" />
                <stop offset="1" stopColor={c} stopOpacity="0" />
              </radialGradient>
            ))}
            {/* espículas de difração (brilho em cruz), desbotando nas pontas */}
            <linearGradient id="spikeH" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff6e2" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff6e2" stopOpacity="0.95" />
              <stop offset="1" stopColor="#fff6e2" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="spikeV" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff6e2" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff6e2" stopOpacity="0.95" />
              <stop offset="1" stopColor="#fff6e2" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* teia de apoio */}
          {WEB.map((seg, k) => (
            <line
              key={`w${k}`}
              x1={seg.x1}
              y1={seg.y1}
              x2={seg.x2}
              y2={seg.y2}
              stroke="#8b91a6"
              strokeWidth={0.12}
              opacity={litOf(p, seg.i) * 0.16}
            />
          ))}

          {/* estrelas de apoio */}
          {FILLER.map((f, k) => (
            <circle
              key={`f${k}`}
              cx={f.x}
              cy={f.y}
              r={f.r}
              fill="#f5f1e8"
              opacity={f.a * (0.35 + 0.65 * p)}
              className={f.twinkle && !reduced ? 'animate-twinkle' : undefined}
              style={
                f.twinkle && !reduced
                  ? { animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }
                  : undefined
              }
            />
          ))}

          {/* linhas-mestras entre os momentos: o traço nítido (o brilho largo em volta, sem
              o filtro de desfoque que pesava, virava uma faixa de borda dura) */}
          {stars.slice(0, -1).map((m, i) => {
            const next = stars[i + 1]
            const frac = clamp((p - revealAt(i)) / (revealAt(i + 1) - revealAt(i)))
            return (
              <g key={`l${i}`}>
                <line
                  x1={m.x}
                  y1={m.y}
                  x2={next.x}
                  y2={next.y}
                  pathLength={1}
                  stroke={accent}
                  strokeWidth={0.28}
                  strokeLinecap="round"
                  strokeDasharray={1}
                  strokeDashoffset={1 - frac}
                  opacity={0.6}
                />
              </g>
            )
          })}

          {/* trilha do último momento até a estrela final — a que finalmente se fechou */}
          {finale && last && (
            <line
              x1={last.x}
              y1={last.y}
              x2={finale.x}
              y2={finale.y}
              pathLength={1}
              stroke={accent}
              strokeWidth={0.28}
              strokeLinecap="round"
              strokeDasharray={1}
              strokeDashoffset={1 - dashFrac}
              opacity={0.6}
            />
          )}

          {/* estrelas principais (sparkles) */}
          {stars.map((m, i) => {
            const lit = litOf(p, i)
            const R = (0.9 + lit * 1.7) * K
            const L = (1.6 + lit * 3.2) * K
            return (
              <g key={`s${i}`}>
                {/* bloom em camadas (quente por fora, claro por dentro) */}
                <circle cx={m.x} cy={m.y} r={6.2 * K} fill={`url(#${bloomAccent})`} opacity={lit * 0.14} />
                <circle cx={m.x} cy={m.y} r={4.4 * K} fill={`url(#${bloomWarm})`} opacity={lit * 0.3} />
                {/* espículas de difração (brilho em cruz) */}
                {lit > 0.02 && (
                  <g opacity={lit}>
                    <rect
                      x={m.x - L}
                      y={m.y - 0.13 * K}
                      width={L * 2}
                      height={0.26 * K}
                      fill="url(#spikeH)"
                    />
                    <rect
                      x={m.x - 0.13 * K}
                      y={m.y - L}
                      width={0.26 * K}
                      height={L * 2}
                      fill="url(#spikeV)"
                    />
                  </g>
                )}
                {/* corpo de 4 pontas */}
                <path
                  d={sparkle(m.x, m.y, R)}
                  fill={body}
                  opacity={lit * 0.95}
                  className={lit > 0.92 && !reduced ? 'animate-twinkle' : undefined}
                  style={{ transformOrigin: `${m.x}px ${m.y}px` }}
                />
                {/* núcleo brilhante */}
                <circle cx={m.x} cy={m.y} r={0.55 * K} fill="#ffffff" opacity={lit} />
                {!reduced && i === active && !onFinale && (
                  <circle cx={m.x} cy={m.y} r={1.4 * K} fill="none" stroke={accent} strokeWidth={0.22 * K}>
                    <animate attributeName="r" from={1.4 * K} to={8 * K} dur="2.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.55" to="0" dur="2.6s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            )
          })}

          {/* a estrela final — a que finalmente acendeu, mais forte que todas */}
          {finale && (
            <g>
              {/* bloom em camadas, maior e mais quente que as demais */}
              <circle cx={finale.x} cy={finale.y} r={8 * K} fill={`url(#${bloomAccent})`} opacity={pp * 0.22} />
              <circle cx={finale.x} cy={finale.y} r={5.4 * K} fill={`url(#${bloomWarm})`} opacity={pp * 0.38} />
              {/* espículas de difração — mais longas que as outras estrelas */}
              {pp > 0.02 && (
                <g opacity={pp}>
                  <rect
                    x={finale.x - (2.2 + pp * 4.6) * K}
                    y={finale.y - 0.16 * K}
                    width={(2.2 + pp * 4.6) * 2 * K}
                    height={0.32 * K}
                    fill="url(#spikeH)"
                  />
                  <rect
                    x={finale.x - 0.16 * K}
                    y={finale.y - (2.2 + pp * 4.6) * K}
                    width={0.32 * K}
                    height={(2.2 + pp * 4.6) * 2 * K}
                    fill="url(#spikeV)"
                  />
                </g>
              )}
              {/* corpo de 4 pontas, maior que o dos momentos */}
              <path
                d={sparkle(finale.x, finale.y, (1.1 + pp * 2.5) * K)}
                fill={body}
                opacity={pp * 0.98}
                className={pp > 0.9 && !reduced ? 'animate-twinkle' : undefined}
                style={{ transformOrigin: `${finale.x}px ${finale.y}px` }}
              />
              {/* núcleo brilhante */}
              <circle cx={finale.x} cy={finale.y} r={0.7 * K} fill="#ffffff" opacity={pp} />
              {/* pulso comemorativo do "sim" */}
              {!reduced && pp > 0.35 && (
                <circle cx={finale.x} cy={finale.y} r={1.6 * K} fill="none" stroke={accent} strokeWidth={0.2 * K} opacity={pp}>
                  <animate attributeName="r" from={1.6 * K} to={9.5 * K} dur="2.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.5" to="0" dur="2.8s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          )}
        </svg>
        </div>

        {/* scrim: garante leitura do texto sobre o céu (legenda de cinema) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[82vh] bg-gradient-to-t from-night via-night/95 to-transparent" />

        {finale?.figure === 'exu' && <ExuFigure opacity={pp} reduced={reduced} />}

        {/* lower-third: no mobile vira uma caixa delimitada (topo abaixo do céu, base acima
            da borda) com o texto centralizado, pra nunca vazar; no desktop, ancorado embaixo. */}
        <div className="absolute inset-x-0 bottom-[3vh] top-[24vh] flex flex-col justify-end px-4 sm:bottom-[6vh] sm:top-auto sm:block sm:px-6">
          {SCENES === 0 ? (
            emptyNote && (
              <div className="mx-auto max-w-md animate-title-in pb-[6vh] text-center sm:pb-0">
                <p className="font-display text-xl font-light italic leading-snug text-ember/90 sm:text-2xl">
                  {emptyNote}
                </p>
              </div>
            )
          ) : onFinale && finale ? (
            <div key="finale" className="mx-auto max-w-xl animate-title-in text-center">
              <p className="label inline-block rounded-full bg-night-deep/90 px-4 py-1.5 text-ember/90 shadow-[0_0_20px_6px_rgba(4,5,11,0.8)] ring-1 ring-white/10">
                {finale.label}
                <span className="mx-2 text-mist">·</span>
                {fmtDate(finale.date)}
              </p>
              <h2 className="mt-2 font-display text-[1.7rem] font-light leading-tight text-star sm:mt-3 sm:text-5xl">
                {finale.title}
              </h2>
              <div className="no-scrollbar mx-auto mt-3 max-h-[38vh] max-w-2xl overflow-y-auto overscroll-contain px-4 py-3 sm:max-h-[42vh] sm:px-6 sm:py-4">
                <p
                  className="whitespace-pre-line text-[0.8rem] leading-[1.55] text-mist sm:text-[0.95rem] sm:leading-relaxed"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.7)' }}
                >
                  {highlightSacred(finale.description)}
                </p>
              </div>
              {finale.outro && (
                <p
                  className="mt-4 whitespace-pre-line font-display text-lg italic leading-snug text-ember sm:text-xl"
                  style={{ textShadow: '0 1px 12px rgba(0,0,0,0.85)' }}
                >
                  {finale.outro}
                </p>
              )}
            </div>
          ) : (
            <div key={active} className="mx-auto max-w-xl animate-title-in text-center">
              <p className="label inline-block rounded-full bg-night-deep/90 px-4 py-1.5 text-ember/90 shadow-[0_0_20px_6px_rgba(4,5,11,0.8)] ring-1 ring-white/10">
                {(active + 1).toString().padStart(2, '0')} / {N.toString().padStart(2, '0')}
                <span className="mx-2 text-mist">·</span>
                {fmtDate(stars[active].date)}
              </p>
              <h2 className="mt-2 font-display text-[1.7rem] font-light leading-tight text-star sm:mt-3 sm:text-5xl">
                {stars[active].title}
              </h2>
              <div className="no-scrollbar mx-auto mt-3 max-h-[42vh] max-w-2xl overflow-y-auto overscroll-contain px-4 py-3 sm:max-h-[46vh] sm:px-6 sm:py-4">
                <p
                  className="whitespace-pre-line text-[0.8rem] leading-[1.55] text-mist sm:text-[0.95rem] sm:leading-relaxed"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.7)' }}
                >
                  {highlightSacred(stars[active].description)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
