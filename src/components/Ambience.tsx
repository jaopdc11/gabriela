import { useMemo, type CSSProperties } from 'react'
import { slugify } from '../watchlist'
import * as G from './AmbienceGlyphs'

/**
 * O clima de cada filme: quando ela abre o cartaz, a tela atrás da ficha ganha
 * alguma coisa daquele mundo se mexendo — caveira no Jack, moeda asteca nos
 * Piratas, chuva no Diário. Fica por trás de tudo, sem pegar toque, e some pra
 * quem pediu menos movimento.
 *
 * Só o que a gente já viu (ou tá vendo) ganha clima: o clima é lembrança, e do
 * que ainda não vimos não tem lembrança nenhuma. Quando um título passar pra
 * `seen`, é hora de desenhar o dele.
 *
 * Pra dar clima a um título: uma entrada em `AMBIENCES` com a slug dele (a
 * mesma do cartaz), com uma ou mais camadas. Os desenhos moram em
 * `AmbienceGlyphs.tsx`; o jeito de se mexer, no `motion` de cada camada.
 */

/**
 * Como as coisas andam:
 * - `rise` / `fall`: atravessam a tela de baixo pra cima / de cima pra baixo;
 * - `across`: atravessam de lado, numa faixa de altura (`band`);
 * - `ricochet`: atravessam de lado quicando em zigue-zague entre o alto e o pé
 *   da tela (o escudo do Capitão);
 * - `haunt`: surgem do nada num ponto, pairam e somem;
 * - `strike`: parado no escuro, e de repente um clarão (raio);
 * - `emerge`: sobem do pé da tela e voltam pra baixo (tentáculo);
 * - `dangle`: descem do alto pendurados num fio e sobem de novo (aranha);
 * - `steps`: aparecem um atrás do outro atravessando a tela (pegadas);
 * - `beam`: presos no alto, balançando feito pêndulo (holofote);
 * - `swing`: preso no alto, passa num arco só de pêndulo e some antes de voltar
 *   (o Homem-Aranha na teia) — o desenho pendura do topo central;
 * - `corner`: cresce a partir de um canto da tela, fica e apaga (teia de canto) —
 *   o desenho se prende no canto de cima-esquerda e o motor espelha pros outros;
 * - `aurora`: faixa larga ondulando no alto da tela.
 */
type Motion =
  | 'rise'
  | 'fall'
  | 'across'
  | 'ricochet'
  | 'haunt'
  | 'strike'
  | 'emerge'
  | 'dangle'
  | 'steps'
  | 'beam'
  | 'swing'
  | 'corner'
  | 'aurora'

type Range = [number, number]

type Layer = {
  /** Os desenhos, sorteados um pra cada partícula. */
  glyphs: G.Glyph[]
  motion: Motion
  /** Quantas ao mesmo tempo. Pouco é mais bonito que muito. */
  count: number
  /** Largura, em px (a altura sai da proporção do desenho). */
  size: Range
  /** Quanto dura uma passada, em s. */
  duration: Range
  /** Cores sorteadas pra cada partícula; o desenho pinta com `currentColor`. */
  colors?: string[]
  opacity?: Range
  /** Balanço de lado (px), inclinação (graus) e o tempo de um balanço (s). */
  sway?: Range
  tilt?: Range
  swayDur?: Range
  /** Gira sem parar no próprio eixo (escudo, bala). */
  spin?: boolean
  /** Vira de face feito moeda jogada pro alto. */
  flip?: boolean
  /** Faixa de altura da tela (%) onde a camada vive, pra `across`/`haunt`/`strike`/`steps` (na `aurora`, a altura da primeira cortina). */
  band?: Range
  /** Só pro `across`: pra que lado andam. */
  direction?: 'ltr' | 'rtl' | 'both'
  /**
   * `emerge`: quanto do desenho fica escondido embaixo no ponto mais alto (%);
   * `dangle`: até onde desce, em % da altura da tela.
   */
  reach?: Range
}

