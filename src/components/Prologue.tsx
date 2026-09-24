// as peças da carta (revelar ao rolar, parágrafo, frase em âmbar) moram no
// Letter.tsx, que é também o que desenha a dedicatória de cada mês
import { Beat, Line, Reveal } from './Letter'

/**
 * Prólogo do mundo do namoro: a ponte entre o céu antigo e o novo.
 * (rascunho curto — é aqui que o João reescreve com as palavras dele)
 */
export function PrologueNamoro() {
  return (
    <section
      id="antes"
      className="relative mx-auto flex max-w-3xl flex-col items-center gap-16 px-6 py-40 text-center sm:gap-24"
    >
      <Reveal>
        <p className="label text-mist">capítulo dois</p>
        <p className="mt-8 font-display text-4xl font-light italic text-star sm:text-5xl">
          e depois do sim,
        </p>
      </Reveal>

      <Line>
        aquele primeiro céu terminava no dia em que tu disse sim. e eu passei uns dias achando que tava bom, 
        quando na verdade a nossa história tinha acabado de começar.
      </Line>

      <Beat>esse céu aqui não tem última estrela.</Beat>

      <Line>
        cada coisa nossa daqui pra frente vira uma estrela aqui em cima: os dias bobos, as viagens,
        as brigas que a gente atravessar, as manhãs. eu vou acendendo, e tu vem ver nossa constelação se formar.
      </Line>

      <Reveal>
        <a
          href="#ceu"
          className="group flex flex-col items-center gap-3 text-mist transition-colors hover:text-star"
          aria-label="Ir para o céu do namoro"
        >
          <span className="label text-[0.6rem]">o nosso namoro, nas estrelas</span>
          <span className="h-12 w-px animate-hint-fade bg-gradient-to-b from-ember to-transparent" />
        </a>
      </Reveal>
    </section>
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
        eu carrego um medo faz tempo: o de me entregar, de amar de verdade. isso me apavora pra
        cacete, e mesmo tremendo eu tô aprendendo a fazer isso contigo, por nós.
      </Line>

      <Line>
        a real é que eu só tô aprendendo a amar agora. aprendendo a me entregar, a receber amor, a
        estar presente, porque a minha tendência sempre foi fugir. eu não confio em lugar seguro,
        nunca confiei na vida.
      </Line>

      <Beat>mas no teu colo eu consigo confiar.</Beat>

      <Line>
        no terreiro, seo samambaia falou de ti sem eu nem ter dito o teu nome. disse que eu precisava
        perder o medo de me entregar, e meu apontou direto pra ti.
      </Line>

      <Beat>eu sinto que o que a gente tem é sagrado.</Beat>

      <Line>
        é pelo jeito que eu me sinto do teu lado. e sinto que tu é tudo o que eu sempre pedi pra
        espiritualidade (coitada da pomba gira KKKKKKKKKK)
      </Line>

      <Line>
        eu nunca me apeguei tão rápido a alguém, a ponto de já sentir saudade de ti tando do teu
        lado.
      </Line>

      <Line>
        eu nunca tinha sido ouvido de verdade por alguém vivo. só as entidades me escutavam assim,
        até tu chegar. tu me ouve, e mesmo quando não fala nada tu fica. isso eu nunca tive. e eu sou abusrdamente grato por isso.
      </Line>

      <Line>
        nunca me senti tão confortável com ninguém na vida. nunca teve ninguém que melhorasse o meu
        dia só de eu ouvir a voz, lembrar da risada... nunca fui tão viciado no cheiro de alguém, no calor de
        alguém. e nenhum abraço, nenhum colo, encaixou tão bem quanto o teu.
      </Line>

      <Line>
        eu sou apaixonado no teu cabelo, fico viajando, hipnotizado feito bobo. e os teus
        olhos, meu deus... parece que me puxam, me prendem, como se tu fosse uma sereia e eu o
        pescador.
      </Line>

      <Beat>são a coisa mais linda que eu já vi na vida.</Beat>

      <Line>
        e tem uma coisa que talvez tu ainda não tenha noção do tamanho: tu é a
        única pessoa fora a minha mãe de santo que eu deixo pôr a mão na minha cabeça. ali é o meu
        lugar mais sagrado, o mais sensível de mim. não é um cafuné qualquer não, é onde mora o que
        eu tenho de mais importante na minha vida.
      </Line>

      <Beat>te deixar tocar ali é a maior entrega que eu sei fazer.</Beat>

      <Line>
        eu amo cada centímetro do teu corpo e cada milímetro da tua alma, com partícula do universo.
        quero passar cada dia, cada segundo do teu lado, quero que tu faça parte de tudo que for
        importante pra mim.
      </Line>

      <Beat big>eu amo tudo em ti. e escolho, com medo e tudo, me entregar, porque tu foi tudo o que eu pedi.</Beat>

      <Reveal>
        <a
          href="#ceu"
          className="group flex flex-col items-center gap-3 text-mist transition-colors hover:text-star"
          aria-label="Ir para a nossa constelação"
        >
          <span className="label text-[0.6rem]">a nossa história, nas estrelas</span>
          <span className="h-12 w-px animate-hint-fade bg-gradient-to-b from-ember to-transparent" />
        </a>
      </Reveal>
    </section>
  )
}
