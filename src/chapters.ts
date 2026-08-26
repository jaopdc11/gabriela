import {
  monthDedications,
  monthMarks,
  place,
  type Dedication,
  type Finale,
  type PlacedStar,
  type World,
} from './data'

/**
 * Um capítulo do namoro: um mês corrido, contado do dia do sim. Tem cartela,
 * céu e fecho próprios — e nasce sozinho quando o mês vira, sem precisar mexer
 * em nada aqui.
 */
export type Chapter = {
  /** 1 = o primeiro mês. */
  n: number
  /** Rótulo curto, nos botões: 'mês 1'. */
  nav: string
  /** Numeral da cartela: 'I', 'II', 'III'. */
  roman: string
  /** Nome do capítulo na cartela: 'o primeiro mês'. */
  name: string
  /** O mesmo nome sem artigo, pra encaixar em frase: 'a carta do primeiro mês'. */
  bareName: string
  /** Início (o dia do sim + n-1 meses) e fim (exclusivo) do mês. */
  start: Date
  end: Date
  /** Semente do céu de apoio — cada mês tem o seu próprio fundo de estrelas. */
  seed: number
  stars: PlacedStar[]
  /** A estrela do aniversário de mês: fecha o capítulo (ver `monthMarks`). */
  finale?: Finale
  /** A carta do mês, que abre o capítulo (ver `monthDedications`). */
  dedication?: Dedication
  /** O mês que está sendo vivido agora. */
  current: boolean
  /** O mês já virou: o aniversário de mês passou, o capítulo está completo. */
  closed: boolean
}

const NAMES = [
  'o primeiro mês',
  'o segundo mês',
  'o terceiro mês',
  'o quarto mês',
  'o quinto mês',
  'o sexto mês',
  'o sétimo mês',
  'o oitavo mês',
  'o nono mês',
  'o décimo mês',
  'o décimo primeiro mês',
  'o décimo segundo mês',
]

const ROMAN: [number, string][] = [
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
]

/** Numeral romano (o suficiente pra uns bons anos de namoro). */
export function roman(n: number): string {
  let rest = n
  let out = ''
  for (const [v, s] of ROMAN) {
    while (rest >= v) {
      out += s
      rest -= v
    }
  }
  return out
}

/** Nome do capítulo: por extenso até o décimo segundo, depois só o número. */
const nameOf = (n: number) => NAMES[n - 1] ?? `o mês ${n}`

const COUNT = [
  'um',
  'dois',
  'três',
  'quatro',
  'cinco',
  'seis',
  'sete',
  'oito',
  'nove',
  'dez',
  'onze',
  'doze',
]

/** O que a estrela do aniversário de mês anuncia: "um mês de nós", "dois meses de nós". */
const markLabel = (n: number) =>
  `${COUNT[n - 1] ?? n} ${n === 1 ? 'mês' : 'meses'} de nós`

/** `d` mais `n` meses, sem estourar pra o mês seguinte em mês curto. */
export function addMonths(d: Date, n: number): Date {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1)
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()
  return new Date(
    target.getFullYear(),
    target.getMonth(),
    Math.min(d.getDate(), lastDay),
    d.getHours(),
    d.getMinutes(),
    d.getSeconds(),
  )
}

/** Meses de namoro já completos em `at` (0 = ainda dentro do primeiro mês). */
export function monthsCompleted(start: Date, at: Date): number {
  let m = (at.getFullYear() - start.getFullYear()) * 12 + (at.getMonth() - start.getMonth())
  // o mês só fecha quando chega o dia (e a hora) do aniversário de mês
  if (m > 0 && at.getTime() < addMonths(start, m).getTime()) m--
  return Math.max(0, m)
}

/** Em que capítulo (1-based) uma data cai. */
export const chapterOf = (start: Date, at: Date) => monthsCompleted(start, at) + 1

/** Rótulo curto de um capítulo, também usado no filtro do álbum. */
export const chapterNav = (n: number) => `mês ${n}`

/**
 * Monta os capítulos do mundo: um por mês vivido, do sim até hoje. O mês
 * corrente entra mesmo vazio — ele é o que está acontecendo agora.
 *
 * `dev` (o `import.meta.env.DEV` do Vite) libera o que está marcado como
 * rascunho — a carta e o fecho do mês: aparecem rodando local, e ficam fora do
 * site publicado. Rodando local, também aparecem antes de o mês fechar.
 */
export function buildChapters(world: World, start: Date, now: Date, dev: boolean): Chapter[] {
  const source = world.milestones ?? world.stars ?? []
  const lastStar = source.reduce((max, s) => Math.max(max, chapterOf(start, s.date)), 0)
  const total = Math.max(chapterOf(start, now), lastStar, 1)

  return Array.from({ length: total }, (_, i) => {
    const n = i + 1
    const chapterStart = addMonths(start, i)
    const chapterEnd = addMonths(start, n)
    const stars = source.filter((s) => chapterOf(start, s.date) === n)
    const closed = now.getTime() >= chapterEnd.getTime()
    /**
     * No site publicado, a carta e o fecho do mês só entram quando o mês fechou
     * de verdade, e nunca se forem rascunho. Rodando local aparece tudo, pra dar
     * pra ver como ficou antes de ela ver.
     */
    const ready = (piece?: { draft?: boolean }) => !!piece && (dev || (closed && !piece.draft))

    const mark = monthMarks[n]
    const finale: Finale | undefined =
      ready(mark)
        ? {
            ...mark,
            date: chapterEnd,
            label: markLabel(n),
            x: 93,
            y: 12,
          }
        : undefined

    // com fecho de mês, a curva encolhe um pouco pra abrir espaço pra ele no fim
    const arc = finale ? { ...world.arc, x1: Math.min(world.arc.x1, 84) } : world.arc

    const letter = monthDedications[n]
    const dedication = ready(letter) ? letter : undefined

    const name = nameOf(n)

    return {
      n,
      nav: chapterNav(n),
      roman: roman(n),
      name,
      bareName: name.replace(/^o /, ''),
      start: chapterStart,
      end: chapterEnd,
      seed: world.seed + n * 977,
      // o céu de cada mês é montado sozinho pela curva do mundo
      stars: place(stars, arc),
      finale,
      dedication,
      current: n === chapterOf(start, now),
      closed,
    }
  })
}
