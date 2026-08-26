import { Reveal } from './Letter'

/**
 * Fecho de um capítulo do namoro: não é um fim, é um "continua". Quando existe
 * um mês seguinte, ele fica ali de porta aberta.
 * (rascunho curto — pra reescrever com as palavras do João)
 */
export function EpilogueNamoro({
  next,
  onNext,
}: {
  /** o capítulo seguinte, se já existir */
  next?: { n: number; name: string; roman: string }
  onNext?: (n: number) => void
}) {
  return (
    <section
      id="fim"
      className="relative flex min-h-[70svh] flex-col items-center justify-center gap-12 px-6 py-32 text-center sm:gap-16"
    >
      <Reveal slow threshold={0.4}>
        <span className="block animate-breathe text-2xl text-ember/70" aria-hidden>
          ✦
        </span>
      </Reveal>

      <Reveal slow threshold={0.4}>
        <p
          className="mx-auto max-w-3xl font-display text-[2rem] font-light italic leading-[1.1] text-ember sm:text-[4rem]"
          style={{ textShadow: '0 0 60px rgba(230, 192, 122, 0.2)' }}
        >
          continua.
        </p>
      </Reveal>

      {next && onNext && (
        <Reveal slow threshold={0.4}>
          <button
            onClick={() => onNext(next.n)}
            className="group flex flex-col items-center gap-3 text-mist transition-colors hover:text-star"
          >
            <span className="label text-[0.6rem]">capítulo {next.roman}</span>
            <span className="flex items-center gap-2.5 rounded-full border border-ember/40 bg-night-soft/40 px-6 py-2.5 font-display text-lg italic text-ember backdrop-blur-sm transition-all duration-300 group-hover:border-ember/70 group-hover:bg-ember/10 group-hover:text-star">
              {next.name}
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                className="transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              >
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </Reveal>
      )}
    </section>
  )
}

/** Epílogo: a última batida, depois das fotos. O fim (só do site). */
export function Epilogue() {
  return (
    <section
      id="fim"
      className="relative flex min-h-[100svh] flex-col items-center justify-center gap-12 px-6 py-32 text-center sm:gap-16"
    >
      <Reveal slow threshold={0.4}>
        <span className="block animate-breathe text-2xl text-ember/70" aria-hidden>
          ✦
        </span>
      </Reveal>

      <Reveal slow threshold={0.4}>
        <p className="mx-auto max-w-2xl font-display text-2xl font-light italic leading-tight text-ember sm:text-4xl">
          eu nunca acreditei em lugar seguro, até tu virar o meu.
        </p>
      </Reveal>

      <Reveal slow threshold={0.4}>
        <p
          className="mx-auto max-w-4xl font-display font-light italic leading-[1.05] text-ember text-[2.5rem] sm:text-[5.5rem]"
          style={{ textShadow: '0 0 60px rgba(230, 192, 122, 0.2)' }}
        >
          Eu te amo pra um caralho!
        </p>
      </Reveal>

      <Reveal slow threshold={0.4}>
        <p className="mx-auto max-w-md text-base leading-relaxed text-star/80 sm:text-lg">
          obrigado por ser tudo o que eu pedi pra espiritualidade. e por ter chegado.
        </p>
      </Reveal>
    </section>
  )
}
