import { useEffect, useRef, useState, type RefObject } from 'react'
import { milestones } from '../data'

const dateFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
const fmtDate = (d: Date) =>
  dateFmt
    .format(d)
    .replace(/\sde\s/g, ' ')
    .replace('.', '')

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))

/** A estrela do pedido: o ponto que finalmente acendeu, em 23/07/2026. */
const PROPOSAL = {
  x: 92,
  y: 13,
  date: new Date(2026, 6, 23), // 23/07/2026 — o dia do sim
  label: 'a estrela que finalmente acendeu',
  title: 'O pedido de namoro',
  description: `Eu não aguentava mais de tanto que eu queria isso. Te levei pra praia, e minha mão tremia igual no dia que eu te chamei pra sair pela primeira vez. Te dei o buquê e me declarei, falei tudo de novo: de ti, de nós, do tamanho da minha certeza. E aí eu vi uma coisa que eu vou guardar pra vida toda: o teu olho enchendo. Tu, que é tão difícil de chorar, quase chorando por mim. Eu quase fui junto.
E quando tu disse sim, o céu inteiro respondeu. Eu saudei Seo Tranca Rua das Almas do fundo do peito e tu viu o que aconteceu. Eu soube na hora que era ele. Que a bênção que ele deu nas nossas alianças tinha descido em carne e osso, só pra jurar que tá tudo certo, que o caminho é nosso e ninguém tira. Eu tava tremendo por dentro, e não era nervoso, era axé.
Voltamos cantando ponto o trajeto todo, e eu ria sozinho de tão feliz. Porque essa estrela que eu deixei esperando aqui no céu, finalmente se acendeu. E ela brilha mais forte que todas.`,
  outro: `tu disse sim.
Laroyê, Exu. Salve Seo Tranca Rua das Almas, obrigado por guardar a gente.`,
}

const N = milestones.length
const SCENES = N + 1 // os momentos + a estrela do pedido

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

