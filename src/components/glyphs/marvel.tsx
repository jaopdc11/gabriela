import { useId } from 'react'

/**
 * Os desenhos Marvel do clima (ver `Ambience.tsx`): o portal do Doutor
 * Estranho, o escudo do Capitão e a aranha do Homem-Aranha. Mesmo contrato dos
 * outros desenhos: pintam com `currentColor` (menos o escudo, que tem as cores
 * dele), o que é buraco vai na cor do fundo, e cada degradê tem id próprio.
 */

/** A cor do fundo da ficha aberta: o que é vazado no desenho. */
const HOLE = '#04050b'

const rad = (deg: number) => (deg * Math.PI) / 180
const polar = (cx: number, cy: number, r: number, deg: number): [number, number] => [
  cx + r * Math.cos(rad(deg - 90)),
  cy + r * Math.sin(rad(deg - 90)),
]
const f = (n: number) => n.toFixed(2)

/* ─── doutor estranho ─────────────────────────────────────────────────────── */

/**
 * As marquinhas dos anéis, feito escrita sânscrita: cada uma é uma linha de
 * cabeça (a barra de cima do devanágari) com um traço embaixo. São desenhadas
 * num quadradinho em volta de (0,0), com o "pra cima" apontando pra fora do anel.
 */
const SCRIPT = [
  'M-2 -1.6H2M0 -1.6V1.8',
  'M-2 -1.6H2M-.8 -1.6C-2 0 -.4 1.8 1 .6',
  'M-2 -1.6H2M1 -1.6V1.8M-1.4 -.2a1 1 0 1 0 1.2 1.4',
  'M-2 -1.6H2M-1 -1.6V.4H1.2',
  'M-2 -1.6H2M0 -1.6C1.8 -.4 1.2 1.8 -1 1.4',
  'M-2 -1.6H2M-1.2 -1.6V1.6M.8 -.6V1.6',
  'M-2 -1.6H2M0 -1.6V0M-1.4 1.4L1.4 .2',
]

/** Um anel de escrita: `n` marcas em volta do raio `r`, girando junto do anel. */
function ScriptRing({ r, n, scale, offset = 0 }: { r: number; n: number; scale: number; offset?: number }) {
  const marks = []
  for (let i = 0; i < n; i++) {
    const a = (360 / n) * i + offset
    const [x, y] = polar(50, 50, r, a)
    marks.push(
      <path
        key={i}
        d={SCRIPT[(i * 5 + 3) % SCRIPT.length]}
        transform={`translate(${f(x)} ${f(y)}) rotate(${f(a)}) scale(${scale})`}
      />,
    )
  }
  return <>{marks}</>
}

/** Arco de `a0` a `a1` graus no raio `r`. */
const arc = (r: number, a0: number, a1: number) => {
  const [x0, y0] = polar(50, 50, r, a0)
  const [x1, y1] = polar(50, 50, r, a1)
  return `M${f(x0)} ${f(y0)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${f(x1)} ${f(y1)}`
}

/**
 * O portal do anel: o escudo místico do Estranho. De fora pra dentro: arcos
 * soltos brilhando, o anel de pontinhos, a faixa de escrita grande, os dois
 * quadrados cruzados formando a estrela de oito pontas, os raios, a faixa de
 * escrita pequena e o olho do meio. Tudo em linha fina, com uma passada larga e
 * translúcida por baixo que faz as vezes de brilho (sem filtro nenhum).
 */
