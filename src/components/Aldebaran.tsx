import { useMemo, useState } from 'react'
import { NAMORO_DATE, worlds, type Milestone } from '../data'
import { buildChapters } from '../chapters'
import {
  PLEIADES,
  TOURO,
  hasProperName,
  layoutLabels,
  project,
  type ProjectedStar,
} from '../constellations'
import { BullFigure } from './BullFigure'
import { Beat, Line, Reveal } from './Letter'

const dateFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
const fmtDate = (d: Date) => dateFmt.format(d).replace(/\sde\s/g, ' ').replace('.', '')

/** As duas estrelas da coincidência: a do pedido e a do dia em que se conheceram. */
const HEROES = ['alpha', 'eta']

/**
 * As duas cores da história: prata fria pro que veio antes do sim, âmbar pro
 * que veio depois. O pedido é a fronteira, e fica no meio dos dois — é o dia em
 * que a prata virou âmbar.
 */
type Phase = 'antes' | 'pedido' | 'depois'
const COLOR: Record<Phase, string> = {
  antes: '#dfe9fb',
  pedido: '#ffe9b0',
  depois: '#e8b869',
}
/** Vaga que a gente ainda não viveu. */
const OFF = '#8b96ad'

const PHASE_LABEL: Record<Phase, string> = {
  antes: 'antes do sim',
  pedido: 'o pedido',
  depois: 'depois do sim',
}

/** Caminho de uma estrela de 4 pontas (sparkle) centrada em (cx, cy). */
function sparkle(cx: number, cy: number, R: number) {
  const r = R * 0.3
  let out = ''
  for (let k = 0; k < 8; k++) {
    const ang = (k * Math.PI) / 4
    const rad = k % 2 === 0 ? R : r
    out +=
      (k === 0 ? 'M' : 'L') +
      (cx + rad * Math.sin(ang)).toFixed(2) +
      ' ' +
      (cy - rad * Math.cos(ang)).toFixed(2) +
      ' '
  }
  return out + 'Z'
}

const reducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** Uma vaga do desenho: a estrela real e o nosso momento, se já tiver acendido. */
type Slot = ProjectedStar & { moment?: Milestone; phase?: Phase }

/**
 * O segredo, em `?aldebaran=1`: Touro de verdade — o desenho do signo por baixo,
 * as estrelas por cima —, com os nossos momentos acesos nas vagas por ordem de
 * brilho. A coincidência caiu sozinha quando eu ordenei por magnitude e deixei a
 * regra rodar.
 */