/** A viagem pelo céu: constelação que acende conforme a rolagem. */
export function NightJourney() {
  const sectionRef = useRef<HTMLElement>(null)
  const p = useSectionProgress(sectionRef)
  const reduced = reducedMotion()
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
    <section
      id="ceu"
      ref={sectionRef}
      style={{ height: `calc(var(--scene-h, 56vh) * ${SCENES} + 44vh)` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <p className="label absolute left-1/2 top-[3vh] -translate-x-1/2 text-mist sm:top-[9vh]">
          a nossa constelação
        </p>

        {/* céu / constelação */}
        <svg
          className="absolute inset-x-[8vw] top-[11vh] h-[20vh] sm:top-[15vh] sm:h-[46vh]"
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

          {/* trilha do último momento até o pedido — a que finalmente se fechou */}
          <line
            x1={last.x}
            y1={last.y}
            x2={PROPOSAL.x}
            y2={PROPOSAL.y}
            pathLength={1}
            stroke="#e6c07a"
            strokeWidth={0.28}
            strokeLinecap="round"
            strokeDasharray={1}
            strokeDashoffset={1 - dashFrac}
            opacity={0.6}
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
              </g>
            )
          })}

          {/* a estrela do pedido — a que finalmente acendeu, mais forte que todas */}
          <g>
            {/* bloom em camadas, maior e mais quente que as demais */}
            <circle cx={PROPOSAL.x} cy={PROPOSAL.y} r={5.6} fill="#e6c07a" opacity={pp * 0.22} filter="url(#glow)" />
            <circle cx={PROPOSAL.x} cy={PROPOSAL.y} r={3} fill="#fff3d6" opacity={pp * 0.42} filter="url(#glow)" />
            {/* espículas de difração — mais longas que as outras estrelas */}
            {pp > 0.02 && (
              <g opacity={pp}>
                <rect
                  x={PROPOSAL.x - (2.2 + pp * 4.6)}
                  y={PROPOSAL.y - 0.16}
                  width={(2.2 + pp * 4.6) * 2}
                  height={0.32}
                  fill="url(#spikeH)"
                />
                <rect
                  x={PROPOSAL.x - 0.16}
                  y={PROPOSAL.y - (2.2 + pp * 4.6)}
                  width={0.32}
                  height={(2.2 + pp * 4.6) * 2}
                  fill="url(#spikeV)"
                />
              </g>
            )}
            {/* corpo de 4 pontas, maior que o dos momentos */}
            <path
              d={sparkle(PROPOSAL.x, PROPOSAL.y, 1.1 + pp * 2.5)}
              fill="#fdf7ea"
              opacity={pp * 0.98}
              className={pp > 0.9 && !reduced ? 'animate-twinkle' : undefined}
              style={{ transformOrigin: `${PROPOSAL.x}px ${PROPOSAL.y}px` }}
            />
            {/* núcleo brilhante */}
            <circle cx={PROPOSAL.x} cy={PROPOSAL.y} r={0.7} fill="#ffffff" opacity={pp} />
            {/* pulso comemorativo do "sim" */}
            {!reduced && pp > 0.35 && (
              <circle cx={PROPOSAL.x} cy={PROPOSAL.y} r={1.6} fill="none" stroke="#e6c07a" strokeWidth={0.2} opacity={pp}>
                <animate attributeName="r" from="1.6" to="9.5" dur="2.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.5" to="0" dur="2.8s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        </svg>

        {/* scrim: garante leitura do texto sobre o céu (legenda de cinema) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[82vh] bg-gradient-to-t from-night via-night/95 to-transparent" />

        {/* o compadre — arte noir do Seo Tranca Rua das Almas (SVG do João), à direita
            do texto, de perfil. só o cenário foi removido; acende com a estrela do
            pedido e a única cor viva é a brasa do charuto */}
        <svg
          className="pointer-events-none absolute bottom-[2vh] right-[-1vw] h-[56vh] sm:right-[11vw] sm:h-[92vh]"
          viewBox="235 75 465 1000"
          preserveAspectRatio="xMidYMax meet"
          aria-hidden
          style={{ opacity: pp }}
        >
          <defs>
            <radialGradient id="emberGlowBig" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#ff8c2e" stopOpacity="0.5" />
              <stop offset="0.4" stopColor="#e0501a" stopOpacity="0.22" />
              <stop offset="1" stopColor="#e0501a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="emberGlowSmall" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#ffd98c" stopOpacity="0.9" />
              <stop offset="0.5" stopColor="#ff8c2e" stopOpacity="0.45" />
              <stop offset="1" stopColor="#ff8c2e" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="shaftLit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ff8c3a" stopOpacity="0" />
              <stop offset="0.37" stopColor="#f08238" stopOpacity="0.9" />
              <stop offset="0.7" stopColor="#b05a24" stopOpacity="0.35" />
              <stop offset="1" stopColor="#b05a24" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="barLit" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#f08238" stopOpacity="0.85" />
              <stop offset="1" stopColor="#f08238" stopOpacity="0" />
            </linearGradient>
            <clipPath id="faceFront">
              <rect x="402" y="230" width="86" height="132" />
            </clipPath>
          </defs>

          {/* glow grande da brasa (ilumina o fundo atrás dele) */}
          <circle cx="457" cy="324" r="230" fill="url(#emberGlowBig)" />
          {/* sombra no chão */}
          <ellipse cx="405" cy="1036" rx="150" ry="13" fill="#000000" opacity="0.4" />
          <ellipse cx="606" cy="1036" rx="34" ry="7" fill="#000000" opacity="0.35" />

          {/* figura inteira (levemente inclinada) */}
          <g transform="rotate(-4 390 1031)">
            {/* tridente de Exu empunhado */}
            <g transform="translate(470,0) rotate(-3 610 1035)" fill="#0b0b12">
              <rect x="134" y="112" width="12" height="944" rx="3" />
              <rect x="96" y="198" width="88" height="13" rx="4" />
              <rect x="96" y="130" width="12" height="72" />
              <rect x="172" y="130" width="12" height="72" />
              <path d="M102,94 L118,134 L86,134 Z" />
              <path d="M178,94 L194,134 L162,134 Z" />
              <path d="M140,74 L157,114 L123,114 Z" />
              {/* barra do meio (esquerda sobe, direita desce) — subida pra zona iluminada */}
              <rect x="92" y="400" width="96" height="12" />
              <rect x="92" y="362" width="12" height="50" />
              <rect x="176" y="400" width="12" height="58" />
              {/* luz da brasa nas faces do metal */}
              <rect x="134" y="215" width="4.5" height="315" fill="url(#shaftLit)" />
              <rect x="92" y="400" width="96" height="4" fill="url(#barLit)" />
              <rect x="92" y="362" width="4" height="50" fill="#f08238" opacity="0.6" />
              <rect x="92" y="362" width="12" height="3.5" fill="#f08238" opacity="0.75" />
              <rect x="176" y="412" width="3.5" height="44" fill="#f08238" opacity="0.22" />
            </g>

            {/* silhueta */}
            <g fill="#060609">
              <path d="M366,364 L304,308 L284,330 L344,394 Z" />
              <path d="M356,362 C324,372 296,384 284,402 C270,426 263,470 262,530
                       C260,670 256,810 248,948 L276,932 L298,954 L320,932 L338,950
                       C346,860 348,760 346,660 L344,600 C344,520 348,440 356,362 Z" />
              <path d="M362,356 C336,364 310,376 300,396 C288,432 292,505 306,580
                       C312,628 320,668 330,695 L430,703 C434,622 438,530 432,462
                       C434,415 410,366 392,354 Z" />
              <path d="M400,392 C428,412 448,448 458,492 C472,520 500,556 540,584
                       L582,606 L570,632 C525,610 488,580 452,540 C436,516 424,478 408,440 Z" />
              <path d="M340,685 L392,692 L396,990 L448,1004 Q466,1028 440,1031
                       L368,1031 Q354,1030 360,1012 L344,995 Z" />
              <path d="M398,694 L430,703 L378,900 L356,985 L356,1012 L344,1036
                       Q338,1044 327,1039 L314,1030 L326,1000 L324,972 L344,905 Z" />
              <path id="headProfile"
                    d="M334,228 C316,252 312,288 324,316 C330,338 342,352 360,360
                       L392,357 C402,356 412,354 420,357 C430,360 436,352 433,344
                       C437,338 439,332 434,326 L440,320 L432,317 L440,309 L437,303
                       C438,296 441,292 447,290 C449,285 446,280 441,277
                       C438,270 431,262 422,254 C418,247 411,240 403,234
                       C396,229 388,226 380,226 C362,224 346,224 334,228 Z" />
              <g transform="translate(-8,16) rotate(7 375 212)">
                <ellipse cx="375" cy="212" rx="88" ry="15" />
                <path d="M323,212 L328,105 Q328,92 346,90 L404,90 Q422,92 422,105 L427,212 Z" />
              </g>
              <ellipse cx="585" cy="618" rx="22" ry="20" />
            </g>

            {/* brasa */}
            <circle cx="506" cy="330" r="60" fill="url(#emberGlowSmall)" />
            <circle cx="506" cy="330" r="9" fill="#e0501a" />
            <circle cx="506" cy="330" r="6" fill="#ff9a3d" />
            <circle cx="507" cy="329" r="3" fill="#ffe9a8" />

            {/* fumaça — ondula subindo (morfa o próprio d; a onda viaja pra cima) */}
            <g fill="none" stroke="#c9c2bb" strokeLinecap="round">
              <path strokeWidth="7" opacity="0.14" d="M504.0,313.0 C504.0,303.0 500.6,293.1 500.6,283.1 C500.6,273.2 500.6,263.2 500.6,253.3 C500.6,243.3 508.5,233.4 508.5,223.4 C508.5,213.5 513.5,203.5 513.5,193.6 C513.5,183.6 504.4,173.7 504.4,163.7 C504.4,153.8 490.8,143.8 490.8,133.9 C490.8,123.9 493.9,114.0 493.9,104.0">
                {!reduced && (
                  <>
                    <animate attributeName="d" dur="8s" repeatCount="indefinite" calcMode="spline"
                      keyTimes="0;0.25;0.5;0.75;1"
                      keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1"
                      values="M504.0,313.0 C504.0,303.0 500.6,293.1 500.6,283.1 C500.6,273.2 500.6,263.2 500.6,253.3 C500.6,243.3 508.5,233.4 508.5,223.4 C508.5,213.5 513.5,203.5 513.5,193.6 C513.5,183.6 504.4,173.7 504.4,163.7 C504.4,153.8 490.8,143.8 490.8,133.9 C490.8,123.9 493.9,114.0 493.9,104.0;M504.0,313.0 C504.0,303.0 505.1,293.1 505.1,283.1 C505.1,273.2 499.4,263.2 499.4,253.3 C499.4,243.3 497.6,233.4 497.6,223.4 C497.6,213.5 506.8,203.5 506.8,193.6 C506.8,183.6 516.0,173.7 516.0,163.7 C516.0,153.8 508.9,143.8 508.9,133.9 C508.9,123.9 491.4,114.0 491.4,104.0;M504.0,313.0 C504.0,303.0 507.4,293.1 507.4,283.1 C507.4,273.2 507.4,263.2 507.4,253.3 C507.4,243.3 499.5,233.4 499.5,223.4 C499.5,213.5 494.5,203.5 494.5,193.6 C494.5,183.6 503.6,173.7 503.6,163.7 C503.6,153.8 517.2,143.8 517.2,133.9 C517.2,123.9 514.1,114.0 514.1,104.0;M504.0,313.0 C504.0,303.0 502.9,293.1 502.9,283.1 C502.9,273.2 508.6,263.2 508.6,253.3 C508.6,243.3 510.4,233.4 510.4,223.4 C510.4,213.5 501.2,203.5 501.2,193.6 C501.2,183.6 492.0,173.7 492.0,163.7 C492.0,153.8 499.1,143.8 499.1,133.9 C499.1,123.9 516.6,114.0 516.6,104.0;M504.0,313.0 C504.0,303.0 500.6,293.1 500.6,283.1 C500.6,273.2 500.6,263.2 500.6,253.3 C500.6,243.3 508.5,233.4 508.5,223.4 C508.5,213.5 513.5,203.5 513.5,193.6 C513.5,183.6 504.4,173.7 504.4,163.7 C504.4,153.8 490.8,143.8 490.8,133.9 C490.8,123.9 493.9,114.0 493.9,104.0" />
                    <animate attributeName="opacity" values="0.16;0.09;0.16" dur="8s" repeatCount="indefinite" />
                  </>
                )}
              </path>
              <path strokeWidth="4" opacity="0.1" d="M510.0,309.0 C510.0,298.9 509.2,288.9 509.2,278.8 C509.2,268.8 505.0,258.7 505.0,248.7 C505.0,238.6 508.7,228.6 508.7,218.5 C508.7,208.4 518.1,198.4 518.1,188.3 C518.1,178.3 516.3,168.2 516.3,158.2 C516.3,148.1 501.7,138.1 501.7,128.0">
                {!reduced && (
                  <>
                    <animate attributeName="d" dur="6.4s" repeatCount="indefinite" calcMode="spline"
                      keyTimes="0;0.25;0.5;0.75;1"
                      keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1"
                      values="M510.0,309.0 C510.0,298.9 509.2,288.9 509.2,278.8 C509.2,268.8 505.0,258.7 505.0,248.7 C505.0,238.6 508.7,228.6 508.7,218.5 C508.7,208.4 518.1,198.4 518.1,188.3 C518.1,178.3 516.3,168.2 516.3,158.2 C516.3,148.1 501.7,138.1 501.7,128.0;M510.0,309.0 C510.0,298.9 513.0,288.9 513.0,278.8 C513.0,268.8 509.9,258.7 509.9,248.7 C509.9,238.6 503.2,228.6 503.2,218.5 C503.2,208.4 506.5,198.4 506.5,188.3 C506.5,178.3 518.6,168.2 518.6,158.2 C518.6,148.1 519.5,138.1 519.5,128.0;M510.0,309.0 C510.0,298.9 510.8,288.9 510.8,278.8 C510.8,268.8 515.0,258.7 515.0,248.7 C515.0,238.6 511.3,228.6 511.3,218.5 C511.3,208.4 501.9,198.4 501.9,188.3 C501.9,178.3 503.7,168.2 503.7,158.2 C503.7,148.1 518.3,138.1 518.3,128.0;M510.0,309.0 C510.0,298.9 507.0,288.9 507.0,278.8 C507.0,268.8 510.1,258.7 510.1,248.7 C510.1,238.6 516.8,228.6 516.8,218.5 C516.8,208.4 513.5,198.4 513.5,188.3 C513.5,178.3 501.4,168.2 501.4,158.2 C501.4,148.1 500.5,138.1 500.5,128.0;M510.0,309.0 C510.0,298.9 509.2,288.9 509.2,278.8 C509.2,268.8 505.0,258.7 505.0,248.7 C505.0,238.6 508.7,228.6 508.7,218.5 C508.7,208.4 518.1,198.4 518.1,188.3 C518.1,178.3 516.3,168.2 516.3,158.2 C516.3,148.1 501.7,138.1 501.7,128.0" />
                    <animate attributeName="opacity" values="0.11;0.05;0.11" dur="6.4s" repeatCount="indefinite" />
                  </>
                )}
              </path>
            </g>

            {/* rim light quente no perfil */}
            <g clipPath="url(#faceFront)">
              <use href="#headProfile" fill="none" stroke="#ff8c3a" strokeWidth="3.5" opacity="0.85" strokeLinecap="round" />
            </g>
            <g fill="none" stroke="#ff8c3a" strokeLinecap="round">
              <path d="M432,462 C437,520 436,580 431,640" strokeWidth="3" opacity="0.15" />
              <path d="M362,360 L308,312" strokeWidth="2.5" opacity="0.3" stroke="#c46a2e" />
              <path d="M470,540 C510,570 545,590 575,605" strokeWidth="3" opacity="0.25" />
              <path d="M566,610 Q584,601 602,611" strokeWidth="3" opacity="0.5" />
            </g>

            {/* charuto encaixado na boca */}
            <path d="M434,311 L504,324 L502,337 L432,322 Z" fill="#151011" />
            <path d="M438,314 L500,326" stroke="#ff8c3a" strokeWidth="2.5" opacity="0.75" fill="none" strokeLinecap="round" />
          </g>
        </svg>

        {/* lower-third: no mobile vira uma caixa delimitada (topo abaixo do céu, base acima
            da borda) com o texto centralizado, pra nunca vazar; no desktop, ancorado embaixo. */}
        <div className="absolute inset-x-0 bottom-[3vh] top-[24vh] flex flex-col justify-end px-4 sm:bottom-[6vh] sm:top-auto sm:block sm:px-6">
          {onProposal ? (
            <div key="proposal" className="mx-auto max-w-xl animate-title-in text-center">
              <p className="label inline-block rounded-full bg-night-deep/80 px-4 py-1.5 text-ember/90 shadow-[0_0_20px_6px_rgba(4,5,11,0.8)] ring-1 ring-white/10 backdrop-blur-md">
                {PROPOSAL.label}
                <span className="mx-2 text-mist">·</span>
                {fmtDate(PROPOSAL.date)}
              </p>
              <h2 className="mt-2 font-display text-[1.7rem] font-light leading-tight text-star sm:mt-3 sm:text-5xl">
                {PROPOSAL.title}
              </h2>
              <div className="no-scrollbar mx-auto mt-3 max-h-[38vh] max-w-2xl overflow-y-auto overscroll-contain rounded-2xl bg-night/75 px-4 py-3 backdrop-blur-sm sm:max-h-[42vh] sm:px-6 sm:py-4">
                <p className="whitespace-pre-line text-[0.8rem] leading-[1.55] text-mist sm:text-[0.95rem] sm:leading-relaxed">
                  {highlightSacred(PROPOSAL.description)}
                </p>
              </div>
              <p
                className="mt-4 whitespace-pre-line font-display text-lg italic leading-snug text-ember sm:text-xl"
                style={{ textShadow: '0 1px 12px rgba(0,0,0,0.85)' }}
              >
                {PROPOSAL.outro}
              </p>
            </div>
          ) : (
            <div key={active} className="mx-auto max-w-xl animate-title-in text-center">
              <p className="label inline-block rounded-full bg-night-deep/80 px-4 py-1.5 text-ember/90 shadow-[0_0_20px_6px_rgba(4,5,11,0.8)] ring-1 ring-white/10 backdrop-blur-md">
                {(active + 1).toString().padStart(2, '0')} / {N.toString().padStart(2, '0')}
                <span className="mx-2 text-mist">·</span>
                {fmtDate(milestones[active].date)}
              </p>
              <h2 className="mt-2 font-display text-[1.7rem] font-light leading-tight text-star sm:mt-3 sm:text-5xl">
                {milestones[active].title}
              </h2>
              <div className="no-scrollbar mx-auto mt-3 max-h-[42vh] max-w-2xl overflow-y-auto overscroll-contain rounded-2xl bg-night/75 px-4 py-3 backdrop-blur-sm sm:max-h-[46vh] sm:px-6 sm:py-4">
                <p className="whitespace-pre-line text-[0.8rem] leading-[1.55] text-mist sm:text-[0.95rem] sm:leading-relaxed">
                  {highlightSacred(milestones[active].description)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

    </section>
  )
}
