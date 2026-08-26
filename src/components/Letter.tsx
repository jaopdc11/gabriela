import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Dedication } from '../data'
import { sacred } from '../sacred'

const reducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** Revela o filho quando ele entra na viewport: fade + leve subida saindo do desfoque. */
export function Reveal({
  children,
  className = '',
  threshold = 0.35,
  slow = false,
}: {
  children: ReactNode
  className?: string
  threshold?: number
  /** revelação mais demorada e mais fora de foco — usada nos fechos */
  slow?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(() => reducedMotion())

  useEffect(() => {
    if (reducedMotion()) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -12% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${slow ? 'duration-[1400ms]' : 'duration-[1100ms]'} ${
        shown
          ? 'translate-y-0 opacity-100 blur-0'
          : `translate-y-6 opacity-0 ${slow ? 'blur-[4px]' : 'blur-[3px]'}`
      } ${className}`}
    >
      {children}
    </div>
  )
}

/** Uma frase-chave, grande e em âmbar, que quebra o ritmo da carta. */
export function Beat({ children, big = false }: { children: ReactNode; big?: boolean }) {
  return (
    <Reveal>
      <p
        className={`mx-auto max-w-2xl font-display font-light italic leading-tight text-ember ${
          big ? 'text-3xl sm:text-5xl' : 'text-2xl sm:text-4xl'
        }`}
      >
        {children}
      </p>
    </Reveal>
  )
}

/** Um parágrafo normal da carta. */
export function Line({ children }: { children: ReactNode }) {
  return (
    <Reveal>
      <p className="mx-auto max-w-xl text-[0.98rem] leading-relaxed text-star/80 sm:text-lg">
        {children}
      </p>
    </Reveal>
  )
}

/** Uma estrofe: linhas curtas empilhadas, revelando juntas. */
export function Verses({ lines }: { lines: string[] }) {
  return (
    <Reveal>
      <div className="mx-auto max-w-2xl space-y-2 text-[0.98rem] leading-relaxed text-star/80 sm:text-lg">
        {lines.map((line, i) => (
          <p key={i}>{sacred(line)}</p>
        ))}
      </div>
    </Reveal>
  )
}

/** A epígrafe da carta: o verso emprestado, antes de eu falar. (já vem revelada
 * junto do cabeçalho da carta) */
function Epigraph({ text, author }: { text: string; author: string }) {
  return (
    <figure className="mx-auto max-w-2xl">
      <blockquote
        className="whitespace-pre-line font-display text-2xl font-light italic leading-[1.25] text-ember/85 sm:text-4xl"
        style={{ textShadow: '0 0 40px rgba(230, 192, 122, 0.15)' }}
      >
        {text}
      </blockquote>
      <figcaption className="label mt-6 text-mist">{author}</figcaption>
    </figure>
  )
}

const signFmt = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

/**
 * A carta de um mês: a dedicatória que abre o capítulo. Mesma forma todo mês —
 * o vocativo, a carta, as frases em âmbar e a assinatura datada no fim.
 */
export function MonthLetter({
  dedication,
  label,
  date,
}: {
  dedication: Dedication
  /** legenda de cima: 'a carta do primeiro mês' */
  label: string
  /** data da assinatura: o dia em que o mês fechou */
  date: Date
}) {
  return (
    <section
      id="dedicatoria"
      className="relative mx-auto flex max-w-3xl flex-col items-center gap-16 px-6 py-32 text-center sm:gap-24 sm:py-40"
    >
      {/* o verso emprestado abre a peça; depois dele é a minha voz */}
      <Reveal>
        <p className="label text-mist">{label}</p>
        {dedication.epigraph && (
          <div className="mt-10">
            <Epigraph text={dedication.epigraph.text} author={dedication.epigraph.author} />
          </div>
        )}
        <p className="mt-14 font-display text-4xl font-light italic text-star sm:text-5xl">
          {dedication.opening}
        </p>
      </Reveal>

      {dedication.blocks.map((block, i) =>
        typeof block === 'string' ? (
          <Line key={i}>{sacred(block)}</Line>
        ) : 'verses' in block ? (
          <Verses key={i} lines={block.verses} />
        ) : (
          <Beat key={i} big={block.big}>
            {block.beat}
          </Beat>
        ),
      )}

      {dedication.signature && (
        <Reveal>
          <p className="label text-ember/80">
            {dedication.signature}
            <span className="mx-2 text-mist">·</span>
            {signFmt.format(date)}
          </p>
        </Reveal>
      )}

      <Reveal>
        <a
          href="#ceu"
          className="group flex flex-col items-center gap-3 text-mist transition-colors hover:text-star"
          aria-label="Ir para o céu desse mês"
        >
          <span className="label text-[0.6rem]">as estrelas desse mês</span>
          <span className="h-12 w-px animate-hint-fade bg-gradient-to-b from-ember to-transparent" />
        </a>
      </Reveal>
    </section>
  )
}
