import { useEffect, useRef, useState, type RefObject } from 'react'
import { milestones } from '../data'

const dateFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
const fmtDate = (d: Date) =>
  dateFmt
    .format(d)
    .replace(/\sde\s/g, ' ')
    .replace('.', '')

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))

/** A estrela do pedido: o 7º ponto da constelação, que ainda não acendeu. */
const PROPOSAL = {
  x: 91,
  y: 17,
  label: 'a estrela que ainda vai nascer',
  title: 'O pedido de namoro',
  description:
    'Essa é a única estrela desse céu que ainda não acendeu. Ela espera o dia em que eu vou te pedir em namoro de verdade. E quando esse dia chegar, vai brilhar mais forte que todas.',
  outro: 'ainda não rolou. mas é só questão de tempo.',
}

/** Saturno: planeta com anéis, perto do pedido (os "anéis" ↔ aliança). */
const SAT = { x: 78, y: 27, r: 3.9, tilt: -17 }
/** Faixas dos anéis (múltiplos do raio do planeta), com folga tipo Cassini. */
const SAT_RINGS = [
  { k: 2.55, ky: 0.68, w: 0.32, op: 0.42, c: '#d9b06a' }, // anel A (externo)
  { k: 2.05, ky: 0.54, w: 0.75, op: 0.82, c: '#f2dca6' }, // anel B (mais brilhante)
  { k: 1.72, ky: 0.45, w: 0.42, op: 0.5, c: '#e6c07a' }, // B interno
  { k: 1.42, ky: 0.37, w: 0.28, op: 0.34, c: '#c9a55e' }, // anel C (tênue)
]

const N = milestones.length
const SCENES = N + 1 // 6 momentos + o pedido

/** Ponto de "acendimento" de cada cena ao longo do scroll (0–1). */
const revealAt = (i: number) => 0.05 + 0.92 * (i / (SCENES - 1))
const litOf = (p: number, i: number) => clamp((p - (revealAt(i) - 0.07)) / 0.09)

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

/** Campo de estrelas de apoio espalhado pelo céu. */
const FILLER: FillerStar[] = (() => {
  const rng = mulberry32(20260606)
  return Array.from({ length: 56 }, () => ({
    x: 1 + rng() * 98,
    y: 0.5 + rng() * 43,
    r: 0.14 + rng() * 0.6,
    a: 0.1 + rng() * 0.4,
    twinkle: rng() > 0.7,
    dur: 2.6 + rng() * 3.4,
    delay: rng() * 4,
  }))
})()