export function Mandala({ className }: { className?: string }) {
  const lines = (
    <>
      <circle cx="50" cy="50" r="46" strokeWidth=".9" />
      <circle cx="50" cy="50" r="43.6" strokeWidth=".5" />
      <circle cx="50" cy="50" r="36.4" strokeWidth=".5" />
      <circle cx="50" cy="50" r="34.6" strokeWidth=".9" />
      <rect x="25.5" y="25.5" width="49" height="49" strokeWidth=".8" />
      <rect x="25.5" y="25.5" width="49" height="49" strokeWidth=".8" transform="rotate(45 50 50)" />
      <circle cx="50" cy="50" r="24" strokeWidth=".8" />
      <circle cx="50" cy="50" r="18.6" strokeWidth=".5" />
      <circle cx="50" cy="50" r="13" strokeWidth=".7" />
      <circle cx="50" cy="50" r="6.5" strokeWidth=".8" />
      {/* triângulos cruzados no miolo */}
      <path
        d={`M${polar(50, 50, 13, 0).map(f).join(' ')}L${polar(50, 50, 13, 120).map(f).join(' ')}L${polar(50, 50, 13, 240).map(f).join(' ')}Z`}
        strokeWidth=".6"
      />
      <path
        d={`M${polar(50, 50, 13, 60).map(f).join(' ')}L${polar(50, 50, 13, 180).map(f).join(' ')}L${polar(50, 50, 13, 300).map(f).join(' ')}Z`}
        strokeWidth=".6"
      />
      {/* raios entre a faixa pequena e a estrela */}
      <path
        d={Array.from({ length: 16 }, (_, i) => {
          const a = i * 22.5 + 11.25
          const [x0, y0] = polar(50, 50, 24, a)
          const [x1, y1] = polar(50, 50, 30, a)
          return `M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}`
        }).join('')}
        strokeWidth=".45"
      />
    </>
  )
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* o brilho: as mesmas linhas, largas e quase transparentes, por baixo */}
        <g strokeOpacity=".16" style={{ strokeWidth: 3.2 }}>
          <circle cx="50" cy="50" r="46" />
          <circle cx="50" cy="50" r="35.5" />
          <circle cx="50" cy="50" r="24" />
          <circle cx="50" cy="50" r="13" />
          <circle cx="50" cy="50" r="6.5" />
        </g>
        {lines}
        {/* os arcos soltos por fora, os mais acesos */}
        <g strokeWidth="1.4">
          <path d={arc(48.6, 12, 70)} />
          <path d={arc(48.6, 132, 168)} />
          <path d={arc(48.6, 200, 262)} />
          <path d={arc(48.6, 300, 330)} />
        </g>
        <g strokeWidth="3.4" strokeOpacity=".18">
          <path d={arc(48.6, 12, 70)} />
          <path d={arc(48.6, 200, 262)} />
        </g>
        {/* o anel de pontinhos */}
        <circle cx="50" cy="50" r="44.8" strokeWidth="1.3" strokeDasharray=".01 2.2" />
        {/* as faixas de escrita */}
        <g strokeWidth=".55">
          <ScriptRing r={40} n={30} scale={0.78} />
          <ScriptRing r={21.3} n={16} scale={0.5} offset={11.25} />
        </g>
      </g>
      <g fill="currentColor">
        {/* contas nas pontas da estrela e no anel */}
        {Array.from({ length: 8 }, (_, i) => {
          const [x, y] = polar(50, 50, 34.6, i * 45)
          return <circle key={`s${i}`} cx={f(x)} cy={f(y)} r="1.5" />
        })}
        {Array.from({ length: 4 }, (_, i) => {
          const [x, y] = polar(50, 50, 46, i * 90 + 45)
          return <circle key={`o${i}`} cx={f(x)} cy={f(y)} r="1.7" />
        })}
        <circle cx="50" cy="50" r="2.4" />
      </g>
    </svg>
  )
}

/* ─── guerra civil ────────────────────────────────────────────────────────── */

/** As cinco pontas da estrela, cada uma partida em lado aceso e lado de sombra. */
function starFacets(r: number, inner: number) {
  const out: { light: string; dark: string }[] = []
  for (let i = 0; i < 5; i++) {
    const a = i * 72
    const tip = polar(50, 50, r, a)
    const left = polar(50, 50, inner, a - 36)
    const right = polar(50, 50, inner, a + 36)
    const c = `${f(50)} ${f(50)}`
    out.push({
      light: `M${f(tip[0])} ${f(tip[1])}L${f(left[0])} ${f(left[1])}L${c}Z`,
      dark: `M${f(tip[0])} ${f(tip[1])}L${f(right[0])} ${f(right[1])}L${c}Z`,
    })
  }
  return out
}