type Ambience = Layer[]

/* ─── quem ganha clima ────────────────────────────────────────────────────── */

const GOLD = ['#e6c07a', '#d9a441', '#c9923a']

const AMBIENCES: Record<string, Ambience> = {
  // holofote de palco varrendo, com a poeira boiando na luz
  'ela-danca-eu-danco': [
    {
      glyphs: [G.Spotlight],
      motion: 'beam',
      count: 3,
      size: [220, 340],
      duration: [5, 8],
      colors: ['#f5f1e8', '#f3d9a4'],
      opacity: [0.3, 0.5],
      tilt: [16, 28],
      swayDur: [5, 8],
    },
    {
      glyphs: [G.Dot],
      motion: 'rise',
      count: 34,
      size: [2, 5],
      duration: [16, 30],
      colors: ['#f5f1e8'],
      opacity: [0.15, 0.5],
      sway: [8, 30],
    },
  ],

  // a moeda asteca amaldiçoada, caindo e virando
  'piratas-do-caribe-a-maldicao-do-perola-negra': [
    {
      glyphs: [G.AztecCoin],
      motion: 'fall',
      count: 20,
      size: [20, 46],
      duration: [9, 16],
      colors: GOLD,
      opacity: [0.35, 0.8],
      sway: [6, 24],
      tilt: [4, 12],
      flip: true,
    },
  ],

  // o kraken subindo pelas beiradas
  'piratas-do-caribe-o-bau-da-morte': [
    {
      glyphs: [G.Tentacle],
      motion: 'emerge',
      count: 5,
      size: [100, 170],
      duration: [9, 14],
      colors: ['#4d6b62', '#5b4f6e', '#3f5d66'],
      opacity: [0.55, 0.85],
      tilt: [4, 10],
      swayDur: [2.5, 4],
      reach: [0, 12],
    },
  ],

  // as pedras que viram caranguejo — brancos, como no filme — andando pelo pé da tela
  'piratas-do-caribe-no-fim-do-mundo': [
    {
      glyphs: [G.Crab],
      motion: 'across',
      count: 45,
      size: [26, 50],
      duration: [14, 28],
      colors: ['#f2ede2', '#e4dccb', '#d6cdb9'],
      opacity: [0.6, 0.95],
      tilt: [3, 7],
      swayDur: [0.25, 0.4],
      band: [52, 96],
      direction: 'both',
    },
  ],

  // o próprio aranha passando pendurado na teia, teia crescendo nos cantos,
  // teia disparada estourando, e as aranhinhas descendo no fio
  'homem-aranha-um-novo-dia': [
    {
      glyphs: [G.CornerWeb],
      motion: 'corner',
      count: 4,
      size: [150, 260],
      duration: [12, 18],
      colors: ['#e2e2ea'],
      opacity: [0.35, 0.55],
    },
    {
      glyphs: [G.WebSplat],
      motion: 'haunt',
      count: 5,
      size: [50, 110],
      duration: [5, 8],
      colors: ['#e2e2ea'],
      opacity: [0.4, 0.75],
      band: [10, 80],
    },
    {
      glyphs: [G.SwingingSpidey],
      motion: 'swing',
      count: 2,
      size: [90, 120],
      duration: [7, 10],
      colors: ['#e2e2ea'],
      opacity: [0.85, 1],
      tilt: [38, 52],
    },
    {
      glyphs: [G.Spider],
      motion: 'dangle',
      count: 4,
      size: [24, 44],
      duration: [8, 14],
      colors: ['#c43a44', '#e2e2ea'],
      opacity: [0.45, 0.8],
      tilt: [3, 8],
      swayDur: [2.5, 4],
      reach: [15, 65],
    },
  ],


  // o estranho inteiro: portal do anel abrindo pra outro lugar, os escudos de
  // runa girando, o olho de agamotto aceso com o sigilo verde do tempo, e as faíscas
  'doutor-estranho': [
    {
      glyphs: [G.Mandala],
      motion: 'haunt',
      count: 4,
      size: [80, 180],
      duration: [7, 11],
      colors: ['#f39a3c', '#ffb65c', '#e0782a'],
      opacity: [0.4, 0.8],
      spin: true,
    },
    // o sigilo do olho de agamotto: o feitiço do tempo, em verde da joia
    {
      glyphs: [G.Mandala],
      motion: 'haunt',
      count: 3,
      size: [120, 220],
      duration: [8, 12],
      colors: ['#3ddc84', '#7dffb0', '#2fbf6a'],
      opacity: [0.45, 0.85],
      spin: true,
    },
    // o portal não gira: a montanha lá dentro ficaria de cabeça pra baixo
    {
      glyphs: [G.SlingPortal],
      motion: 'haunt',
      count: 2,
      size: [100, 180],
      duration: [8, 12],
      opacity: [0.7, 0.95],
      tilt: [2, 5],
      swayDur: [2, 3],
    },
    {
      glyphs: [G.EyeOfAgamotto],
      motion: 'haunt',
      count: 2,
      size: [60, 110],
      duration: [6, 9],
      opacity: [0.75, 1],
      band: [10, 70],
    },
    {
      glyphs: [G.Dot],
      motion: 'rise',
      count: 24,
      size: [3, 6],
      duration: [6, 12],
      colors: ['#ffb65c', '#f39a3c'],
      opacity: [0.3, 0.8],
      sway: [6, 18],
    },
  ],


  // raio em neon de sakaar
  'thor-ragnarok': [
    {
      glyphs: G.BOLTS,
      motion: 'strike',
      count: 14,
      size: [130, 260],
      duration: [3, 6],
      colors: ['#7fd6ff', '#c9a6ff', '#ffe36e', '#ff6fb5'],
      opacity: [0.75, 1],
      band: [-4, 6],
    },
  ],

  // capitão contra homem de ferro: o escudo quicando pela tela, girando
  'capitao-america-guerra-civil': [
    {
      glyphs: [G.Shield],
      motion: 'ricochet',
      count: 5,
      size: [34, 70],
      duration: [6, 10],
      opacity: [0.5, 0.9],
      spin: true,
      band: [6, 88],
      direction: 'both',
    },
    // o outro lado da guerra: o homem de ferro cruzando, atirando, e o clarão
    // do repulsor estourando
    {
      glyphs: [G.IronManFlying],
      motion: 'across',
      count: 2,
      size: [170, 250],
      duration: [6, 9],
      opacity: [0.85, 1],
      band: [10, 70],
      direction: 'both',
      tilt: [2, 5],
      swayDur: [1.5, 2.5],
    },
    {
      glyphs: [G.RepulsorBlast],
      motion: 'across',
      count: 4,
      size: [140, 240],
      duration: [1.8, 3],
      colors: ['#7fd6ff'],
      opacity: [0.7, 1],
      band: [8, 88],
      direction: 'both',
    },
    {
      glyphs: [G.ArcReactorFlash],
      motion: 'strike',
      count: 5,
      size: [40, 100],
      duration: [3, 6],
      colors: ['#bfe8ff'],
      opacity: [0.7, 1],
      band: [8, 85],
    },
  ],

  // a casa de doce desmoronando em bala
  'joao-e-maria-cacadores-de-bruxas': [
    {
      glyphs: [G.Candy, G.Lollipop],
      motion: 'fall',
      count: 18,
      size: [18, 40],
      duration: [9, 16],
      colors: ['#e86a8a', '#7fc8a9', '#f2c14e', '#b48ae8', '#ef8a4c'],
      opacity: [0.45, 0.85],
      sway: [6, 20],
      spin: true,
    },
    // o boneco de gengibre cai de pé, balançando — girando ficava estranho
    {
      glyphs: [G.Gingerbread],
      motion: 'fall',
      count: 5,
      size: [26, 40],
      duration: [11, 17],
      colors: ['#e86a8a', '#7fc8a9', '#f2c14e'],
      opacity: [0.55, 0.9],
      sway: [8, 22],
      tilt: [8, 20],
    },
  ],


  // cápsula caindo e a moeda de ouro do continental
  'john-wick-de-volta-ao-jogo': [
    {
      glyphs: [G.Casing],
      motion: 'fall',
      count: 18,
      size: [8, 14],
      duration: [5, 10],
      colors: ['#c9a24e', '#b58b3c', '#dcb766'],
      opacity: [0.35, 0.8],
      sway: [2, 8],
      spin: true,
    },
    {
      glyphs: [G.ContinentalCoin],
      motion: 'fall',
      count: 14,
      size: [24, 40],
      duration: [12, 18],
      colors: GOLD,
      opacity: [0.5, 0.85],
      sway: [4, 12],
      flip: true,
    },
  ],

  // a máscara do pânico aparecendo no escuro, e a faca voando
  'todo-mundo-em-panico-6': [
    {
      glyphs: [G.Ghostface],
      motion: 'haunt',
      count: 12,
      size: [36, 84],
      duration: [5, 9],
      colors: ['#f5f1e8'],
      opacity: [0.45, 0.85],
      tilt: [3, 8],
      swayDur: [1.4, 2.4],
    },
    // e a faca dele, arremessada, girando pela tela
    {
      glyphs: [G.Knife],
      motion: 'across',
      count: 6,
      size: [60, 105],
      duration: [4, 7],
      colors: ['#ffffff'],
      opacity: [0.6, 0.95],
      band: [8, 85],
      direction: 'both',
      spin: true,
    },
  ],

  // o que o jack faz: caveira surgindo e rindo
  'o-estranho-mundo-de-jack': [
    {
      glyphs: [G.JackSkull],
      motion: 'haunt',
      count: 22,
      size: [26, 70],
      duration: [5, 9],
      colors: ['#f5f1e8'],
      opacity: [0.45, 0.85],
      tilt: [5, 14],
      swayDur: [0.9, 1.6],
    },
  ],

  // as runas de verdade (angelical, voyance, iratze, parabatai…) se desenhando, em ouro de anjo
  'os-instrumentos-mortais-cidade-dos-ossos': [
    {
      glyphs: G.RUNE_GLYPHS,
      motion: 'haunt',
      count: 11,
      size: [50, 110],
      duration: [6, 10],
      colors: ['#e6c07a', '#f3d9a4'],
      opacity: [0.45, 0.9],
    },
  ],

  // a chuva do beijo, e de vez em quando um cisne atravessando o lago
  'diario-de-uma-paixao': [
    {
      glyphs: [G.RainDrop],
      motion: 'fall',
      count: 150,
      size: [2, 3.5],
      duration: [0.9, 1.7],
      colors: ['#c9d3e6'],
      opacity: [0.18, 0.45],
    },
    {
      glyphs: [G.Swan],
      motion: 'across',
      count: 6,
      size: [60, 110],
      duration: [40, 70],
      colors: ['#f5f1e8'],
      opacity: [0.35, 0.55],
      band: [56, 88],
      direction: 'ltr',
      tilt: [1, 2],
      swayDur: [3, 4],
    },
  ],

  // a aurora de fogo do filme, e o urso passando lá embaixo
  'irmao-urso': [
    // a cortina seca vem primeiro, pra ficar por trás das de fogo
    {
      glyphs: G.AURORA_BACK,
      motion: 'aurora',
      count: 1,
      size: [0, 0],
      duration: [22, 30],
      opacity: [0.6, 0.75],
      band: [9, 9],
    },
    {
      glyphs: G.AURORAS,
      motion: 'aurora',
      count: 2,
      size: [0, 0],
      duration: [16, 26],
      opacity: [0.8, 0.95],
    },
    {
      glyphs: [G.BearPaw],
      motion: 'steps',
      count: 12,
      size: [36, 40],
      duration: [16, 16],
      colors: ['#f5f1e8'],
      opacity: [0.28, 0.36],
      band: [84, 74],
    },
  ],

  // a casa da moeda imprimindo euro
  'la-casa-de-papel': [
    {
      glyphs: [G.EuroNote],
      motion: 'fall',
      count: 45,
      size: [52, 84],
      duration: [9, 16],
      colors: ['#d98b4a', '#c97b3d', '#e39a5c'],
      opacity: [0.45, 0.85],
      sway: [20, 60],
      tilt: [10, 30],
      swayDur: [2, 3.5],
      flip: true,
    },
  ],
}

