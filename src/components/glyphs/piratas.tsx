import { useId } from 'react'

/**
 * Os desenhos do clima dos três Piratas (ver `Ambience.tsx`): a moeda asteca
 * do Pérola Negra, o braço do kraken do Baú da Morte e os caranguejos-pedra
 * brancos do Fim do Mundo. Pintam com `currentColor`; sombra é a cor do fundo
 * com transparência, brilho é branco com transparência — assim a camada troca
 * a cor e o volume continua.
 */

/** A cor do fundo da ficha aberta: o que é vazado ou sombra no desenho. */
const HOLE = '#04050b'

/** Sorteio com semente, pra geometria sair sempre igual. */
function seededRnd(seed: number) {
  let h = seed >>> 0 || 1
  return () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    return (h >>> 0) / 4294967296
  }
}

const f = (n: number) => n.toFixed(2)

/* ─── a moeda asteca ──────────────────────────────────────────────────────── */

/**
 * A moeda do tesouro amaldiçoado: ouro gasto, borda serrilhada e comida pelo
 * tempo, um anel de glifos astecas em relevo e a caveira no meio. O relevo é
 * sempre o par sombra embaixo-direita / brilho em cima-esquerda, com a luz
 * vindo do alto à esquerda.
 */
const COIN = (() => {
  const rnd = seededRnd(7)
  // a borda: serrilha miúda sobre um contorno que ondula de leve, com uns
  // amassados — moeda batida à mão e gasta, não selo de papel
  const edge: string[] = []
  const teeth = 110
  const w1 = rnd() * 6
  const w2 = rnd() * 6
  const dents = [rnd() * 6.28, rnd() * 6.28, rnd() * 6.28]
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i / (teeth * 2)) * Math.PI * 2
    const wobble = 0.35 * Math.sin(a * 3 + w1) + 0.2 * Math.sin(a * 7 + w2)
    const dent = dents.reduce((d, c) => {
      const da = ((a - c + 9.42) % 6.28) - 3.14 // distância angular até o amassado
      return d - 0.9 * Math.exp(-(da * da) / 0.02)
    }, 0)
    const r = (i % 2 === 0 ? 19.1 : 18.65) + wobble + dent - rnd() * 0.15
    edge.push(`${f(20 + r * Math.cos(a))} ${f(20 + r * Math.sin(a))}`)
  }
  // o anel de glifos: degrau (a greca asteca) alternando com ponto
  const glyphs: { a: number; step: boolean }[] = []
  for (let i = 0; i < 16; i++) glyphs.push({ a: (i / 16) * 360, step: i % 2 === 0 })
  return { edge: `M${edge.join('L')}Z`, glyphs }
})()

/** A caveira do medalhão, de frente: crânio, maçãs, dentes. */
const SKULL =
  'M20 10.2c-4.6 0-7.6 3.2-7.6 7.4 0 2.6 1.2 4.4 2.9 5.5l.3 2.6c.1.8.7 1.3 1.5 1.3h5.8c.8 0 1.4-.5 1.5-1.3l.3-2.6c1.7-1.1 2.9-2.9 2.9-5.5 0-4.2-3-7.4-7.6-7.4z'

