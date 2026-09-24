import { useId, type ReactNode } from 'react'
import { RUNES, type RuneShape } from './ambienceRunes'

/**
 * Os desenhos do clima de cada filme (ver `Ambience.tsx`). Cada um pinta com
 * `currentColor`, pra camada escolher a cor; o que é "buraco" (olho, boca,
 * detalhe) vai na cor do fundo da tela.
 *
 * Regra que o Jack ensinou: o desenho tem que ter o traço que faz reconhecer.
 * Oval branco subindo é balão — caveira do Jack é olho enorme e sorriso costurado.
 */

export type Glyph = (p: { className?: string }) => ReactNode

/*
 * Os desenhos refeitos com volume moram em `glyphs/`, um arquivo por leva de
 * filmes; aqui ficam os gerados (raio, aurora, runas) e a pata de urso.
 */
export { AztecCoin, Tentacle, Crab } from './glyphs/piratas'
export { Mandala, Shield, Spider, SwingingSpidey, CornerWeb, WebSplat } from './glyphs/marvel'
export { JackSkull, Ghostface, Candy, Lollipop, Gingerbread, Casing, ContinentalCoin } from './glyphs/terror-acao'
export { Swan, RainDrop, Spotlight, Dot, EuroNote } from './glyphs/romance-danca'
export { Knife } from './glyphs/panico'
export { SlingPortal, EyeOfAgamotto, EldritchWhip } from './glyphs/estranho'
export { IronManFlying, RepulsorBlast, ArcReactorFlash } from './glyphs/guerra-civil'

/* ─── thor ────────────────────────────────────────────────────────────────── */

/**
 * Raio de verdade é fractal: um caminho que quebra em zigue-zague miúdo e solta
 * galhos pro lado no caminho. Cada raio sai de um sorteio com semente
 * (deslocamento do ponto médio), e é desenhado em três passadas — um halo largo
 * na cor da camada, um meio-halo, e o miolo quase branco — mais a nuvem acesa
 * lá em cima, no ponto de onde ele sai.
 */
type Pt = [number, number]

function seededRnd(seed: number) {
  let h = seed >>> 0 || 1
  return () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    return (h >>> 0) / 4294967296
  }
}

/** Zigue-zague fractal entre dois pontos. */
function zigzag(a: Pt, b: Pt, disp: number, depth: number, rnd: () => number): Pt[] {
  if (depth === 0) return [a, b]
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]]
  const len = Math.hypot(dx, dy) || 1
  const off = (rnd() - 0.5) * disp
  const mid: Pt = [(a[0] + b[0]) / 2 + (-dy / len) * off, (a[1] + b[1]) / 2 + (dx / len) * off]
  return [...zigzag(a, mid, disp / 2, depth - 1, rnd), ...zigzag(mid, b, disp / 2, depth - 1, rnd).slice(1)]
}

const toD = (pts: Pt[]) => 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')

function makeBolt(seed: number) {
  const rnd = seededRnd(seed)
  const start: Pt = [60 + (rnd() - 0.5) * 20, 18]
  const end: Pt = [60 + (rnd() - 0.5) * 60, 300]
  const main = zigzag(start, end, 70, 7, rnd)
  const branches: string[] = []
  const nb = 3 + Math.floor(rnd() * 3)
  for (let i = 0; i < nb; i++) {
    const from = main[Math.floor(main.length * (0.12 + rnd() * 0.55))]
    const side = rnd() < 0.5 ? -1 : 1
    const to: Pt = [from[0] + side * (18 + rnd() * 32), from[1] + 35 + rnd() * 80]
    const br = zigzag(from, to, 26, 5, rnd)
    branches.push(toD(br))
    // de vez em quando o galho ainda se divide
    if (rnd() < 0.5) {
      const f2 = br[Math.floor(br.length * (0.3 + rnd() * 0.4))]
      const t2: Pt = [f2[0] + side * (8 + rnd() * 16), f2[1] + 18 + rnd() * 30]
      branches.push(toD(zigzag(f2, t2, 12, 4, rnd)))
    }
  }
  return { top: start, main: toD(main), branches }
}