/**
 * O escudo do Capitão, em metal: cada anel com degradê radial (a luz vem de
 * cima à esquerda), um fio claro e um escuro em cada borda fazendo o bisel, a
 * estrela de prata com as pontas facetadas, o reflexo varrendo em cima e uns
 * arranhões de uso. Esse tem as cores dele e não obedece a cor da camada.
 */
export function Shield({ className }: { className?: string }) {
  const id = useId()
  const g = (n: string) => `url(#${id}-${n})`
  const rings = [48, 39, 30.5, 22]
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-red`} cx=".36" cy=".3" r=".8">
          <stop offset="0" stopColor="#f0525a" />
          <stop offset=".5" stopColor="#c0212b" />
          <stop offset="1" stopColor="#6e0f14" />
        </radialGradient>
        <radialGradient id={`${id}-silver`} cx=".36" cy=".3" r=".8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".5" stopColor="#d3d6dc" />
          <stop offset="1" stopColor="#7d838d" />
        </radialGradient>
        <radialGradient id={`${id}-blue`} cx=".36" cy=".3" r=".85">
          <stop offset="0" stopColor="#5b86e0" />
          <stop offset=".55" stopColor="#2a4a9f" />
          <stop offset="1" stopColor="#14245a" />
        </radialGradient>
        {/* o bisel: claro em cima à esquerda, escuro embaixo à direita */}
        <linearGradient id={`${id}-bevel`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".85" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".6" />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".45" stopColor="#fff" stopOpacity=".32" />
          <stop offset=".55" stopColor="#fff" stopOpacity=".32" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}-disc`}>
          <circle cx="50" cy="50" r="48" />
        </clipPath>
      </defs>

      <circle cx="50" cy="50" r="48" fill={g('red')} />
      <circle cx="50" cy="50" r="39" fill={g('silver')} />
      <circle cx="50" cy="50" r="30.5" fill={g('red')} />
      <circle cx="50" cy="50" r="22" fill={g('blue')} />

      {/* o bisel em cada borda de anel */}
      <g fill="none" stroke={g('bevel')}>
        {rings.map((r) => (
          <circle key={r} cx="50" cy="50" r={r - 0.6} strokeWidth="1.2" />
        ))}
      </g>
      <g fill="none" stroke="#000" strokeOpacity=".35" strokeWidth=".5">
        {rings.slice(1).map((r) => (
          <circle key={r} cx="50" cy="50" r={r + 0.3} />
        ))}
      </g>

      {/* a estrela de prata: pontas facetadas, miolo liso */}
      {starFacets(20, 8.2).map((p, i) => (
        <g key={i}>
          <path d={p.light} fill={i === 3 || i === 4 ? '#f7f8fb' : '#eef0f4'} />
          <path d={p.dark} fill={i === 1 || i === 2 ? '#8e949e' : '#b4b9c2'} />
        </g>
      ))}
      <path
        d={`M${Array.from({ length: 10 }, (_, i) => polar(50, 50, i % 2 ? 8.2 : 20, i * 36).map(f).join(' ')).join('L')}Z`}
        fill="none"
        stroke="#5a606a"
        strokeOpacity=".55"
        strokeWidth=".4"
        strokeLinejoin="round"
      />

      <g clipPath={`url(#${id}-disc)`}>
        {/* o reflexo passando na diagonal */}
        <path d="M-10 36L36 -10 58 -10 -10 58z" fill={g('shine')} />
        {/* arranhões de uso */}
        <g stroke="#fff" strokeOpacity=".28" strokeWidth=".35" strokeLinecap="round">
          <path d="M68 16l9 6M24 72l7-3M73 70l4 7M14 42l2 7M58 83l8-2" />
        </g>
      </g>
      <circle cx="50" cy="50" r="47.6" fill="none" stroke="#3a0a0d" strokeOpacity=".7" strokeWidth=".8" />
    </svg>
  )
}

