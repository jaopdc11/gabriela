import {
  monthDedications,
  monthMarks,
  place,
  type Arc,
  type Dedication,
  type Finale,
  type Milestone,
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

/**
 * A curva daquele mês. Todo capítulo nasce da mesma curva do mundo, e se ela
 * for usada crua todos os meses saem com o MESMO desenho — no mapa, onde eles
 * aparecem juntos, isso vira pauta de caderno por mais que a gente afaste um do
 * outro. Então cada mês torce a curva do seu jeito: outra fase, outra altura de
 * onda, outro tanto de ondulação. É fixo por número do mês (nunca sorteado), e
 * o mês 1 fica idêntico ao que já foi publicado.
 */
const AMP = [1, 0.82, 1.15, 0.92]
const FREQ = [1, 1.4, 0.85, 1.2]
const chapterArc = (a: Arc, n: number): Arc => {
  const i = (n - 1) % 4
  return {
    ...a,
    amp: a.amp * AMP[i],
    freq: a.freq * FREQ[i],
    phase: a.phase + (n - 1) * 2.1,
  }
}

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

/**
 * Meia-noite do dia de `d`. O mês vira no DIA do aniversário de mês, não na
 * hora: o sim foi 23/07 às 21:30, mas o dia 23 inteiro já é aniversário. Sem
 * isso, no dia 23 de manhã o site ainda abriria no mês anterior — e é de manhã,
 * no dia, que eu mostro pra ela.
 */
const dayStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()

/** Meses de namoro já completos em `at` (0 = ainda dentro do primeiro mês). */
export function monthsCompleted(start: Date, at: Date): number {
  let m = (at.getFullYear() - start.getFullYear()) * 12 + (at.getMonth() - start.getMonth())
  // o mês fecha quando chega o dia do aniversário de mês, na virada dele
  if (m > 0 && dayStart(at) < dayStart(addMonths(start, m))) m--
  return Math.max(0, m)
}

/** Em que capítulo (1-based) uma data cai. */
export const chapterOf = (start: Date, at: Date) => monthsCompleted(start, at) + 1

/** Rótulo curto de um capítulo, também usado no filtro do álbum. */
export const chapterNav = (n: number) => `mês ${n}`

/**
 * Monta os capítulos do mundo: um por mês vivido, do sim até hoje. O mês
 * corrente só entra quando já tem estrela.
 *
 * `dev` (o `import.meta.env.DEV` do Vite) libera o que está marcado como
 * rascunho — a carta e o fecho do mês: aparecem rodando local, e ficam fora do
 * site publicado. Rodando local, também aparecem antes de o mês fechar.
 */
export function buildChapters(world: World, start: Date, now: Date, dev: boolean): Chapter[] {
  const source = world.milestones ?? world.stars ?? []
  // a data manda, a não ser que a estrela diga em que mês ela quer entrar
  const chapterOfStar = (s: Milestone) => s.chapter ?? chapterOf(start, s.date)
  const lastStar = source.reduce((max, s) => Math.max(max, chapterOfStar(s)), 0)
  /**
   * O mês corrente só entra quando já tem estrela nele. Vazio, ele é só uma
   * cartela do mês que vem roubando a festa do que fechou — e como o site é
   * entregue no aniversário de mês, na prática ela vê cada mês novo já pronto.
   */
  const total = Math.max(chapterOf(start, now) - 1, lastStar, 1)

  return Array.from({ length: total }, (_, i) => {
    const n = i + 1
    const chapterStart = addMonths(start, i)
    const chapterEnd = addMonths(start, n)
    const stars = source.filter((s) => chapterOfStar(s) === n)
    const closed = dayStart(now) >= dayStart(chapterEnd)
    /**
     * No site publicado, a carta e o fecho do mês só entram quando o mês fechou
     * de verdade, e nunca se forem rascunho. Rodando local aparece tudo, pra dar
     * pra ver como ficou antes de ela ver.
     */
    const ready = (piece?: { draft?: boolean }) => !!piece && (dev || (closed && !piece.draft))

    const mark = monthMarks[n]
    /**
     * Sem estrela de aniversário de mês escrita, quem fecha o capítulo é a
     * ÚLTIMA ESTRELA DO ARRAY do mês (a ordem do array manda, não a data) — o
     * mês acaba no último momento que aconteceu, sem precisar de uma estrela
     * escrita só pra fechar. Precisa sobrar pelo menos uma estrela comum.
     */
    const promoted =
      !ready(mark) && (dev || closed) && stars.length > 1 ? stars[stars.length - 1] : undefined

    const finale: Finale | undefined = ready(mark)
      ? { ...mark, date: chapterEnd, label: markLabel(n), x: 97, y: 12 }
      : promoted
        ? { ...promoted, label: markLabel(n), x: 97, y: 12 }
        : undefined

    // a estrela promovida sai da constelação: ela agora é o fecho
    const rest = promoted ? stars.slice(0, -1) : stars

    // a curva desse mês, e com fecho ela encolhe um pouco pra abrir espaço no fim
    const mine = chapterArc(world.arc, n)
    const arc = finale ? { ...mine, x1: Math.min(mine.x1, 90) } : mine

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
      stars: place(rest, arc),
      finale,
      dedication,
      current: n === chapterOf(start, now),
      closed,
    }
  })
}
