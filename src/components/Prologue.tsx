import { useEffect, useRef, useState, type ReactNode } from 'react'

const reducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** Revela o filho quando ele entra na viewport: fade + leve subida saindo do desfoque. */
function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
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
      { threshold: 0.35, rootMargin: '0px 0px -12% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1100ms] ease-out ${
        shown ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-6 opacity-0 blur-[3px]'
      } ${className}`}
    >
      {children}
    </div>
  )
}

/** Uma frase-chave, grande e em âmbar, que quebra o ritmo da carta. */
function Beat({ children, big = false }: { children: ReactNode; big?: boolean }) {
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
function Line({ children }: { children: ReactNode }) {
  return (
    <Reveal>
      <p className="mx-auto max-w-xl text-[0.98rem] leading-relaxed text-star/80 sm:text-lg">
        {children}
      </p>
    </Reveal>
  )
}

/** Prólogo: uma carta do João pra Gabriela, revelada aos poucos, antes da constelação. */
export function Prologue() {
  return (
    <section
      id="antes"
      className="relative mx-auto flex max-w-3xl flex-col items-center gap-16 px-6 py-40 text-center sm:gap-24"
    >
      <Reveal>
        <p className="label text-mist">antes da nossa constelação</p>
        <p className="mt-8 font-display text-4xl font-light italic text-star sm:text-5xl">
          Gabriela,
        </p>
      </Reveal>

      <Line>
        eu carrego um medo faz tempo, o de me entregar, de amar de verdade. isso me apavora pra
        caramba, e mesmo tremendo eu tô conseguindo fazer isso com você.
      </Line>

      <Line>
        a real é que eu só tô aprendendo a amar agora. aprendendo a me entregar, a receber amor, a
        estar presente, porque a minha tendência sempre foi fugir. eu não confio em lugar seguro,
        nunca confiei na vida.
      </Line>

      <Beat>mas no teu colo eu tô aprendendo a confiar.</Beat>

      <Line>
        no terreiro um caboclo falou de você sem eu nem ter dito o teu nome. disse que eu precisava
        perder o medo de me entregar, que é o meu maior medo, e apontou direto pra você. e cara, eu
        já falei de você pros meus guias um monte de vez, pro erê, pro exu, pro caboclo, pra oxóssi,
        pra iemanjá, pra oxalá, pra pombagira.
      </Line>

      <Beat>eu sinto que o que a gente tem é sagrado.</Beat>

      <Line>
        é pelo jeito que eu me sinto do teu lado. e sinto que você é tudo o que eu sempre pedi pra
        espiritualidade, enchendo o saco da pombagira kkkkk.
      </Line>

      <Line>
        eu nunca me apeguei tão rápido a alguém, a ponto de já sentir saudade de você tando do teu
        lado.
      </Line>

      <Line>
        eu nunca tinha sido ouvido de verdade por alguém vivo. só as entidades me escutavam assim,
        até você chegar. você me ouve, e mesmo quando não fala nada você fica. isso eu nunca tive.
      </Line>

      <Line>
        nunca me senti tão confortável com ninguém na vida. nunca teve ninguém que melhorasse o meu
        dia só de eu ouvir a voz, a risada. nunca fui tão viciado no cheiro de alguém, no calor de
        alguém. e nenhum abraço, nenhum colo, encaixou tão bem quanto o teu.
      </Line>

      <Line>
        e eu sou apaixonado no teu cabelo também, fico viajando, hipnotizado feito bobo. e os teus
        olhos, meu deus... parece que me puxam, me prendem, tipo você fosse uma sereia e eu o
        pescador.
      </Line>

      <Beat>são a coisa mais linda que eu já vi na vida.</Beat>

      <Line>
        e tem uma coisa que talvez você ainda não tenha noção do tamanho: desde ontem, você é a
        única pessoa fora a minha mãe de santo que eu deixo pôr a mão na minha cabeça. ali é o meu
        lugar mais sagrado, o mais sensível de mim. não é um cafuné qualquer não, é onde mora o que
        eu tenho de mais meu.
      </Line>

      <Beat>te deixar tocar ali é a maior entrega que eu sei fazer.</Beat>

      <Line>
        eu amo cada centímetro do teu corpo e cada milímetro da tua alma, com cada átomo do meu.
        quero passar cada dia, cada minuto do teu lado, quero que você faça parte de tudo que for
        importante pra mim. porque é você, simples assim.
      </Line>

      <Beat big>eu amo tudo em você. e escolho, com medo e tudo, me entregar, porque foi você que eu pedi.</Beat>

      <Reveal>
        <p className="font-display text-xl font-light italic text-star/70">seu, João</p>
      </Reveal>

      <Reveal>
        <a
          href="#ceu"
          className="group flex flex-col items-center gap-3 text-mist transition-colors hover:text-star"
          aria-label="Ir para a nossa constelação"
        >
          <span className="label text-[0.6rem]">a nossa história</span>
          <span className="h-12 w-px animate-hint-fade bg-gradient-to-b from-ember to-transparent" />
        </a>
      </Reveal>
    </section>
  )
}