/** "Teia": liga cada estrela principal às 2 estrelas de apoio mais próximas. */
const WEB = milestones.flatMap((m, i) =>
  [...FILLER]
    .map((f) => ({ f, d: (f.x - m.x) ** 2 + (f.y - m.y) ** 2 }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 2)
    .map(({ f }) => ({ x1: m.x, y1: m.y, x2: f.x, y2: f.y, i })),
)

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
      setP(total > 0 ? clamp(scrolled / total) : 0)
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

/** A viagem pelo céu: constelação que acende conforme a rolagem. */
export function NightJourney() {
  const sectionRef = useRef<HTMLElement>(null)
  const p = useSectionProgress(sectionRef)
  const reduced = reducedMotion()
  const [saturnOpen, setSaturnOpen] = useState(false)

  // trava o scroll do fundo com o modal aberto (e fecha no Esc)
  useEffect(() => {
    if (!saturnOpen) return
    const body = document.body
    const prevOverflow = body.style.overflow
    const prevPad = body.style.paddingRight
    const sbw = window.innerWidth - document.documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (sbw > 0) body.style.paddingRight = `${sbw}px`
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSaturnOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPad
      window.removeEventListener('keydown', onKey)
    }
  }, [saturnOpen])

  // cena ativa (última acesa) → legenda no lower-third
  let active = 0
  for (let i = 0; i < SCENES; i++) if (p >= revealAt(i) - 0.03) active = i
  const onProposal = active === N

  // presença da estrela do pedido (fade-in ao chegar na última cena)
  const pp = clamp((p - (revealAt(N) - 0.14)) / 0.14)
  // traço tracejado do último momento até o pedido
  const dashFrac = clamp((p - revealAt(N - 1)) / (revealAt(N) - revealAt(N - 1)))
  const last = milestones[N - 1]

  return (
    <section id="ceu" ref={sectionRef} style={{ height: `${SCENES * 56 + 8}vh` }} className="relative">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <p className="label absolute left-1/2 top-[9vh] -translate-x-1/2 text-mist">
          a nossa constelação
        </p>

        {/* céu / constelação */}
        <svg
          className="absolute inset-x-[8vw] top-[6vh] h-[20vh] sm:top-[15vh] sm:h-[46vh]"
          viewBox="0 0 100 44"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            <filter id="glow" x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur stdDeviation="1.6" />
            </filter>
            <filter id="softglow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="0.5" />
            </filter>
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
            {/* corpo de Saturno: esfera iluminada do canto superior esquerdo */}
            <radialGradient id="saturn" cx="0.38" cy="0.32" r="0.8">
              <stop offset="0" stopColor="#f4dca4" />
              <stop offset="0.55" stopColor="#d9b06a" />
              <stop offset="1" stopColor="#6b5330" />
            </radialGradient>
            {/* recorta o corpo do planeta (pra bandas) e a metade da frente dos anéis */}
            <clipPath id="saturnBody">
              <circle cx={SAT.x} cy={SAT.y} r={SAT.r} />
            </clipPath>
            <clipPath id="saturnFront">
              <rect x={SAT.x - SAT.r * 2.7} y={SAT.y} width={SAT.r * 5.4} height={SAT.r * 1.4} />
            </clipPath>
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

          {/* linhas-mestras entre os momentos: brilho largo + traço nítido */}
          {milestones.slice(0, -1).map((m, i) => {
            const next = milestones[i + 1]
            const frac = clamp((p - revealAt(i)) / (revealAt(i + 1) - revealAt(i)))
            return (
              <g key={`l${i}`}>
                <line
                  x1={m.x}
                  y1={m.y}
                  x2={next.x}
                  y2={next.y}
                  pathLength={1}
                  stroke="#e6c07a"
                  strokeWidth={1.1}
                  strokeLinecap="round"
                  strokeDasharray={1}
                  strokeDashoffset={1 - frac}
                  opacity={0.12}
                  filter="url(#softglow)"
                />
                <line
                  x1={m.x}
                  y1={m.y}
                  x2={next.x}
                  y2={next.y}
                  pathLength={1}
                  stroke="#e6c07a"
                  strokeWidth={0.28}
                  strokeLinecap="round"
                  strokeDasharray={1}
                  strokeDashoffset={1 - frac}
                  opacity={0.6}
                />
              </g>
            )
          })}

          {/* trilha tracejada do último momento até o pedido (o que ainda não foi) */}
          <line
            x1={last.x}
            y1={last.y}
            x2={PROPOSAL.x}
            y2={PROPOSAL.y}
            stroke="#8b91a6"
            strokeWidth={0.26}
            strokeLinecap="round"
            strokeDasharray="1.4 1.6"
            opacity={dashFrac * 0.5}
          />

          {/* estrelas principais (sparkles) */}
          {milestones.map((m, i) => {
            const lit = litOf(p, i)
            const R = 0.9 + lit * 1.7
            return (
              <g key={`s${i}`}>
                {/* bloom em camadas (quente por fora, claro por dentro) */}
                <circle cx={m.x} cy={m.y} r={3.6} fill="#e6c07a" opacity={lit * 0.14} filter="url(#glow)" />
                <circle cx={m.x} cy={m.y} r={2} fill="#fff3d6" opacity={lit * 0.34} filter="url(#glow)" />
                {/* espículas de difração (brilho em cruz) */}
                {lit > 0.02 && (
                  <g opacity={lit}>
                    <rect
                      x={m.x - (1.6 + lit * 3.2)}
                      y={m.y - 0.13}
                      width={(1.6 + lit * 3.2) * 2}
                      height={0.26}
                      fill="url(#spikeH)"
                    />
                    <rect
                      x={m.x - 0.13}
                      y={m.y - (1.6 + lit * 3.2)}
                      width={0.26}
                      height={(1.6 + lit * 3.2) * 2}
                      fill="url(#spikeV)"
                    />
                  </g>
                )}
                {/* corpo de 4 pontas */}
                <path
                  d={sparkle(m.x, m.y, R)}
                  fill="#fdf7ea"
                  opacity={lit * 0.95}
                  className={lit > 0.92 && !reduced ? 'animate-twinkle' : undefined}
                  style={{ transformOrigin: `${m.x}px ${m.y}px` }}
                />
                {/* núcleo brilhante */}
                <circle cx={m.x} cy={m.y} r={0.55} fill="#ffffff" opacity={lit} />
                {!reduced && i === active && (
                  <circle cx={m.x} cy={m.y} r={1.4} fill="none" stroke="#e6c07a" strokeWidth={0.22}>
                    <animate attributeName="r" from="1.4" to="8" dur="2.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.55" to="0" dur="2.6s" repeatCount="indefinite" />
                  </circle>
                )}
                <text
                  x={m.x}
                  y={m.y - 3.4}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize={2.1}
                  fill="#8b91a6"
                  opacity={lit * 0.7}
                >
                  {(i + 1).toString().padStart(2, '0')}
                </text>
              </g>
            )
          })}

          {/* Saturno — os "anéis" conversando com o pedido/aliança (clicável) */}
          <g
            opacity={pp}
            transform={`rotate(${SAT.tilt} ${SAT.x} ${SAT.y})`}
            onClick={() => pp > 0.4 && setSaturnOpen(true)}
            role="button"
            aria-label="Sobre os anéis de Saturno"
            style={{ cursor: pp > 0.4 ? 'pointer' : 'default' }}
          >
            {/* área de clique confortável (só ativa quando o Saturno está visível) */}
            <ellipse
              cx={SAT.x}
              cy={SAT.y}
              rx={SAT.r * 2.7}
              ry={SAT.r * 1.1}
              fill="#000"
              fillOpacity={0.001}
              pointerEvents={pp > 0.4 ? 'all' : 'none'}
            />
            {/* halo atmosférico */}
            <circle cx={SAT.x} cy={SAT.y} r={SAT.r * 1.7} fill="#e6c07a" opacity={0.12} filter="url(#glow)" />

            {/* anéis traseiros */}
            <g fill="none">
              {SAT_RINGS.map((r, i) => (
                <ellipse
                  key={`rb${i}`}
                  cx={SAT.x}
                  cy={SAT.y}
                  rx={SAT.r * r.k}
                  ry={SAT.r * r.ky}
                  stroke={r.c}
                  strokeWidth={r.w}
                  opacity={r.op}
                />
              ))}
            </g>

            {/* corpo do planeta + bandas + sombra dos anéis (recortado no disco) */}
            <g clipPath="url(#saturnBody)">
              <circle cx={SAT.x} cy={SAT.y} r={SAT.r} fill="url(#saturn)" />
              <ellipse cx={SAT.x} cy={SAT.y - SAT.r * 0.42} rx={SAT.r * 1.05} ry={SAT.r * 0.16} fill="#f6e0ac" opacity={0.3} />
              <ellipse cx={SAT.x} cy={SAT.y - SAT.r * 0.12} rx={SAT.r * 1.05} ry={SAT.r * 0.13} fill="#e9c882" opacity={0.25} />
              <ellipse cx={SAT.x} cy={SAT.y + SAT.r * 0.4} rx={SAT.r * 1.05} ry={SAT.r * 0.22} fill="#a97e46" opacity={0.3} />
              {/* sombra dos anéis projetada no planeta */}
              <ellipse cx={SAT.x} cy={SAT.y + SAT.r * 0.06} rx={SAT.r * 1.1} ry={SAT.r * 0.12} fill="#3a2b16" opacity={0.5} />
            </g>
            {/* limbo iluminado */}
            <circle cx={SAT.x} cy={SAT.y} r={SAT.r} fill="none" stroke="#f7e6bd" strokeWidth={0.12} opacity={0.4} />

            {/* anéis da frente (metade de baixo = perto, levemente translúcidos) */}
            <g fill="none" clipPath="url(#saturnFront)">
              {SAT_RINGS.map((r, i) => (
                <ellipse
                  key={`rf${i}`}
                  cx={SAT.x}
                  cy={SAT.y}
                  rx={SAT.r * r.k}
                  ry={SAT.r * r.ky}
                  stroke={r.c}
                  strokeWidth={r.w}
                  opacity={r.op * 0.9}
                />
              ))}
            </g>
          </g>
          {/* dica de que dá pra clicar (horizontal, fora do grupo rotacionado) */}
          <text
            x={SAT.x}
            y={SAT.y + SAT.r * 2.2}
            textAnchor="middle"
            className="font-mono"
            fontSize={1.7}
            letterSpacing="0.3"
            fill="#8b91a6"
            opacity={pp * 0.6}
            style={{ cursor: pp > 0.4 ? 'pointer' : 'default' }}
            pointerEvents={pp > 0.4 ? 'all' : 'none'}
            onClick={() => pp > 0.4 && setSaturnOpen(true)}
          >
            toque nos anéis
          </text>

          {/* a estrela do pedido — apagada, ainda se formando */}
          <g>
            <circle
              cx={PROPOSAL.x}
              cy={PROPOSAL.y}
              r={3}
              fill="#e6c07a"
              opacity={0.1 + pp * 0.18}
              filter="url(#glow)"
            />
            <circle cx={PROPOSAL.x} cy={PROPOSAL.y} r={0.7} fill="#fdf7ea" opacity={0.4 + pp * 0.4} />
            {!reduced && (
              <g opacity={0.3 + pp * 0.7}>
                <circle
                  cx={PROPOSAL.x}
                  cy={PROPOSAL.y}
                  r={1.2}
                  fill="none"
                  stroke="#e6c07a"
                  strokeWidth={0.16}
                >
                  <animate attributeName="r" from="1.2" to="5.5" dur="3.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.5" to="0" dur="3.6s" repeatCount="indefinite" />
                </circle>
                <g>
                  <circle cx={PROPOSAL.x + 3.4} cy={PROPOSAL.y} r={0.32} fill="#e6c07a" opacity={0.7} />
                  <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from={`0 ${PROPOSAL.x} ${PROPOSAL.y}`}
                    to={`360 ${PROPOSAL.x} ${PROPOSAL.y}`}
                    dur="18s"
                    repeatCount="indefinite"
                  />
                </g>
              </g>
            )}
          </g>
        </svg>

        {/* scrim: garante leitura do texto sobre o céu (legenda de cinema) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[72vh] bg-gradient-to-t from-night via-night/92 to-transparent" />

        {/* lower-third: no mobile vira uma caixa delimitada (topo abaixo do céu, base acima
            da borda) com o texto centralizado, pra nunca vazar; no desktop, ancorado embaixo. */}
        <div className="absolute inset-x-0 bottom-[3vh] top-[27vh] flex flex-col justify-center px-6 sm:bottom-[7vh] sm:top-auto sm:block">
          {onProposal ? (
            <div key="proposal" className="mx-auto max-w-xl animate-title-in text-center">
              <p className="label text-ember/80">{PROPOSAL.label}</p>
              <h2 className="mt-3 font-display text-3xl font-light leading-tight text-star sm:text-5xl">
                {PROPOSAL.title}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-mist sm:text-base">
                {PROPOSAL.description}
              </p>
              <p className="mt-4 font-display text-lg font-light italic text-ember/90">
                {PROPOSAL.outro}
              </p>
            </div>
          ) : (
            <div key={active} className="mx-auto max-w-xl animate-title-in text-center">
              <p className="label text-ember/80">
                {(active + 1).toString().padStart(2, '0')} / {N.toString().padStart(2, '0')}
                <span className="mx-2 text-mist">·</span>
                {fmtDate(milestones[active].date)}
              </p>
              <h2 className="mt-2 font-display text-[1.7rem] font-light leading-tight text-star sm:mt-3 sm:text-5xl">
                {milestones[active].title}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl whitespace-pre-line text-[0.78rem] leading-[1.5] text-mist sm:text-[0.95rem] sm:leading-relaxed">
                {milestones[active].description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* modal dos anéis de Saturno ↔ aliança */}
      {saturnOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-night-deep/85 px-6 backdrop-blur-sm"
          onClick={() => setSaturnOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-lg animate-title-in border border-ember/25 bg-night-soft/95 px-8 py-12 text-center sm:px-12"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSaturnOpen(false)}
              aria-label="Fechar"
              className="label absolute right-5 top-5 text-mist transition-colors hover:text-star"
            >
              fechar
            </button>
            <p className="label text-ember/80">os anéis de saturno</p>
            <h3 className="mt-4 font-display text-3xl font-light leading-tight text-star sm:text-4xl">
              Um anel que atravessa o tempo
            </h3>
            <p className="mx-auto mt-6 max-w-md leading-relaxed text-mist">
              Os anéis de Saturno são gelo e poeira girando há bilhões de anos, sem nunca se
              desfazer. É esse tipo de anel que eu quero te dar: não um qualquer, mas uma aliança
              que não se desfaz, a que um dia vai selar o que essas estrelas já sabem.
            </p>
            <p className="mt-5 font-display text-lg font-light italic text-ember/90">
              Saturno carrega os dele há uma eternidade. Eu só quero começar os nossos.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