function Lightning({ bolt, className }: { bolt: ReturnType<typeof makeBolt>; className?: string }) {
  const id = useId()
  return (
    // overflow visível: o brilho da nuvem é mais largo que o raio, e cortado virava um quadrado
    <svg viewBox="0 0 120 300" overflow="visible" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-n`}>
          <stop offset="0" stopColor="currentColor" stopOpacity=".55" />
          <stop offset=".45" stopColor="currentColor" stopOpacity=".18" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* a nuvem acesa por dentro no ponto de onde o raio sai */}
      <ellipse cx={bolt.top[0]} cy={bolt.top[1]} rx="58" ry="30" fill={`url(#${id}-n)`} />
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d={bolt.main} strokeWidth="9" strokeOpacity=".12" />
        <path d={bolt.main} strokeWidth="3.6" strokeOpacity=".4" />
        {bolt.branches.map((b) => (
          <path key={b} d={b} strokeWidth="2.4" strokeOpacity=".3" />
        ))}
      </g>
      <g fill="none" stroke="#f4f8ff" strokeLinecap="round" strokeLinejoin="round">
        <path d={bolt.main} strokeWidth="1.5" />
        {bolt.branches.map((b) => (
          <path key={b} d={b} strokeWidth=".8" strokeOpacity=".85" />
        ))}
      </g>
    </svg>
  )
}

/** Quatro raios diferentes, sorteados uma vez só (sempre os mesmos). */
export const BOLTS: Glyph[] = [11, 29, 47, 83].map((seed) => {
  const bolt = makeBolt(seed)
  const G: Glyph = ({ className }) => <Lightning bolt={bolt} className={className} />
  return G
})

/* ─── instrumentos mortais ────────────────────────────────────────────────── */

/**
 * As runas reais (ver `ambienceRunes.ts`), aparecendo como estela na pele:
 * primeiro o contorno se risca (`amb-rune-line`), depois ela acende por dentro
 * (`amb-rune-fill`), no compasso do aparecer e sumir da camada.
 */
function Rune({ rune, className }: { rune: RuneShape; className?: string }) {
  return (
    <svg viewBox={`0 0 ${rune.w} ${rune.h}`} className={className} aria-hidden>
      <path d={rune.d} fill="currentColor" fillRule="evenodd" className="amb-rune-fill" />
      <path
        d={rune.d}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
        pathLength={1}
        className="amb-rune-line"
      />
    </svg>
  )
}

export const RUNE_GLYPHS: Glyph[] = Object.values(RUNES).map((rune) => {
  const G: Glyph = ({ className }) => <Rune rune={rune} className={className} />
  return G
})

/* ─── irmão urso ──────────────────────────────────────────────────────────── */

/**
 * A aurora do Irmão Urso não é a verde de foto: é fogo — cortinas largas de
 * ouro e laranja, com uns filetes amarelo-esverdeados, acesas embaixo numa
 * faixa que ondula e sumindo pra cima em vermelho. As cortinas vêm divididas em
 * três folhas de SVG empilhadas, cada uma cintilando no seu tempo
 * (`amb-shimmer`): mexer a folha inteira é só opacidade e deslize, o celular
 * não redesenha nada. O desfoque é do próprio SVG, feito uma vez só.
 */
type Ray = { x: number; y: number; w: number; h: number; o: number; tone: 0 | 1 | 2 }

/**
 * As paletas de cortina: [base, meio, topo] de cada tom (três tons por
 * paleta), mais a cor da faixa acesa e do miolo dela. A de fogo é a da frente;
 * a seca — ocre, terracota, oliva apagado — fica atrás, dando profundidade.
 */
type AuroraPalette = { tones: string[][]; ribbon: string; core: string; wash: [string, string, string] }

const AURORA_FIRE: AuroraPalette = {
  tones: [
    ['#ffe27a', '#ffb13b', '#ff6a1f'],
    ['#ffc05a', '#ff7a1f', '#d9401a'],
    ['#f1f58a', '#c8e64a', '#9fd13a'],
  ],
  ribbon: '#ffd45e',
  core: '#fff4c2',
  wash: ['#ff6a1f', '#ff8a2a', '#ffc05a'],
}

const AURORA_DRY: AuroraPalette = {
  tones: [
    ['#e3bf78', '#c4863f', '#8f4f2c'],
    ['#d6a25e', '#a9642f', '#6f3b25'],
    ['#cfc585', '#9c9a52', '#6c6b3c'],
  ],
  ribbon: '#d9b36e',
  core: '#efdcae',
  wash: ['#8f4f2c', '#a9642f', '#d6a25e'],
}

function auroraRays(seed: number) {
  const rnd = seededRnd(seed)
  const p1 = rnd() * 6
  const p2 = rnd() * 6
  const baseAt = (x: number) => 112 + 10 * Math.sin(x / 60 + p1) + 5 * Math.sin(x / 21 + p2)
  const sheets: Ray[][] = [[], [], []]
  for (let x = -10; x < 410; x += 6 + rnd() * 7) {
    const swell = 0.5 + 0.5 * Math.sin(x / 75 + p2) // onde a cortina sobe mais
    const h = (40 + rnd() * 50) * swell + 30
    const r = rnd()
    sheets[Math.floor(rnd() * 3)].push({
      x,
      y: baseAt(x) - h,
      w: 12 + rnd() * 18,
      h: h + 8,
      o: 0.5 + rnd() * 0.5,
      tone: r < 0.14 ? 2 : r < 0.55 ? 1 : 0,
    })
  }
  // a faixa acesa embaixo, e o banho de fogo que fecha os vãos entre os raios
  let ribbon = `M0 ${(baseAt(0) - 10).toFixed(1)}`
  for (let x = 8; x <= 400; x += 8) ribbon += `L${x} ${(baseAt(x) - 10).toFixed(1)}`
  for (let x = 400; x >= 0; x -= 8) ribbon += `L${x} ${(baseAt(x) + 4).toFixed(1)}`
  let wash = `M0 ${(baseAt(0) - 70).toFixed(1)}`
  for (let x = 8; x <= 400; x += 8)
    wash += `L${x} ${(baseAt(x) - 45 - 30 * (0.5 + 0.5 * Math.sin(x / 75 + p2))).toFixed(1)}`
  for (let x = 400; x >= 0; x -= 8) wash += `L${x} ${(baseAt(x) + 2).toFixed(1)}`
  return { rays: sheets, ribbon: ribbon + 'Z', wash: wash + 'Z' }
}

function AuroraCurtain({
  data,
  palette,
  className,
}: {
  data: ReturnType<typeof auroraRays>
  palette: AuroraPalette
  className?: string
}) {
  const id = useId()
  const { rays, ribbon, wash } = data
  const defs = (
    <defs>
      {palette.tones.map(([base, mid, top], t) => (
        <linearGradient key={t} id={`${id}-t${t}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={top} stopOpacity="0" />
          <stop offset=".35" stopColor={top} stopOpacity=".6" />
          <stop offset=".75" stopColor={mid} stopOpacity="1" />
          <stop offset=".95" stopColor={base} stopOpacity="1" />
          <stop offset="1" stopColor={base} stopOpacity="0" />
        </linearGradient>
      ))}
      <linearGradient id={`${id}-h`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset=".15" stopColor="#fff" stopOpacity="1" />
        <stop offset=".85" stopColor="#fff" stopOpacity="1" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      {/* máscara e desfoque em coordenada da própria aurora, com folga: medidos
          pelo contorno do desenho, eles cortavam o brilho de baixo numa linha reta */}
      <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x="-20" y="-40" width="440" height="240">
        <rect x="-20" y="-40" width="440" height="240" fill={`url(#${id}-h)`} />
      </mask>
      <filter id={`${id}-f`} filterUnits="userSpaceOnUse" x="-20" y="-40" width="440" height="240">
        <feGaussianBlur stdDeviation="4.5" />
      </filter>
      <filter id={`${id}-g`} filterUnits="userSpaceOnUse" x="-20" y="-40" width="440" height="240">
        <feGaussianBlur stdDeviation="7" />
      </filter>
      <linearGradient id={`${id}-w`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#d9401a" stopOpacity="0" />
        <stop offset=".35" stopColor={palette.wash[0]} stopOpacity=".12" />
        <stop offset=".75" stopColor={palette.wash[1]} stopOpacity=".45" />
        <stop offset="1" stopColor={palette.wash[2]} stopOpacity=".8" />
      </linearGradient>
    </defs>
  )
  return (
    // altura presa na tela, e não na largura: senão no computador ela desce até o meio
    <div className={className} style={{ position: 'relative', height: '60vh' }} aria-hidden>
      {rays.map((sheet, i) => (
        <svg
          key={i}
          viewBox="0 0 400 140"
          preserveAspectRatio="none"
          overflow="visible"
          className="amb-shimmer absolute inset-0 h-full w-full"
          style={{ animationDuration: `${2.6 + i * 1.3}s`, animationDelay: `${-i * 0.8}s` }}
        >
          {defs}
          <g mask={`url(#${id}-m)`} filter={`url(#${id}-f)`}>
            {i === 0 && <path d={wash} fill={`url(#${id}-w)`} />}
            {sheet.map((r) => (
              <rect
                key={r.x}
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                fill={`url(#${id}-t${r.tone})`}
                opacity={r.o}
              />
            ))}
          </g>
          {/* a faixa acesa de onde as cortinas caem, só na primeira folha */}
          {i === 0 && (
            <>
              <path d={ribbon} fill={palette.ribbon} opacity=".95" mask={`url(#${id}-m)`} filter={`url(#${id}-g)`} />
              {/* o miolo da faixa, quase branco: é o que dá o brilho de fogo */}
              <path d={ribbon} fill={palette.core} opacity=".75" mask={`url(#${id}-m)`} filter={`url(#${id}-f)`} transform="translate(0 2) scale(1 .985)" />
            </>
          )}
        </svg>
      ))}
    </div>
  )
}

export const AURORAS: Glyph[] = [5, 17].map((seed) => {
  const data = auroraRays(seed)
  const G: Glyph = ({ className }) => <AuroraCurtain data={data} palette={AURORA_FIRE} className={className} />
  return G
})

/** A cortina seca, de trás. */
export const AURORA_BACK: Glyph[] = [41].map((seed) => {
  const data = auroraRays(seed)
  const G: Glyph = ({ className }) => <AuroraCurtain data={data} palette={AURORA_DRY} className={className} />
  return G
})

/**
 * Pegada de urso de verdade: a almofada larga em forma de feijão (mais larga
 * que alta — é isso que diferencia de pata de cachorro), os cinco dedos colados
 * em arco logo em cima, e a marquinha da garra na frente de cada dedo.
 * Aponta pra direita, pra onde a trilha anda.
 */
export function BearPaw({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 30" className={className} aria-hidden>
      <g transform="rotate(90 15 15)" fill="currentColor">
        <path d="M3.5 20c0-4.2 5-6.5 11.5-6.5S26.5 15.8 26.5 20c0 4.4-3.6 7-7.3 6.4-1.6-.3-2.6-1-4.2-1s-2.6.7-4.2 1C7.1 27 3.5 24.4 3.5 20z" />
        <ellipse cx="4.8" cy="12.4" rx="2.3" ry="2.8" transform="rotate(-28 4.8 12.4)" />
        <ellipse cx="9.2" cy="9.6" rx="2.5" ry="3" transform="rotate(-14 9.2 9.6)" />
        <ellipse cx="15" cy="8.7" rx="2.6" ry="3.1" />
        <ellipse cx="20.8" cy="9.6" rx="2.5" ry="3" transform="rotate(14 20.8 9.6)" />
        <ellipse cx="25.2" cy="12.4" rx="2.3" ry="2.8" transform="rotate(28 25.2 12.4)" />
      </g>
      {/* as garras: risquinho curvo saindo da ponta de cada dedo */}
      <g
        transform="rotate(90 15 15)"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      >
        <path d="M3.2 9.4c-.9-.9-1.3-2-1.3-3.1M8.3 6.4c-.5-1.1-.6-2.2-.3-3.3M15 5.4c0-1.2.1-2.3.5-3.3M21.7 6.4c.5-1.1.6-2.2.3-3.3M26.8 9.4c.9-.9 1.3-2 1.3-3.1" />
      </g>
    </svg>
  )
}