/* ─── homem-aranha ────────────────────────────────────────────────────────── */

/**
 * As patas do lado esquerdo, cada uma em três pedaços (coxa, canela, ponta)
 * afinando: [base, joelho, tornozelo, ponta]. O lado direito é o espelho.
 */
const LEGS: [number, number][][] = [
  [[45, 67], [31, 71], [24, 84], [21, 96]], // as da frente, pra baixo
  [[44, 64], [26, 62], [15, 73], [8, 80]],
  [[44, 61], [27, 52], [14, 50], [5, 54]],
  [[45, 58], [32, 40], [22, 28], [19, 16]], // as de trás, pra cima
]
const WIDTHS = [3.1, 2.2, 1.2]

/**
 * A aranha pendurada, de cabeça pra baixo como aranha de verdade fica: o fio
 * sai da ponta do abdômen, lá em cima (a 26% do desenho, onde o CSS prende o
 * fio). Abdômen com volume — degradê, brilho e o desenho de chevrons nas
 * costas —, o cefalotórax embaixo com os olhinhos, e as oito patas articuladas
 * afinando até a ponta, com uns pelinhos nas coxas.
 */
export function Spider({ className }: { className?: string }) {
  const id = useId()
  const legPaths = LEGS.map((pts) =>
    pts.slice(0, 3).map((p, i) => `M${p[0]} ${p[1]}L${pts[i + 1][0]} ${pts[i + 1][1]}`),
  )
  const legs = (
    <g stroke="currentColor" strokeLinecap="round" fill="none">
      {legPaths.map((segs, l) =>
        segs.map((d, s) => <path key={`${l}-${s}`} d={d} strokeWidth={WIDTHS[s]} />),
      )}
      {/* as juntas, um tico mais grossas */}
      {LEGS.map((pts, l) =>
        pts.slice(1, 3).map((p, j) => (
          <circle key={`j${l}-${j}`} cx={p[0]} cy={p[1]} r={j ? 1.1 : 1.6} fill="currentColor" stroke="none" />
        )),
      )}
      {/* pelinhos nas coxas */}
      <g strokeWidth=".45" strokeOpacity=".75">
        {LEGS.map((pts, l) => {
          const [a, b] = [pts[0], pts[1]]
          return [0.35, 0.6, 0.85].map((t) => {
            const x = a[0] + (b[0] - a[0]) * t
            const y = a[1] + (b[1] - a[1]) * t
            return <path key={`h${l}-${t}`} d={`M${f(x)} ${f(y)}l-1.2 -1.8M${f(x)} ${f(y)}l.6 2`} />
          })
        })}
      </g>
    </g>
  )
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-lit`} cx=".35" cy=".3" r=".7">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset=".45" stopColor="#fff" stopOpacity=".08" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-shade`} cx=".35" cy=".3" r=".85">
          <stop offset=".45" stopColor={HOLE} stopOpacity="0" />
          <stop offset="1" stopColor={HOLE} stopOpacity=".65" />
        </radialGradient>
      </defs>

      {legs}
      <g transform="matrix(-1 0 0 1 100 0)">{legs}</g>

      {/* o cefalotórax, com as quelíceras embaixo */}
      <path d="M46.5 70.5c-.6 3 .4 5.2 1.8 5.6M53.5 70.5c.6 3-.4 5.2-1.8 5.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <ellipse cx="50" cy="63" rx="8.4" ry="9.4" fill="currentColor" />
      <ellipse cx="50" cy="63" rx="8.4" ry="9.4" fill={`url(#${id}-shade)`} />
      <ellipse cx="50" cy="63" rx="8.4" ry="9.4" fill={`url(#${id}-lit)`} />
      <path d="M50 56.5v7" stroke={HOLE} strokeOpacity=".35" strokeWidth=".7" strokeLinecap="round" />
      {/* os olhos, pertinho das quelíceras */}
      <g fill={HOLE}>
        <circle cx="47.6" cy="68.4" r="1" />
        <circle cx="52.4" cy="68.4" r="1" />
        <circle cx="45.9" cy="66.6" r=".65" />
        <circle cx="54.1" cy="66.6" r=".65" />
      </g>
      <g fill="#fff" fillOpacity=".7">
        <circle cx="47.3" cy="68.1" r=".3" />
        <circle cx="52.1" cy="68.1" r=".3" />
      </g>

      {/* o abdômen: volume, o desenho nas costas e o brilho */}
      <ellipse cx="50" cy="42" rx="13.2" ry="16" fill="currentColor" />
      <g fill="none" stroke={HOLE} strokeOpacity=".42" strokeLinecap="round" strokeLinejoin="round">
        <path d="M43 36l7 4 7-4" strokeWidth="1.6" />
        <path d="M42.5 42l7.5 4.2 7.5-4.2" strokeWidth="1.6" />
        <path d="M44 48l6 3.4 6-3.4" strokeWidth="1.4" />
        <path d="M50 29v25" strokeWidth=".6" />
      </g>
      <g fill={HOLE} fillOpacity=".35">
        <circle cx="45.5" cy="31.5" r="1" />
        <circle cx="54.5" cy="31.5" r="1" />
      </g>
      <ellipse cx="50" cy="42" rx="13.2" ry="16" fill={`url(#${id}-shade)`} />
      <ellipse cx="50" cy="42" rx="13.2" ry="16" fill={`url(#${id}-lit)`} />
      {/* fiandeiras, de onde sai o fio */}
      <path d="M48.6 27.2l1.4-1.4 1.4 1.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