export function AztecCoin({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <defs>
        {/* o brilho do ouro: luz no alto à esquerda, escurecendo pra borda */}
        <radialGradient id={`${id}-m`} cx=".34" cy=".3" r=".78">
          <stop offset="0" stopColor="#fff" stopOpacity=".5" />
          <stop offset=".35" stopColor="#fff" stopOpacity=".08" />
          <stop offset=".75" stopColor={HOLE} stopOpacity=".12" />
          <stop offset="1" stopColor={HOLE} stopOpacity=".5" />
        </radialGradient>
        <radialGradient id={`${id}-s`} cx=".4" cy=".32" r=".8">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset=".6" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor={HOLE} stopOpacity=".3" />
        </radialGradient>
      </defs>

      {/* o disco com a borda serrilhada */}
      <path d={COIN.edge} fill="currentColor" />
      <path d={COIN.edge} fill={`url(#${id}-m)`} />

      {/* o aro em relevo: sulco escuro com o fio de luz logo por dentro */}
      <circle cx="20.25" cy="20.3" r="16.4" fill="none" stroke={HOLE} strokeOpacity=".4" strokeWidth=".9" />
      <circle cx="19.8" cy="19.75" r="16" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth=".5" />

      {/* o anel de glifos */}
      {COIN.glyphs.map(({ a, step }) => (
        <g key={a} transform={`rotate(${a} 20 20) translate(20 5.9)`}>
          {step ? (
            <>
              <path d="M-1.3 .9h.9v-.9h.9v-.9h.9v2.7h-2.7z" fill={HOLE} fillOpacity=".42" transform="translate(.25 .3)" />
              <path d="M-1.3 .9h.9v-.9h.9v-.9h.9v2.7h-2.7z" fill="#fff" fillOpacity=".22" />
            </>
          ) : (
            <>
              <circle cx=".25" cy=".6" r=".75" fill={HOLE} fillOpacity=".42" />
              <circle cx="0" cy=".35" r=".55" fill="#fff" fillOpacity=".25" />
            </>
          )}
        </g>
      ))}
      <circle cx="20.2" cy="20.25" r="12" fill="none" stroke={HOLE} strokeOpacity=".38" strokeWidth=".8" />
      <circle cx="19.85" cy="19.8" r="11.6" fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth=".45" />

      {/* a caveira em relevo: a sombra dela, ela, e o brilho por cima */}
      <path d={SKULL} fill={HOLE} fillOpacity=".45" transform="translate(.55 .65)" />
      <path d={SKULL} fill="currentColor" />
      <path d={SKULL} fill={`url(#${id}-s)`} />
      {/* olhos fundos, nariz, maçãs e os dentes */}
      <path d="M14.6 17.6c0-1.6 1.4-2.5 2.8-2.1 1.1.3 1.4 1.5.9 2.7-.6 1.4-2.2 1.9-3.1 1.2-.4-.4-.6-1-.6-1.8z" fill={HOLE} fillOpacity=".75" />
      <path d="M25.4 17.6c0-1.6-1.4-2.5-2.8-2.1-1.1.3-1.4 1.5-.9 2.7.6 1.4 2.2 1.9 3.1 1.2.4-.4.6-1 .6-1.8z" fill={HOLE} fillOpacity=".75" />
      <path d="M20 19.4l-1.1 2.2h2.2z" fill={HOLE} fillOpacity=".65" />
      <path
        d="M17.4 23.4v2.3M19.1 23.6v2.4M20.9 23.6v2.4M22.6 23.4v2.3M16.8 23.2h6.4"
        stroke={HOLE}
        strokeOpacity=".55"
        strokeWidth=".55"
        strokeLinecap="round"
      />
      {/* arranhões do tempo */}
      <path
        d="M9.2 25.6l3.4-1.6M27.4 29.8l2.8-2.6M29.6 9.8l-2 1.4M10.8 10.4l1.2 2.4"
        stroke={HOLE}
        strokeOpacity=".28"
        strokeWidth=".35"
        strokeLinecap="round"
      />
      {/* o reflexo do metal, no alto à esquerda */}
      <path
        d="M6.5 14.2a14.6 14.6 0 0 1 7.2-7.6"
        fill="none"
        stroke="#fff"
        strokeOpacity=".55"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <circle cx="14.5" cy="12.4" r=".8" fill="#fff" fillOpacity=".6" />
    </svg>
  )
}

/* ─── o kraken ────────────────────────────────────────────────────────────── */

/**
 * Um braço do kraken, gerado a partir de uma linha central: sobe do pé da
 * tela num S de músculo e enrola a ponta em espiral pra dentro. A grossura cai
 * da base pra ponta; o lado de dentro da curva é a barriga, mais clara, com as
 * duas fileiras de ventosas diminuindo até a ponta. O lado de fora leva a
 * sombra e as manchas da pele.
 */
type P = [number, number]