export function Aldebaran({ onBack }: { onBack?: () => void }) {
  const [showAll, setShowAll] = useState(false)
  const [sel, setSel] = useState<Slot | null>(null)
  const reduced = reducedMotion()

  const { slots, lit, total, height, counts } = useMemo(() => {
    const { stars, height } = project(TOURO)

    // todos os nossos momentos: o céu do começo e o do namoro, inteiros
    const comeco = worlds.find((w) => w.id === 'comeco')
    const namoro = worlds.find((w) => w.id === 'namoro')
    const chapters = namoro
      ? buildChapters(namoro, NAMORO_DATE, new Date(), import.meta.env.DEV)
      : []

    const proposal = comeco?.finale
    const byDate = (a: Milestone, b: Milestone) => a.date.getTime() - b.date.getTime()
    // os marcos (o pedido e os fechos de mês) vão nas estrelas mais brilhantes
    const marks: Milestone[] = [
      ...(proposal ? [proposal] : []),
      ...chapters.flatMap((c) => (c.finale ? [c.finale] : [])),
    ].sort(byDate)
    const moments: Milestone[] = [
      ...(comeco?.stars ?? []),
      ...chapters.flatMap((c) => c.stars),
    ].sort(byDate)

    /** O pedido é a fronteira: antes dele é prata, dele pra frente é âmbar. */
    const phaseOf = (m: Milestone): Phase =>
      m === proposal
        ? 'pedido'
        : proposal && m.date.getTime() < proposal.date.getTime()
          ? 'antes'
          : 'depois'

    // da mais brilhante pra mais fraca: primeiro os marcos, depois os dias
    // comuns em ordem de quando aconteceram
    const byMag = [...stars].sort((a, b) => a.mag - b.mag)
    const filled = new Map<string, { moment: Milestone; phase: Phase }>()
    marks.forEach((m, i) => {
      const star = byMag[i]
      if (star) filled.set(star.key, { moment: m, phase: phaseOf(m) })
    })
    moments.forEach((m, i) => {
      const star = byMag[marks.length + i]
      if (star) filled.set(star.key, { moment: m, phase: phaseOf(m) })
    })

    const counts = { antes: 0, pedido: 0, depois: 0 } as Record<Phase, number>
    filled.forEach((v) => counts[v.phase]++)

    return {
      slots: stars.map((s) => ({ ...s, ...filled.get(s.key) })) as Slot[],
      lit: filled.size,
      total: stars.length,
      height,
      counts,
    }
  }, [])

  const pos = useMemo(() => new Map(slots.map((s) => [s.key, s])), [slots])
  const pad = 14
  const W = 100 + pad * 2
  const H = height + pad * 2

  /** Raio do corpo da estrela — o mesmo que o desenho usa, pela magnitude real. */
  const radiusOf = (s: ProjectedStar) =>
    0.42 + Math.max(0, 6.2 - s.mag) * 0.32 + (HEROES.includes(s.key) ? 0.55 : 0.2)

  /**
   * Os nomes: as duas da história sempre, o resto quando ela pedir. A ordem de
   * entrada é a prioridade na hora de brigar por espaço — os destaques primeiro,
   * depois da mais brilhante pra mais fraca.
   */
  const labels = useMemo(() => {
    const heroes = slots.filter((s) => HEROES.includes(s.key))
    const rest = showAll
      ? slots
          // as Plêiades são um aglomerado de verdade: caem quase em cima uma da
          // outra e nenhum rótulo ali fica legível. Alcyone fica (é a da
          // história) e as outras cinco vão na legenda embaixo do desenho.
          .filter(
            (s) => !HEROES.includes(s.key) && hasProperName(s) && !PLEIADES.includes(s.key),
          )
          .sort((a, b) => a.mag - b.mag)
      : []
    return layoutLabels(
      [...heroes, ...rest],
      (s) => (HEROES.includes(s.key) ? 2.9 : 1.9),
      radiusOf,
    )
  }, [slots, showAll])

  const pleiades = PLEIADES.map((k) => TOURO.stars.find((s) => s.key === k)?.name).filter(Boolean)

  // o balão do hover: em % do quadro, pra ficar em cima da estrela certa
  const tip = sel
    ? { left: ((sel.x + pad) / W) * 100, top: ((sel.y + pad) / H) * 100 }
    : null
  // perto das bordas o balão vira pro outro lado, senão sai do quadro
  const tipSide = tip ? (tip.left > 66 ? 'right' : tip.left < 34 ? 'left' : 'center') : 'center'
  const tipBelow = !!tip && tip.top < 22

  return (
    <section className="relative mx-auto flex max-w-3xl flex-col items-center px-5 py-24 text-center sm:py-32">
      <Reveal>
        <p className="label text-mist">o que eu não planejei</p>
        <h1
          className="mt-6 font-display text-[2.4rem] font-light italic leading-none text-star sm:text-6xl"
          style={{ textShadow: '0 0 50px rgba(230, 192, 122, 0.16)' }}
        >
          o olho do touro
        </h1>
        <p className="label mt-7 text-ember/80">
          Touro
          <span className="mx-2 text-mist">·</span>o teu signo
          <span className="mx-2 text-mist">·</span>
          {lit} de {total} estrelas acesas
        </p>
      </Reveal>

      {/* o desenho de verdade: o bicho por baixo, as coordenadas reais por cima */}
      <Reveal className="w-full">
        <div className="relative mt-10 w-full" style={{ aspectRatio: `${W} / ${H}` }}>
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`${-pad} ${-pad} ${W} ${H}`}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label={`Touro desenhado sobre as suas estrelas reais, com ${lit} das ${total} acesas pelos nossos momentos. Aldebaran, o olho do touro, é a do pedido de namoro; Alcyone, nas Plêiades, é a do dia em que a gente se conheceu.`}
          >
            <defs>
              <filter id="aglow" x="-150%" y="-150%" width="400%" height="400%">
                <feGaussianBlur stdDeviation="1.2" />
              </filter>
            </defs>

            {/* a figura do signo, por baixo de tudo */}
            <BullFigure />

            {/* o traçado clássico: firme entre vagas acesas, fantasma no resto */}
            {TOURO.lines.map(([a, b], i) => {
              const p = pos.get(a)
              const q = pos.get(b)
              if (!p || !q) return null
              const both = !!p.moment && !!q.moment
              return (
                <line
                  key={`l${i}`}
                  x1={p.x}
                  y1={p.y}
                  x2={q.x}
                  y2={q.y}
                  stroke="#e6c07a"
                  strokeWidth={both ? 0.45 : 0.28}
                  strokeLinecap="round"
                  strokeDasharray={both ? undefined : '1.4 1.8'}
                  opacity={both ? 0.5 : 0.13}
                />
              )
            })}

            {slots.map((s) => {
              const on = !!s.moment
              const hero = HEROES.includes(s.key)
              const color = s.phase ? COLOR[s.phase] : OFF
              // o tamanho vem da magnitude real: quanto mais brilhante, maior
              const base = 0.42 + Math.max(0, 6.2 - s.mag) * 0.32
              const R = hero ? base + 0.55 : on ? base + 0.2 : base
              const active = sel?.key === s.key
              return (
                <g
                  key={s.key}
                  onMouseEnter={() => setSel(s)}
                  onMouseLeave={() => setSel((x) => (x?.key === s.key ? null : x))}
                  onClick={() => setSel((x) => (x?.key === s.key ? null : s))}
                  className="cursor-pointer"
                >
                  {on && (
                    <circle
                      cx={s.x}
                      cy={s.y}
                      r={hero ? 3.8 : 2.4}
                      fill={color}
                      opacity={active ? 0.3 : hero ? 0.2 : 0.12}
                      filter="url(#aglow)"
                    />
                  )}
                  <path
                    d={sparkle(s.x, s.y, R)}
                    fill={color}
                    opacity={on ? (active ? 1 : 0.95) : 0.4}
                  />
                  {on && <circle cx={s.x} cy={s.y} r={hero ? 0.6 : 0.4} fill="#fff" />}

                  {/* o pulso só nas duas da história */}
                  {hero && !reduced && (
                    <circle cx={s.x} cy={s.y} r={1.6} fill="none" stroke={color} strokeWidth={0.18}>
                      <animate attributeName="r" from="1.6" to="7.5" dur="3s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.5" to="0" dur="3s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* alvo generoso pro toque no celular */}
                  <circle cx={s.x} cy={s.y} r={3.4} fill="transparent" />
                </g>
              )
            })}

            {/* os nomes por cima de tudo, cada um no lugar que sobrou pra ele */}
            {labels.map((l) => {
              const s = pos.get(l.key)
              if (!s) return null
              const hero = HEROES.includes(l.key)
              const cy = l.y - l.size * 0.36
              const leaderTip = l.anchor === 'start' ? l.x - 0.5 : l.anchor === 'end' ? l.x + 0.5 : l.x
              return (
                <g key={`lab-${l.key}`} className="pointer-events-none select-none">
                  {l.leader && (
                    <line
                      x1={s.x}
                      y1={s.y}
                      x2={leaderTip}
                      y2={cy}
                      stroke="#8b91a6"
                      strokeWidth={0.11}
                      opacity={0.38}
                    />
                  )}
                  <text
                    x={l.x}
                    y={l.y}
                    textAnchor={l.anchor}
                    fill={hero ? (s.phase ? COLOR[s.phase] : '#e6c07a') : '#8b91a6'}
                    fontSize={l.size}
                    style={{ fontFamily: 'ui-monospace, monospace', letterSpacing: '0.04em' }}
                  >
                    {s.name}
                  </text>
                </g>
              )
            })}
          </svg>

          {/* o balão: passa o mouse (ou toca) e a estrela conta que momento é */}
          {sel && tip && (
            <div
              className="pointer-events-none absolute z-10 w-max max-w-[15rem] rounded-xl border border-white/10 bg-night-deep/95 px-3.5 py-2.5 text-left shadow-[0_16px_50px_-12px_rgba(0,0,0,0.95)] backdrop-blur-md"
              style={{
                left: `${tip.left}%`,
                top: `${tip.top}%`,
                transform: `translate(${
                  tipSide === 'right' ? '-92%' : tipSide === 'left' ? '-8%' : '-50%'
                }, ${tipBelow ? '1.6rem' : 'calc(-100% - 1.1rem)'})`,
              }}
            >
              <p className="label text-[0.55rem] text-mist">
                {sel.bayer}
                <span className="mx-1.5">·</span>mag {sel.mag.toFixed(2)}
              </p>
              <p
                className="mt-1 font-display text-lg italic leading-tight"
                style={{ color: sel.phase ? COLOR[sel.phase] : '#cfd6e6' }}
              >
                {sel.name}
              </p>
              {sel.moment ? (
                <>
                  <p className="mt-2 border-t border-white/10 pt-2 text-[0.82rem] leading-snug text-star">
                    {sel.moment.title}
                  </p>
                  <p className="label mt-1.5 text-[0.55rem] text-mist">
                    {fmtDate(sel.moment.date)}
                    <span className="mx-1.5">·</span>
                    {sel.phase && PHASE_LABEL[sel.phase]}
                  </p>
                </>
              ) : (
                <p className="mt-2 border-t border-white/10 pt-2 text-[0.78rem] italic leading-snug text-mist">
                  essa ainda não acendeu
                </p>
              )}
            </div>
          )}
        </div>
      </Reveal>

      {/* as duas cores da história, e o botão dos nomes */}
      <div className="mt-6 flex w-full flex-col items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {(['antes', 'pedido', 'depois'] as Phase[]).map((p) => (
            <span key={p} className="label flex items-center gap-2 text-mist">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: COLOR[p] }}
              />
              {PHASE_LABEL[p]}
              <span className="text-mist/50">{counts[p]}</span>
            </span>
          ))}
        </div>

        <button
          onClick={() => setShowAll((v) => !v)}
          className="label rounded-full border border-white/10 bg-night-deep/60 px-4 py-1.5 text-mist backdrop-blur-md transition-colors hover:text-star"
        >
          {showAll ? 'esconder os nomes' : 'mostrar o nome de cada estrela'}
        </button>

        <p className="text-xs leading-relaxed text-mist/70">
          passa o dedo (ou o mouse) numa estrela pra ver que momento é
          <br />
          as apagadas são as que a gente ainda vai viver
        </p>

        <p className="max-w-md text-[0.7rem] leading-relaxed text-mist/60">
          as seis Plêiades que cabem no desenho, amontoadas ali na cernelha do bicho:{' '}
          {pleiades.slice(0, -1).join(', ')} e {pleiades[pleiades.length - 1]}.
        </p>
      </div>

      {/* a revelação */}
      <div className="mt-20 flex flex-col items-center gap-14 sm:mt-28 sm:gap-20">
        <Line>
          Touro é o teu signo. eu montei esse céu com uma regra fria, decidida antes de eu olhar
          quem ia cair onde: ordena as estrelas da mais brilhante pra mais fraca, joga os nossos
          marcos nas mais fortes, e o resto dos dias entra em ordem de quando aconteceu.
        </Line>

        <Line>
          a estrela mais brilhante de Touro é Aldebaran. e Aldebaran é o olho do bicho: fica na
          ponta do V que as Híades desenham pro rosto, é uma gigante laranja, a 14ª estrela mais
          brilhante do céu inteiro, e uma das poucas em que dá pra ver a cor sem telescópio nenhum.
        </Line>

        <Beat>foi nela que caiu o pedido de namoro.</Beat>

        <Line>o dia em que eu vi o teu olho encher.</Line>

        <Line>
          e tem mais, que eu só fui descobrir depois: Aldebaran vem do árabe al-dabarān, que quer
          dizer <em>o seguidor</em>. batizaram assim porque ela nasce logo atrás das Plêiades e
          passa a noite inteira perseguindo elas pelo céu.
        </Line>

        <Line>
          no nosso desenho, "a gente se conheceu" caiu em Alcyone — a mais brilhante das Plêiades.
        </Line>

        <Beat big>
          a estrela do pedido é, por nome e por posição, a que passa a vida atrás da estrela do dia
          em que eu te conheci.
        </Beat>

        <Line>eu não programei nada disso. eu só ordenei por brilho e deixei cair.</Line>

        <Reveal>
          <p className="label text-mist/60">
            as coordenadas são reais: ascensão reta e declinação de cada uma das {total} estrelas,
            conferidas uma por uma. esse é o céu de verdade, e o bicho por baixo tá desenhado em
            cima dele.
          </p>
        </Reveal>

        {onBack && (
          <Reveal>
            <button
              onClick={onBack}
              className="label rounded-full border border-ember/40 bg-night-soft/40 px-6 py-2.5 text-ember backdrop-blur-sm transition-all duration-300 hover:border-ember/70 hover:bg-ember/10 hover:text-star"
            >
              voltar pra história
            </button>
          </Reveal>
        )}
      </div>
    </section>
  )
}