/* ─── homem-aranha: o próprio, e as teias ─────────────────────────────────── */

/** Sorteio com semente, pras teias saírem sempre iguais (calculadas uma vez). */
function webRnd(seed: number) {
  let h = seed >>> 0 || 1
  return () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    return (h >>> 0) / 4294967296
  }
}

/**
 * O Homem-Aranha balançando na teia, na pose clássica (a do pôster de De Volta
 * ao Lar): um braço esticado segurando o fio, o outro aberto, corpo em
 * diagonal e as pernas dobradas pra trás. O fio sai reto do topo central do
 * desenho (40, 0) até a mão — é ali que o pêndulo prende. O traje tem as cores
 * dele; só o fio obedece a cor da camada.
 */
export function SwingingSpidey({ className }: { className?: string }) {
  const id = useId()
  const red = `url(#${id}-r)`
  const blue = `url(#${id}-b)`
  const ink = '#3a0a0e'
  return (
    <svg viewBox="0 0 80 240" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-r`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e0303b" />
          <stop offset="1" stopColor="#8e1119" />
        </linearGradient>
        <linearGradient id={`${id}-b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2b54b8" />
          <stop offset="1" stopColor="#152a66" />
        </linearGradient>
      </defs>
      {/* o fio */}
      <path d="M40 0V150" stroke="currentColor" strokeWidth=".9" strokeOpacity=".8" />
      <g transform="translate(40 150)" strokeLinecap="round" strokeLinejoin="round">
        {/* pernas azuis, bota vermelha */}
        <path d="M8 50L11 64 3 76" fill="none" stroke={blue} strokeWidth="7" />
        <path d="M4.5 74L1 79" stroke="#8e1119" strokeWidth="6.5" />
        <path d="M14 48l8 13 5 15" fill="none" stroke={blue} strokeWidth="7" />
        <path d="M26 72l2 8" stroke="#e0303b" strokeWidth="6.5" />
        {/* tronco: laterais azuis, peito vermelho com a teia e a aranha */}
        <path d="M-5 25c3-4 13-3 17 2 4 6 6 15 4 23-4 4-11 4-13 0-3-8-7-17-8-25z" fill={blue} />
        <path d="M-2 25c4-3 10-2 12 2 3 6 4 14 2 20-3 2-6 2-7-1-2-7-5-14-7-21z" fill={red} />
        <path
          d="M2 28c1 8 2 14 4 19M6 25c2 7 4 14 5 21M-1 30c3-1 8-1 12 1M0 36c3-1 8-1 13 1M2 42c3-1 7-1 11 0"
          fill="none"
          stroke={ink}
          strokeWidth=".35"
          strokeOpacity=".6"
        />
        <g transform="rotate(-12 6 36)">
          <ellipse cx="6" cy="35" rx=".9" ry="1.1" fill="#12050a" />
          <ellipse cx="6" cy="37.4" rx="1.1" ry="1.6" fill="#12050a" />
          <path
            d="M5.2 35.4l-2.4-1.8-.6-2M6.8 35.4l2.4-1.8.6-2M5 36.4l-2.8.2-1 1M7 36.4l2.8.2 1 1M5 37.6l-2.4 1.6-.4 1.8M7 37.6l2.4 1.6.4 1.8M5.4 38.6L4 41M6.6 38.6L8 41"
            fill="none"
            stroke="#12050a"
            strokeWidth=".45"
          />
        </g>
        <path d="M-1 27c2 6 4 12 5 18" fill="none" stroke="#fff" strokeOpacity=".18" strokeWidth="1.4" />
        {/* o braço que segura a teia */}
        <path d="M-3 26l1-13 2-10" fill="none" stroke={red} strokeWidth="5.2" />
        <path d="M-4.2 22l.6-9" fill="none" stroke="#2b54b8" strokeWidth="2.2" />
        <circle cx="0" cy="1.5" r="2.8" fill="#e0303b" />
        {/* o outro braço, aberto */}
        <path d="M10 30l10 4 7-5" fill="none" stroke={red} strokeWidth="5" />
        <path d="M11.5 32.5l7.5 2.7" fill="none" stroke="#2b54b8" strokeWidth="1.8" />
        <circle cx="27.5" cy="28.5" r="2.6" fill="#e0303b" />
        {/* a cabeça: máscara com a teia e os olhos brancos grandes */}
        <g transform="rotate(18 5 17)">
          <ellipse cx="5" cy="17" rx="6.2" ry="7.6" fill={red} />
          <path
            d="M5 9.4v15.2M-1.2 17h12.4M0 11.5l10 11M10 11.5l-10 11"
            stroke={ink}
            strokeWidth=".35"
            strokeOpacity=".7"
          />
          <ellipse cx="5" cy="17" rx="3" ry="3.6" fill="none" stroke={ink} strokeWidth=".35" strokeOpacity=".7" />
          <path d="M.3 13.4c1.8-.6 3.8.4 4.1 2.6.2 1.6-.6 3.3-1.6 4.4C1 20-.4 17.6.3 13.4z" fill="#fff" stroke="#111" strokeWidth=".75" />
          <path d="M9.7 13.4c-1.8-.6-3.8.4-4.1 2.6-.2 1.6.6 3.3 1.6 4.4C9 20 10.4 17.6 9.7 13.4z" fill="#fff" stroke="#111" strokeWidth=".75" />
          <ellipse cx="3" cy="12.5" rx="1.8" ry="1" fill="#fff" fillOpacity=".35" />
        </g>
      </g>
    </svg>
  )
}