const KRAKEN = (() => {
  // a linha central: o talo subindo…
  const line: P[] = []
  const N = 60
  for (let i = 0; i <= N; i++) {
    const s = i / N
    line.push([15 + 4.2 * Math.sin(s * Math.PI * 1.1) - 2.4 * s, 121 - 91 * s])
  }
  // …e a ponta enrolando: parte pra cima e gira pra direita, fechando o raio
  const [ex, ey] = line[line.length - 1]
  const r0 = 8.6
  const cx = ex + r0
  const cy = ey
  const M = 44
  for (let i = 1; i <= M; i++) {
    const t = i / M
    const th = Math.PI + t * Math.PI * 2.15
    const r = r0 * (1 - 0.82 * t)
    line.push([cx + r * Math.cos(th), cy + r * Math.sin(th)])
  }

  // comprimento acumulado, pra grossura seguir o braço e não o índice
  const acc = [0]
  for (let i = 1; i < line.length; i++) {
    acc.push(acc[i - 1] + Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]))
  }
  const total = acc[acc.length - 1]
  const u = acc.map((a) => a / total)
  const half = u.map((v) => 11.2 * Math.pow(1 - v, 0.85) + 0.5)

  // normal pra direita de quem sobe: é o lado de dentro da curva (a barriga)
  const normal = line.map((_, i) => {
    const a = line[Math.max(i - 1, 0)]
    const b = line[Math.min(i + 1, line.length - 1)]
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const l = Math.hypot(dx, dy) || 1
    return [-dy / l, dx / l] as P
  })
  const at = (i: number, k: number): P => [
    line[i][0] + normal[i][0] * half[i] * k,
    line[i][1] + normal[i][1] * half[i] * k,
  ]
  const band = (k1: number, k2: number) => {
    const a = line.map((_, i) => at(i, k1))
    const b = line.map((_, i) => at(i, k2)).reverse()
    return 'M' + [...a, ...b].map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + 'Z'
  }

  // as ventosas: duas fileiras desencontradas, espaçadas pela grossura do braço
  const suckers: { x: number; y: number; r: number }[] = []
  let next = 0.02
  let row = 0
  for (let i = 0; i < line.length; i++) {
    if (u[i] < next || u[i] > 0.93) continue
    const k = row % 2 === 0 ? 0.45 : 0.78
    const [x, y] = at(i, k)
    suckers.push({ x, y, r: Math.max(half[i] * (row % 2 === 0 ? 0.26 : 0.2), 0.35) })
    next = u[i] + (half[i] * 0.62) / total
    row++
  }

  // manchas da pele, do lado de fora (onde bate menos luz)
  const rnd = seededRnd(31)
  const spots: { x: number; y: number; rx: number; ry: number; a: number }[] = []
  for (let n = 0; n < 34; n++) {
    const i = Math.floor(rnd() * line.length * 0.85)
    const [x, y] = at(i, -(0.15 + rnd() * 0.7))
    const s = half[i] * (0.07 + rnd() * 0.1)
    spots.push({ x, y, rx: s * 1.6, ry: s, a: rnd() * 180 })
  }

  return {
    body: band(-1, 1),
    belly: band(0.12, 1),
    shade: band(-1, -0.35),
    shine: band(-0.3, -0.12),
    suckers,
    spots,
  }
})()