/**
 * Sorteio com semente: o mesmo filme monta sempre a mesma coreografia, e nada
 * muda de lugar quando o React redesenha.
 */
function seeded(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

const lerp = ([a, b]: Range, t: number) => a + (b - a) * t

/** Onde o balanço tem o eixo: tentáculo balança da base, holofote e aranha do alto. */
const ORIGIN: Partial<Record<Motion, string>> = {
  emerge: 'bottom center',
  dangle: 'top center',
  beam: 'top center',
  swing: 'top center',
}

/** Cada partícula da camada já posicionada, com os tempos dela. */
function build(slug: string, layer: Layer, li: number) {
  const rnd = seeded(`${slug}:${li}`)
  const { motion, count } = layer
  const band = layer.band ?? [4, 88]
  return Array.from({ length: count }, (_, i) => {
    const depth = rnd() // 0 = longe (pequena, apagada, lenta), 1 = perto
    let duration = lerp(layer.duration, 1 - depth * 0.6)
    let delay = -rnd() * duration // atraso negativo: já abre com a tela povoada

    const pos: Record<string, string> = {}
    // espalha por colunas, pra não amontoar num canto
    const col = (i / count) * 100 + rnd() * (100 / count)

    switch (motion) {
      case 'rise':
      case 'fall':
        pos.left = `${col}%`
        break
      case 'across':
        pos.top = `${lerp(band, rnd())}%`
        break
      case 'ricochet':
        // os dois lados de onde ele bate: um no alto, outro embaixo
        pos['--y1'] = `${5 + rnd() * 30}vh`
        pos['--y2'] = `${58 + rnd() * 30}vh`
        break
      case 'haunt':
      case 'strike':
        pos.left = `${col}%`
        pos.top = `${lerp(band, rnd())}%`
        break
      case 'emerge':
        pos.left = `${col - 4}%`
        pos['--reach'] = `${lerp(layer.reach ?? [0, 35], rnd())}%`
        break
      case 'dangle':
        pos.left = `${col}%`
        pos['--reach'] = `${lerp(layer.reach ?? [20, 60], rnd())}vh`
        break
      case 'steps': {
        // uma trilha só, da esquerda pra direita, pata esquerda e direita alternando
        duration = layer.duration[0]
        delay = (i * duration * 0.5) / count
        const t = (i + 0.5) / count
        pos.left = `${t * 100}%`
        pos.top = `calc(${lerp(band, t)}% + ${i % 2 ? 24 : -24}px)`
        break
      }
      case 'beam':
        pos.left = `${15 + ((i + 0.5) / count) * 70}%`
        break
      case 'swing':
        pos.left = `${10 + ((i + 0.5) / count) * 80 + (rnd() - 0.5) * 10}%`
        break
      case 'corner': {
        // um canto pra cada, na ordem: cima-esq, cima-dir, baixo-esq, baixo-dir
        const right = i % 2 === 1
        const bottom = i % 4 >= 2
        const w = lerp(layer.size, depth)
        pos.left = right ? `calc(100% - ${w}px)` : '0px'
        pos.top = bottom ? `calc(100% - ${w}px)` : '0px'
        pos.transformOrigin = `${bottom ? 'bottom' : 'top'} ${right ? 'right' : 'left'}`
        pos['--mirror'] = `scale(${right ? -1 : 1}, ${bottom ? -1 : 1})`
        break
      }
      case 'aurora':
        pos.top = `${(layer.band?.[0] ?? -4) + i * 7}%`
        break
    }

    const colors = layer.colors
    const reverse =
      (motion === 'across' || motion === 'ricochet') &&
      (layer.direction === 'rtl' || (layer.direction === 'both' && i % 2 === 1))
    return {
      key: `${li}-${i}`,
      Glyph: layer.glyphs[Math.floor(rnd() * layer.glyphs.length)],
      travel: {
        ...pos,
        width: motion === 'aurora' ? '140%' : lerp(layer.size, depth),
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        animationDirection: reverse ? 'reverse' : undefined,
        '--d': `${duration}s`,
        '--delay': `${delay}s`,
      } as CSSProperties,
      sway: {
        // no swing o balanço anda junto com a passada: meia volta enquanto aparece
        animationDuration: `${motion === 'swing' ? duration / 2 : lerp(layer.swayDur ?? [3, 6], rnd())}s`,
        animationDelay: `${motion === 'swing' ? delay : -rnd() * 4}s`,
        transformOrigin: ORIGIN[motion],
        '--sway': `${layer.sway ? lerp(layer.sway, rnd()) : 0}px`,
        '--tilt': `${layer.tilt ? lerp(layer.tilt, rnd()) : 0}deg`,
      } as CSSProperties,
      turn: {
        animationDuration: `${(layer.flip ? 1.4 : 3) + rnd() * 3}s`,
        animationDirection: rnd() < 0.5 ? 'normal' : 'reverse',
      } as CSSProperties,
      look: {
        color: colors ? colors[Math.floor(rnd() * colors.length)] : undefined,
        // bicho que anda pra esquerda vira o corpo pro lado que anda; a teia de
        // canto se espelha pro canto dela
        transform: reverse ? 'scaleX(-1)' : motion === 'corner' ? pos['--mirror'] : undefined,
        opacity: lerp(layer.opacity ?? [0.3, 0.7], depth),
      } as CSSProperties,
    }
  })
}

/**
 * A camada de clima, por trás da ficha aberta. Recebe `off` pro que ainda não
 * vimos: esse fica sem clima nenhum, mesmo que um dia tenha entrada aqui.
 */
/** Se o título tem clima (e não é da lista de espera). */
export const hasAmbience = (title: string, off?: boolean) => !off && slugify(title) in AMBIENCES

export function AmbienceLayer({ title, off }: { title: string; off?: boolean }) {
  const slug = slugify(title)
  const amb = off ? undefined : AMBIENCES[slug]

  const layers = useMemo(
    () => (amb ?? []).map((layer, li) => ({ layer, particles: build(slug, layer, li) })),
    [amb, slug],
  )

  if (!amb) return null

  return (
    <div aria-hidden className="ambience pointer-events-none absolute inset-0 overflow-hidden">
      {layers.map(({ layer, particles }) =>
        particles.map((p) => (
          <span key={p.key} className={`amb-travel amb-${layer.motion} absolute`} style={p.travel}>
            {layer.motion === 'dangle' && <span className="amb-thread" />}
            <span className="amb-sway block" style={p.sway}>
              <span
                className={`block ${layer.spin ? 'amb-spin' : layer.flip ? 'amb-flip' : ''}`}
                style={layer.spin || layer.flip ? p.turn : undefined}
              >
                <span className="block" style={p.look}>
                  <p.Glyph className="block h-auto w-full" />
                </span>
              </span>
            </span>
          </span>
        )),
      )}
    </div>
  )
}