/**
 * Teia de canto: presa no canto (0, 0), com os fios raiados abrindo pro
 * quadrante de baixo-direita e os fios de volta caídos em arco entre eles.
 * Pro motor girar e usar nos outros cantos.
 */
const CORNER_WEB = (() => {
  const rnd = webRnd(7)
  const angles = Array.from({ length: 8 }, (_, i) => (4 + (i * 82) / 7 + (rnd() - 0.5) * 5) * (Math.PI / 180))
  const radials = angles.map((a) => {
    const len = 130
    return `M0 0L${f(Math.cos(a) * len)} ${f(Math.sin(a) * len)}`
  })
  const rings: string[] = []
  for (const base of [11, 20, 30, 41, 53, 66, 80, 95]) {
    const pts = angles.map((a) => {
      const r = base * (0.93 + rnd() * 0.14)
      return [Math.cos(a) * r, Math.sin(a) * r] as const
    })
    let d = `M${f(pts[0][0])} ${f(pts[0][1])}`
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1]
      const [x1, y1] = pts[i]
      // o fio cede pra dentro, feito corda frouxa
      const sag = 0.86 + rnd() * 0.05
      d += `Q${f(((x0 + x1) / 2) * sag)} ${f(((y0 + y1) / 2) * sag)} ${f(x1)} ${f(y1)}`
    }
    rings.push(d)
  }
  return { radials, rings }
})()