export function Tentacle({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 30 120" className={className} aria-hidden>
      <defs>
        {/* escurece pra base: o resto do bicho está lá embaixo, no fundo */}
        <linearGradient id={`${id}-d`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={HOLE} stopOpacity="0" />
          <stop offset=".55" stopColor={HOLE} stopOpacity=".05" />
          <stop offset="1" stopColor={HOLE} stopOpacity=".45" />
        </linearGradient>
        <clipPath id={`${id}-c`}>
          <path d={KRAKEN.body} />
        </clipPath>
      </defs>

      <path d={KRAKEN.body} fill="currentColor" />
      <g clipPath={`url(#${id}-c)`}>
        {/* a barriga mais clara, e a sombra do lado de fora */}
        <path d={KRAKEN.belly} fill="#fff" fillOpacity=".17" />
        <path d={KRAKEN.shade} fill={HOLE} fillOpacity=".32" />
        {/* o brilho molhado correndo pelo músculo */}
        <path d={KRAKEN.shine} fill="#fff" fillOpacity=".12" />
        {KRAKEN.spots.map((s, i) => (
          <ellipse
            key={i}
            cx={s.x}
            cy={s.y}
            rx={s.rx}
            ry={s.ry}
            transform={`rotate(${f(s.a)} ${f(s.x)} ${f(s.y)})`}
            fill={HOLE}
            fillOpacity=".28"
          />
        ))}
        {/* as ventosas: aro claro, o fundo escuro e um ponto de luz */}
        {KRAKEN.suckers.map((s, i) => (
          <g key={i}>
            <circle cx={s.x} cy={s.y} r={s.r} fill="#fff" fillOpacity=".3" />
            <circle cx={s.x} cy={s.y} r={s.r} fill="none" stroke={HOLE} strokeOpacity=".35" strokeWidth={f(s.r * 0.22)} />
            <circle cx={s.x + s.r * 0.08} cy={s.y + s.r * 0.1} r={s.r * 0.45} fill={HOLE} fillOpacity=".5" />
            <circle cx={s.x - s.r * 0.35} cy={s.y - s.r * 0.35} r={s.r * 0.18} fill="#fff" fillOpacity=".45" />
          </g>
        ))}
        <rect x="0" y="0" width="30" height="122" fill={`url(#${id}-d)`} />
      </g>
    </svg>
  )
}

/* ─── os caranguejos-pedra ────────────────────────────────────────────────── */

/**
 * O caranguejo-pedra do Fim do Mundo: branco de osso, de frente. Carapaça
 * larga com os dentinhos na beirada e o sulco em H, olhos em haste, pinças
 * gordas com a ponta escura, e as quatro patas de cada lado com as juntas.
 * Tudo que é metade é desenhado uma vez e espelhado.
 */
const CARAPACE =
  'M12 15.6l-1.1-2 2-.6-.4-2 2.2.2.2-1.9 2.3.5C19 8.4 21.5 8 24 8s5 .4 6.8 1.8l2.3-.5.2 1.9 2.2-.2-.4 2 2 .6-1.1 2C35.5 21.5 30.5 25 24 25s-11.5-3.5-12-9.4z'

function CrabHalf() {
  return (
    <>
      {/* as patas: coxa, canela e a ponta escura */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M14 17L8.3 17.2 5 21.8M14.4 19.4L8.6 20.8 6 25.6M15.8 21.4L10.2 24.2 8.2 28.6M17.8 23.2L13.4 26.6 12.2 29.6"
          stroke="currentColor"
          strokeWidth="1.45"
        />
        <path
          d="M8.3 17.2L5 21.8M8.6 20.8L6 25.6M10.2 24.2L8.2 28.6M13.4 26.6L12.2 29.6"
          stroke={HOLE}
          strokeOpacity=".22"
          strokeWidth=".7"
          transform="translate(.35 .3)"
        />
        <path d="M5.9 20.6L5 21.8M6.6 24.3L6 25.6M8.7 27.4L8.2 28.6M12.5 28.8L12.2 29.6" stroke={HOLE} strokeOpacity=".55" strokeWidth="1.3" />
      </g>
      <g fill="currentColor">
        <circle cx="8.3" cy="17.2" r=".85" />
        <circle cx="8.6" cy="20.8" r=".85" />
        <circle cx="10.2" cy="24.2" r=".85" />
        <circle cx="13.4" cy="26.6" r=".85" />
      </g>

      {/* o braço da pinça, em dois gomos */}
      <path d="M15.2 14.6L11.3 12.1 8.4 9.4" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11.3" cy="12.1" r="1.25" fill="currentColor" />
      {/* a pinça: a palma gorda, o dedo fixo embaixo e o que abre em cima */}
      <path d="M2.4 1.6c1.6.6 3 2 3.4 3.8l-1.6.9C4 4.8 3.3 3.2 2.4 1.6z" fill="currentColor" />
      <path d="M.9 4.4c1.4.1 2.6.9 3.2 2.1l-.4 1.4C2.6 7.1 1.4 5.9.9 4.4z" fill="currentColor" />
      <ellipse cx="6.5" cy="7.7" rx="3.7" ry="2.7" transform="rotate(-38 6.5 7.7)" fill="currentColor" />
      <ellipse cx="7.1" cy="8.4" rx="2.6" ry="1.5" transform="rotate(-38 7.1 8.4)" fill={HOLE} fillOpacity=".2" />
      <ellipse cx="5.8" cy="6.8" rx="1.6" ry=".8" transform="rotate(-38 5.8 6.8)" fill="#fff" fillOpacity=".55" />
      {/* a ponta escura dos dedos */}
      <path d="M2.4 1.6c.6.4 1.1.9 1.5 1.5l-.8.4c-.2-.7-.4-1.3-.7-1.9zM.9 4.4c.7.1 1.3.3 1.8.7l-.6.6C1.7 5.3 1.2 4.9.9 4.4z" fill={HOLE} fillOpacity=".6" />

      {/* olho na haste: o globo branco, a pupila escura e o ponto de luz */}
      <path d="M21.2 9.4l-.9-3.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="20.2" cy="5.1" r="1.75" fill="currentColor" />
      <circle cx="20.1" cy="5" r="1" fill={HOLE} />
      <circle cx="19.75" cy="4.65" r=".38" fill="#fff" fillOpacity=".9" />
    </>
  )
}

export function Crab({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 48 30" className={className} aria-hidden>
      <defs>
        {/* a luz de cima: carapaça clara no alto, sombreada embaixo */}
        <radialGradient id={`${id}-l`} cx=".42" cy=".25" r=".85">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset=".45" stopColor="#fff" stopOpacity=".05" />
          <stop offset="1" stopColor={HOLE} stopOpacity=".42" />
        </radialGradient>
        <clipPath id={`${id}-c`}>
          <path d={CARAPACE} />
        </clipPath>
      </defs>

      <CrabHalf />
      <g transform="matrix(-1 0 0 1 48 0)">
        <CrabHalf />
      </g>

      <path d={CARAPACE} fill="currentColor" />
      <g clipPath={`url(#${id}-c)`}>
        <path d={CARAPACE} fill={`url(#${id}-l)`} />
        {/* o sulco em H da carapaça */}
        <path
          d="M19.4 12.4c.9 2.6.9 5.8-.4 9M28.6 12.4c-.9 2.6-.9 5.8.4 9M19.3 16.8h9.4"
          fill="none"
          stroke={HOLE}
          strokeOpacity=".3"
          strokeWidth=".75"
          strokeLinecap="round"
        />
        <path
          d="M19.9 12.2c.8 2.5.8 5.6-.4 8.8M28.1 12.2c-.8 2.5-.8 5.6.4 8.8"
          fill="none"
          stroke="#fff"
          strokeOpacity=".3"
          strokeWidth=".45"
          strokeLinecap="round"
        />
        {/* a textura de pedra: carocinhos com sombra */}
        {[
          [16, 13, 0.6],
          [15, 17.5, 0.5],
          [17.2, 20.6, 0.55],
          [32, 13, 0.6],
          [33, 17.5, 0.5],
          [30.8, 20.6, 0.55],
          [22, 11.2, 0.45],
          [26, 11.2, 0.45],
          [24, 21.4, 0.6],
          [21.4, 19, 0.4],
          [26.6, 19, 0.4],
        ].map(([x, y, r]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x + 0.25} cy={y + 0.3} r={r} fill={HOLE} fillOpacity=".3" />
            <circle cx={x} cy={y} r={r * 0.75} fill="#fff" fillOpacity=".35" />
          </g>
        ))}
        {/* a boca, embaixo da frente */}
        <path d="M21.6 23.4c1.6.7 3.2.7 4.8 0" fill="none" stroke={HOLE} strokeOpacity=".4" strokeWidth=".7" strokeLinecap="round" />
      </g>
      <path d={CARAPACE} fill="none" stroke={HOLE} strokeOpacity=".25" strokeWidth=".5" />
    </svg>
  )
}