export function CornerWeb({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        {CORNER_WEB.radials.map((d) => (
          <path key={d} d={d} strokeWidth=".7" strokeOpacity=".85" />
        ))}
        {CORNER_WEB.rings.map((d) => (
          <path key={d} d={d} strokeWidth=".5" strokeOpacity=".7" />
        ))}
      </g>
    </svg>
  )
}

/**
 * O estouro de teia disparada que gruda: miolo denso, fios raiados
 * irregulares com arcos entre eles, e respingos nas pontas.
 */
const WEB_SPLAT = (() => {
  const rnd = webRnd(23)
  const n = 13
  const angles = Array.from({ length: n }, (_, i) => ((i + (rnd() - 0.5) * 0.5) / n) * Math.PI * 2)
  const lens = angles.map(() => 34 + rnd() * 14)
  const radials = angles.map(
    (a, i) => `M50 50L${f(50 + Math.cos(a) * lens[i])} ${f(50 + Math.sin(a) * lens[i])}`,
  )
  const rings: string[] = []
  for (const base of [7, 13, 20, 28]) {
    const pts = angles.map((a) => {
      const r = base * (0.88 + rnd() * 0.24)
      return [50 + Math.cos(a) * r, 50 + Math.sin(a) * r] as const
    })
    let d = `M${f(pts[0][0])} ${f(pts[0][1])}`
    for (let i = 1; i <= pts.length; i++) {
      const [x0, y0] = pts[i - 1]
      const [x1, y1] = pts[i % pts.length]
      const sag = 0.8 + rnd() * 0.08
      d += `Q${f(50 + ((x0 + x1) / 2 - 50) * sag)} ${f(50 + ((y0 + y1) / 2 - 50) * sag)} ${f(x1)} ${f(y1)}`
    }
    rings.push(d)
  }
  const drops = angles.map((a, i) => {
    const r = lens[i] + 2 + rnd() * 3
    return { x: 50 + Math.cos(a) * r, y: 50 + Math.sin(a) * r, s: 0.6 + rnd() * 1.1 }
  })
  return { radials, rings, drops }
})()

export function WebSplat({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {WEB_SPLAT.radials.map((d) => (
          <path key={d} d={d} strokeWidth="1" strokeOpacity=".9" />
        ))}
        {WEB_SPLAT.rings.map((d) => (
          <path key={d} d={d} strokeWidth=".7" strokeOpacity=".75" />
        ))}
      </g>
      {/* o miolo, onde a bola de teia bateu */}
      <circle cx="50" cy="50" r="5.5" fill="currentColor" fillOpacity=".85" />
      <circle cx="47.5" cy="48.5" r="3" fill="currentColor" />
      <circle cx="52.5" cy="52" r="2.6" fill="currentColor" fillOpacity=".9" />
      {WEB_SPLAT.drops.map((d) => (
        <circle key={`${d.x}-${d.y}`} cx={f(d.x)} cy={f(d.y)} r={f(d.s)} fill="currentColor" fillOpacity=".8" />
      ))}
    </svg>
  )
}
