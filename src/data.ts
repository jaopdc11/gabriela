export type Milestone = {
  /** Data do momento (horário local). */
  date: Date
  title: string
  description: string
  /**
   * Posição da estrela na constelação: x em 0–100, y em 0–44 (widescreen).
   * Opcional — sem x/y, a posição é calculada pela curva do mundo (ver `arc`).
   */
  x?: number
  y?: number
}

/** Estrela com posição já resolvida (o que a constelação desenha). */
export type PlacedStar = Milestone & { x: number; y: number }

/** A estrela final de um mundo: mais forte que as outras, com fecho próprio. */
export type Finale = PlacedStar & {
  label: string
  /** Frase de fecho, em âmbar, embaixo do texto. */
  outro?: string
  /** Desenha o compadre (Seo Tranca Rua) acendendo junto. */
  figure?: 'exu'
}

/** Curva que espalha as estrelas sem x/y pelo céu. */
export type Arc = {
  x0: number
  x1: number
  /** linha de base do y (menor = mais alto no céu) */
  base: number
  /** amplitude da ondulação */
  amp: number
  /** ciclos da ondulação ao longo do arco */
  freq: number
  phase: number
}

/**
 * O fecho de um mês de namoro: a estrela do aniversário de mês, que encerra o
 * capítulo. `draft` esconde a estrela no site publicado (só aparece rodando
 * local, em `npm run dev`) — serve pra deixar o espaço pronto e escrever depois.
 */
export type MonthMark = {
  title: string
  description: string
  /** Frase de fecho, em âmbar, embaixo do texto. */
  outro?: string
  /** Rascunho: aparece só em desenvolvimento, nunca no site publicado. */
  draft?: boolean
}

/**
 * Um bloco da carta do mês:
 *  - texto solto → um parágrafo normal;
 *  - `{ beat }`  → a frase-chave em âmbar, que quebra o ritmo (`big` = fecho);
 *  - `{ verses }`→ uma estrofe: linhas curtas, uma embaixo da outra, do jeito
 *                  que sai quando eu escrevo em lista ("cada olhar, cada
 *                  risada...") e a quebra faz parte do que tá sendo dito.
 */
export type LetterBlock =
  | string
  | { beat: string; big?: boolean }
  | { verses: string[] }

/**
 * A dedicatória de um mês: uma carta minha pra ela, fechando o mês inteiro (o
 * fecho de mês em `monthMarks` é sobre o DIA do aniversário de mês; essa carta é
 * sobre os trinta dias). Vem depois da cartela do capítulo, antes do céu.
 */
export type Dedication = {
  /**
   * O verso emprestado que abre a carta, antes da minha voz. Quebra de linha com
   * \n é respeitada (é verso, a quebra faz parte).
   */
  epigraph?: { text: string; author: string }
  /** vocativo grande no alto: 'Gabi,' */
  opening: string
  /** os parágrafos e as frases-chave, na ordem em que ela lê */
  blocks: LetterBlock[]
  /** assinatura embaixo; a data sai do próprio mês */
  signature?: string
  /** Rascunho: aparece só em desenvolvimento, nunca no site publicado. */
  draft?: boolean
}

/** Um mundo: um céu, um álbum e uma narrativa próprios. */
export type World = {
  id: 'comeco' | 'namoro'
  /** O mundo é dividido em capítulos de um mês (ver `chapters.ts`). */
  chaptered?: boolean
  /** rótulo curto no seletor de mundos (header) */
  nav: string
  /** linha de cima da capa */
  heroKicker: string
  /** data grande embaixo do título, na capa */
  heroDate: string
  /** qual contador a capa mostra primeiro */
  heroCounter: 'conhecemos' | 'namoro'
  /** legenda no topo do céu */
  skyLabel: string
  /** pasta dentro de src/fotos ('' = raiz) */
  albumDir: string
  albumLabel: string
  albumTitle: string
  /** trilha de fundo do mundo (arquivos dentro de /public), tocada em ordem */
  tracks: string[]
  /** semente do céu de apoio — cada mundo tem o seu próprio céu de fundo */
  seed: number
  arc: Arc
  /** Céu de uma peça: as estrelas com posição já resolvida. */
  stars?: PlacedStar[]
  /**
   * Céu por capítulo: as estrelas cruas, sem posição. Cada capítulo separa as
   * suas por data e espalha só elas pela curva (ver `chapters.ts`).
   */
  milestones?: Milestone[]
  finale?: Finale
}

/** A data em que tudo começou — usada no contador principal. */
export const START_DATE = new Date(2026, 5, 7, 3, 30) // 07/06/2026 03:30
/** O dia do sim — usada no contador de namoro. */
export const NAMORO_DATE = new Date(2026, 6, 23, 21, 30) // 23/07/2026 21:30

/**
 * Resolve a posição das estrelas: quem tem x/y manda, quem não tem ganha um
 * lugar na curva do mundo. Assim dá pra ir só adicionando momentos, sem contar
 * coordenada na mão — o céu se reorganiza sozinho.
 */
export function place(stars: Milestone[], arc: Arc): PlacedStar[] {
  const n = stars.length
  return stars.map((s, i) => {
    // uma estrela só fica no meio do céu; várias se espalham de x0 a x1
    const t = n > 1 ? i / (n - 1) : 0.5
    const x = arc.x0 + (arc.x1 - arc.x0) * t
    const y = arc.base + arc.amp * Math.sin(Math.PI * 2 * arc.freq * t + arc.phase)
    return { ...s, x: s.x ?? x, y: s.y ?? y }
  })
}

/** Mundo 1 — a nossa constelação: cada estrela é um momento, em ordem cronológica. */
export const milestones: Milestone[] = [
  {
    date: new Date(2026, 5, 6),
    title: 'A gente se conheceu',
    description: `Eu quase não fui nessa festa. Tava sem a mínima vontade, morrendo de preguiça, e hoje eu tremo se pensar nisso, porque foi uma voz insistindo no meu ouvido que me fez ir e ficar. E eu, que confio na minha espiritualidade, fui. Ela já sabia de tudo
Quando eu te vi, meu medo foi de ti ser areia demais pro meu caminhão. Mas mesmo assim fiquei pensando em como chegar em ti, porque honestamente eu não sei fazer isso KKKKKKKKKK. Quando eu finalmente tive culhão de chegar, tu virou e perguntou se eu ficaria contigo. Eu travei por dentro de um jeito que eu nunca tinha travado na vida. E porra, aquele beijo me desmontou inteiro
O que tu não fazia a menor ideia é o tamanho do meu desespero no dia seguinte. Fiquei me xingando o dia todo, torrando a paciência do Matheus, achando que eu tinha deixado escapar a melhor coisa que já tinha chegado perto de mim. E puta merda, qaundo a tua solicitação chegou, minha mão tremeu de verdade. Eu ainda não sabia, mas era ali que a minha vida começava de verdade`,
    x: 5,
    y: 26,
  },
  {
    date: new Date(2026, 5, 13),
    title: 'A primeira vez, só nós dois',
    description: `Eu inventei um compromisso e fui pra Univali só pra ter alguma chance de te ver de novo. Nem te achei, mas achei coragem pra te chamar pra sair, e isso já era muito pra mim
Aí vieram doze minutos de vácuo (ainda não superei) que pareceram a minha vida inteira. Doze. Eu já me achando um idiota afobado que tinha estragado tudo antes de começar. Quando tu aceitou, eu gritei, não teve como segurar, e meu amigo riu da minha cara como se eu fosse o maior otário do planeta KKKKKKKKKKK
Mas o que eu preciso mesmo que tu saiba é o instante exato em que eu me encantei por ti. Não foi numa risada nem num beijo. Foi quando tu me pediu pra explicar da minha umbanda e ficou ali, me ouvindo, com aquele sorrisinho, os teus olhinhos em mim. Uma semana depois de te conhecer já foi o suficiente pra eu me apaixonar nos teus olhos. Eu ainda tentei te deixar ganhar na sinuca, disfarçado, só pra te ver feliz. E depois tu acabou comigo pra eu aprender KKKKKKKKKKKKKK`,
    x: 13,
    y: 23,
  },
  {
    date: new Date(2026, 5, 15),
    title: 'O dia da praia',
    description: `Tu soltou que gostava de praia e de bike no quinta aula, e eu peguei a deixa na hora, porque naquele ponto qualquer desculpa pra estar perto de ti já bastava. Fui com a minha bike toda quebrada, morrendo pra pedalar, e não reclamei de nada, porque do teu lado valia a pena perder o joelho KKKKKKKKKKKKK
O que ficou gravado em mim daquele dia não foi o beijo. Foi tu dormindo nos meus braços, na areia, olhando o mar antes de apagar. Eu fiquei em choque com a confiança de ti se entregar assim, tão tranquila, do meu lado. Nunca ninguém tinha me confiado esse sossego
E foi nesse dia que eu decidi uma coisa que eu carrego até hoje: que o teu "não" é sagrado, e que tu nunca, nunca vai precisar ter medo de me dizer. Foi ali, contigo dormindo em mim, que eu me apaixonei de vez`,
    x: 21,
    y: 19,
  },
  {
    date: new Date(2026, 5, 20),
    title: 'A primeira noite na sua casa',
    description: `Eu morria de vontade de conhecer a tua casa, e juro que era sem segunda intenção nenhuma. Eu só queria ver o teu cantinho, o teu mundinho, o lugar onde tu existe quando eu não tô olhando. Quando chegou o teu áudio me convidando, eu quase chorei
Cheguei tão nervoso que derrubei a Ice na tua toalha e quase fui embora de pura vergonha. Besta, mas eu tava com medo de te incomodar, de não caber ali. Até agora me dá uma gastura quando lembro da garrafa caindo KKKKKKKKKKK
E aí a gente deitou. Eu nunca tinha tido uma noite tão tranquila na vida inteira. Dormir no teu calor e no teu cheiro apagou um barulho que morava em mim fazia tempo, um barulho que eu nem sabia mais que existia. Foi essa noite que eu fiquei viciado em ti, e eu nunca mais quis desviciar`,
    x: 29,
    y: 15,
  },
  {
    date: new Date(2026, 5, 25),
    title: 'A primeira tempestade',
    description: `A situação da foto me machucou de um jeito que eu não esperava sentir tão cedo. Eu tava no escritório e chorei escondido no banheiro, e por um instante, eu vou ser sincero, passou pela minha cabeça não falar mais contigo. Idiota, cogitei. Maldito padrão de fugir
Eu nem queria te ver naquele dia. Cheguei em casa, firmei uma vela pra meu pai Oxóssi e perguntei se eu devia ir. Ele foi direto: "vai. agora.". Então eu fui, mais pela fé do que pela vontade, confesso
E foi ali que eu chorei na tua frente pela primeira vez, e vi teu olho brilhar segurando o choro também. O tempo todo, mesmo doendo, a única coisa que eu queria era correr pra te abraçar e nunca mais soltar. Foi nessa tempestade que eu aprendi uma coisa sobre mim: que te amar já era maior que a dor. E que eu ia atravessar qualquer temporal, desde que fosse contigo, e por nós`,
    x: 37,
    y: 11,
  },
  {
    date: new Date(2026, 5, 26),
    title: 'O primeiro "eu te amo"',
    description: `A gente já vinha dias rondando as três palavrinhas, aquela vontade entalada na garganta toda vez que se via, sempre segurando por medo de ser cedo
De madrugada tu me acordou. E como é só do teu lado que eu durmo fundo de verdade, eu respondi todo lerd, no maior sono, e a gente ainda ri disso
Aí tu falou: "eu amo você, e tenho medo de te perder". Meu olho encheu na hora. Eu não sabia que dava pra sentir tanta coisa de uma vez só. E o que eu nunca soube te explicar direito é que aquele teu medo era o meu também. Eu também morro de medo de te perder. É por isso que eu cuido da gente com tanto cuidado, como quem segura uma coisa rara nas mãos. Tu é meu tesouro`,
    x: 45,
    y: 9,
  },
  {
    date: new Date(2026, 5, 27),
    title: 'Conhecemos as mães',
    description: `Eu tava nervoso pra caralho pra encarar a tua mãe. Tanto que, de sacanagem, te joguei de surpresa pra conhecer a minha primeiro, sem te avisar, só pra adiar o meu próprio pavor e equilibrar um pouco o jogo KKKKKKKKKKK. Tu ficou toda tímida, e eu me diverti demais com isso, vou ter que admitir a minha vingancinha rs
Mas o que acabou comigo mesmo aquele dia não foi o cagaço, foi o teu moletom que eu trouxe pra casa. Eu não larguei aquilo até o teu cheiro sumir de vez, e sofri quando sumiu. Dormi mal pra cacete KKKKKKKKKKK
Naquele dia eu senti, sem saber colocar em palavras, que a coisa tava ficando séria do jeito bom, do jeito que eu queria pra vida. A gente começou a se misturar, a virar parte da história um do outro. E eu quis isso com todas as forças.`,
    x: 53,
    y: 9,
  },
  {
    date: new Date(2026, 6, 11),
    title: 'A TYC',
    description: `A festa em si foi ótima, mas não é dela que eu lembro. O que mexeu comigo de verdade foi a gente se assumir pela primeira vez escancarado, com rosto e tudo nas fotos, na van, escolhendo as músicas juntos. Eu, sem esconder de ninguém que era teu. E tu, sem esconder de ninguém que era minha
A gente dançou agarrado e se beijou na frente de todo mundo, das tuas amigas, de geral. E eu senti um orgulho que eu não sabia nomear, de estar ali sendo teu na cara do mundo
Foi também a primeira vez que tu me viu fumando, e isso me deu um aperto, um medinho de te decepcionar que eu carreguei calado. Mas tu me entendeu. Tu acabou passando mal e a gente voltou mais cedo, e mesmo assim o que ficou de tudo foi tu dormindo do meu lado. É sempre assim: não importa pra onde a noite vá, o que eu quero é que ela temine contigo`,
    x: 61,
    y: 11,
  },
  {
    date: new Date(2026, 6, 13),
    title: 'A bênção nas alianças',
    description: `Esse foi um dos maiores passos que eu já dei por nós, e talvez tu nunca tenha medido o tamanho dele. Peguei as alianças de namoro que eu já tinha comprado e levei no terreiro, pro Seo Tranca Rua das Almas, da minha mãe de santo, cruzar e abençoar. Pra blindar a gente de olho gordo, de fofoca, de tudo que pudesse tentar separar. Lembrei do teu medo, na naquela quinta feira
E assim ele fez. Deu a bênção das encruzilhadas nas nossas alianças
Ali dentro eu senti uma coisa que lá no fundo eu já sabia, mas que naquele instante virou certeza absoluta: que a gente TEM que estar junto. Porque se não tivesse caminho pra nós, ele jamais, jamais teria feito aquilo. Eu saí de lá o homem mais seguro do mundo, e te contei tudo assim que botei o pé pra fora do terreiro, porque segredo contigo eu não sei ter (e também é de bom tom avisar que fiz macumba pra gente KKKKKKKKK)`,
    x: 69,
    y: 14,
  },
  {
    date: new Date(2026, 6, 19),
    title: 'A noite que o show não rolou (e foi perfeita)',
    description: `Era pra ser o nosso primeiro show, o Alexandre Pires. Mas a gente ficou agarrado o dia inteiro, se atrasou, o Uber tava caríssimo, e a gente só se olhou e desistiu sem pena nenhuma. E graças a deus, porque essa acabou virando uma das noites mais importantes da minha vida
Na praia, no escuro, eu te contei tudo. A depressão, os traumas, as tentativas, coisas que eu não conto pra quase ninguém no mundo. E tu me ouviu sem me julgar uma única vez. Eu vi teu olho marejar, e foi isso que me quebrou: eu chorei por te ver sofrendo por mim, não pela minha história. Precisei que tu entendesse que eu sou grato pela minha vida, que tu não precisa carregar medo por mim
O que eu não te falei na hora, pra não te assustar, é que eu senti os espíritos das águas ali na praia, presenciando a gente. Quando tu bateu cabeça pra Iemanjá me deu uma paz que eu não sei explicar, e eu soube que a mãe d'água tinha abençoado o nosso amor. Depois, na tua casa, firmei uma vela de erê e vi a energia irradiar em mim E EM VOCÊ, vi no teu olhar. Foi lindo. Voltamos pedalando, meu joelho quase morrendo, e eu te olhando balançar as perninhas achando aquilo a coisa mais linda que existe. Eu amo cada detalhe teu, até os que tu acha bobos`,
    x: 77,
    y: 16,
  },
  {
    date: new Date(2026, 6, 20),
    title: 'O meu amaci',
    description: `Essa é uma das coisas mais minhas que existem no mundo, e eu escolhi dividir contigo. Te levar pro meu amaci foi te abrir a minha fé inteira, o meu momento mais sagrado, o lugar mais meu que existe.
Tu me disse depois que achou que não tinha recebido passe de mim. Mas eu sei o que eu senti: quando a minha Oxum baixou, ela mandou um axé pra ti, e isso pra mim vale mais do que qualquer coisa que a gente pudesse ver com os olhos. Ora Ye Ye ô!
Porque o que me marcou de verdade não foi o que aconteceu naquele dia. Foi ser TU ali, pisando no meu chão sagrado, entrando no lugar mais íntimo que eu tenho. Tem gente que namora anos e nunca chega nem perto disso. Eu te levei em poucas semanas, porque contigo eu simplesmente não tive medo de me abrir por inteiro`,
    x: 85,
    y: 18,
  },
]

/** A estrela do pedido: o ponto que finalmente acendeu, em 23/07/2026. */
const PROPOSAL: Finale = {
  x: 92,
  y: 13,
  date: new Date(2026, 6, 23), // 23/07/2026 — o dia do sim
  label: 'a estrela que finalmente acendeu',
  title: 'O pedido de namoro',
  description: `Eu não aguentava mais de tanto que eu queria isso. Te levei pra praia, e minha mão tremia igual no dia que eu te chamei pra sair pela primeira vez. Te dei o buquê e me declarei, falei tudo de novo: de ti, de nós, do tamanho da minha certeza. E aí eu vi uma coisa que eu vou guardar pra vida toda: o teu olho enchendo. Tu, que é tão difícil de chorar, quase chorando por mim. Eu quase fui junto.
E quando tu disse sim, o céu inteiro respondeu. Eu saudei Seo Tranca Rua das Almas do fundo do peito e tu viu o que aconteceu. Eu soube na hora que era ele. Que a bênção que ele deu nas nossas alianças tinha descido em carne e osso, só pra jurar que tá tudo certo, que o caminho é nosso e ninguém tira. Eu tava tremendo por dentro, e não era nervoso, era axé.
Voltamos cantando ponto o trajeto todo, e eu ria sozinho de tão feliz. Porque essa estrela que eu deixei esperando aqui no céu, finalmente se acendeu. E ela brilha mais forte que todas.`,
  outro: `tu disse sim.
Laroyê, Exu. Salve Seo Tranca Rua das Almas, obrigado por guardar a gente.`,
  figure: 'exu',
}

/**
 * Mundo 2 — o namoro. Céu novo, que começa no sim e não tem fim previsto.
 *
 * Pra acrescentar uma estrela: só colar um bloco novo no fim da lista, em ordem
 * de data. Nada de x/y — a data já diz em que capítulo (mês) ela entra, e a
 * curva do capítulo reposiciona tudo sozinha:
 *
 *   {
 *     date: new Date(2026, 7, 15),   // mês começa no 0: 7 = agosto
 *     title: 'O nome do momento',
 *     description: `primeiro parágrafo
 *   segundo parágrafo
 *   terceiro parágrafo`,
 *   },
 */
export const namoroMilestones: Milestone[] = [
  {
    date: new Date(2026, 6, 31),
    title: 'A semana longe, e a sexta que eu fui atrás de ti',
    description: `Tu disse sim numa quinta e viajou pra tua mãe na sexta. Eu ri na hora, achei que uma semana era nada. Não era. Foi um inferno, e eu não tô sendo dramático: eu sentia um vazio no peito, um lugar oco, físico, como se tivesse me tirado alguma coisa de dentro. E por coincidência ou não (eu acho que não), essa foi a semana mais difícil pra caralho que eu tive em muito tempo. Tudo desabando junto, e eu com uma única vontade no meio de tudo: te ver. Só isso. Eu não tava aguentando mais
Aí no dia 31 eu fui. E cara, eu tava MORTO de nervoso. Em pânico, de verdade. Casa que não é minha, gente que eu não conheço, a tua mãe, tudo de uma vez, e o meu TEA gritando que era cedo demais pra mim (eu ainda acho que foi). Fui igual, porque a vontade de estar perto de ti era maior que o meu pavor, e eu tô aprendendo a escolher tu em cima do meu medo. Cheguei com um presente improvisado às pressas pra tua mãe, achando que ia pagar o maior pau, e pelo jeito ela gostou KKKKKKKKKKK. Nunca senti tanto alívio por uma coisa boba
E aí foi a nossa primeira vez. Nossa de verdade: foi a minha primeira vez da vida também. E eu tinha mentido pra ti sobre isso, tinha dito que não era virgem, por pura insegurança, por medo de parecer menos pra ti. Me arrependi amargamente na mesma hora, e no dia seguinte eu não consegui carregar aquilo em cima de mim, te desmenti e te contei a verdade. Porque eu podia mentir sobre qualquer coisa, menos sobre a primeira coisa que eu vivi na vida sendo contigo
E eu tava nervoso pra caralho, mas foi mágico. Incrível e único, dessas coisas que não vão repetir nunca mais porque só existe uma primeira. (e olha, no meio de todo aquele nervoso, eu me surpreendi comigo mesmo, rendi bem mais do que eu imaginava KKKKKKKKKKKKKKK)
O que fica pra mim é isso: eu, que passo a vida fechado, sem entregar o corpo nem a cabeça pra ninguém, me entreguei inteiro pra ti sem pensar duas vezes. Aquele vazio de uma semana fechou ali. E se algum dia eu duvidar do tamanho disso, é só lembrar da sexta em que eu atravessei o meu próprio pânico pra chegar em ti, e da coragem que me deu de desmentir a minha própria mentira`,
  },
  {
    date: new Date(2026, 7, 1),
    title: 'O parque, o rio e o banho de ervas',
    description: `No dia seguinte a gente foi num parque cheio de natureza, e cara, eu não sabia o quanto eu tava precisando daquilo até pisar lá dentro. Verde, mato, ar de verdade. A semana inteira desabando em cima de mim e o remédio era isso: tu, mato e sossego. E foi muito bom ter a tua mãe com a gente, sério, teve um sabor de eu estar sendo aceito ali no meio de vocês
Ah, e eu não perdi pro teu senso de direção no labirinto. Eu deixei, tá? DEIXEI, eu juro rs.
Depois a gente foi pro pesque e pague, e aquele rio é uma das coisas mais bonitas que eu já vi. A gente entrou na água, andou por dentro dela e quase se estabacou umas dez vezes, rindo cada uma. Ficamos ali um tempo, só nós dois no meio do rio, curtindo (KKKKKKKKKK), e tiramos um monte de foto tosca que ficaram as coisas mais lindas do mundo justamente por serem toscas, e nossas
E ali, no meio do rio, eu fiz um banho de ervas contigo. De fora talvez pareça pouca coisa, mas pra mim não é: eu sou o único da minha casa que carrega isso. Aprendi sozinho, guardei sozinho, nunca tive com quem dividir. E naquele rio eu tive — as tuas mãos na água junto das minhas, tu querendo saber, eu te mostrando como faz. Não foi eu te contando da minha fé de longe, foi a gente dentro dela, junto. Aquela água levou o resto do peso daquela semana embora, e o que sobrou foi axé`,
  },
  {
    date: new Date(2026, 7, 2),
    title: 'O domingo de preguiça, e a volta pra Itajaí',
    description: `O domingo foi a coisa mais preguiçosa e mais perfeita do mundo. A gente ficou de molho no quarto até a hora do almoço, comeu, e voltou pra preguiça igual dois desocupados. Nenhuma obrigação, nenhum lugar pra ir, ninguém pra ser. Tu não tem noção do que um dia assim faz por mim, de não ter que dar conta de nada, de só existir, e do teu lado
A gente passou um tempão escolhendo fantasia pra festa de halloween que vamos. Eu fiquei todo bobo, e vou admitir: eu nunca tinha ido de casal pra um rolê na vida, muito menos combinando roupa com alguém. Eu tava lá me achando o cara, imaginando a gente chegando junto. No fim a gente não escolheu porra nenhuma KKKKKKKKKKKKK, mas eu tava tão feliz naquele nada que nem importou (temos que escolher!)
Depois fomos comprar as passagens de volta pra Itajaí e não tinha dois lugares lado a lado. Eu fiquei mal de verdade, e é meio ridículo se tu for pensar, umas duas separados num ônibus depois de um fim de semana inteiro colado, mas eu não queria perder nem esse pedacinho de ti, mas tu desenrolou lá dentro com a mina, graças a deus KKKKKKKKK, e a gente voltou um do lado do outro do jeito que tinha que ser
O engraçado é que eu fui irradiando cigana no ônibus inteiro, sem eu ter pedido nem esperado, e tu tava sentindo a energia junto comigo. Tu chegou a passar um pouquinho mal, e eu consegui te descarregar no fim do dia. Isso me diz uma coisa que eu não sei explicar direito: tu sente o que passa em mim. E minha espiritualidade se mostra pra ti. To até ficando com ciúme, não to gostando, não
E tem uma coisa que eu não queria admitir, mas eu prometi que contigo eu não escondo nada: eu me senti aliviado de ir embora. Não de ti, nunca de ti. Foram dias intensos pra caralho pra minha cabeça, casa que não é minha, gente nova, tudo ligado no máximo o tempo todo, e voltar pro meu canto era o que eu precisava pra respirar. Eu te amo e ainda assim eu preciso do meu buraco às vezes. `,
  },
  {
    date: new Date(2026, 7, 8),
    title: 'O Tala',
    description: `Antes de tudo eu preciso registrar isso, porque senão eu vou me arrepender depois: tu tava um absurdo de linda naquela noite. Eu tava babando ainda na hora de a gente se arrumar, sem disfarçar nada. Tu não faz ideia do que é te olhar se ajeitando e pensar "e essa mulher tá comigo"
A banda era daqui, eu não conhecia, e não fez a menor diferença. A gente comeu bem, riu à toa, tu foi provando os drinks e ficando levinha, e o meu barato da noite virou só isso: tu rindo feito boba do meu lado. E a gente cantou e dançou pagode agarradinho, do jeito que eu não sabia que eu gostava até ser contigo
E aí eu fiz uma coisa que eu jamais imaginei que sairia de mim: dediquei Pixote, pra ti. Eu, esse cara aqui, dedicando pagodinho de apaixonado. E falei na maior cara dura, sem morrer de vergonha, sem me achar cafona. Pra mim isso é maior do que parece: eu passo a vida com a guarda alta demais pra me expor assim na frente dos outros, e contigo a vergonha simplesmente não veio. Tu vai desmontando essas minhas defesas sem nem perceber que tá desmontando. E é isso que eu queria te dizer com aquela música: eu não te troco por nada nesse mundo. Não tem boca que beija melhor, e não tem abraço tão massa
Mas o que de verdade mexeu comigo daquela noite não foi nada disso. A gente tava tirando fotos, e numa delas eu te peguei distraída, só olhando pra mim. E ali dá pra ver o brilho no teu olho quando tu me olha. Puta merda, vida. Aquele jeitinho, aquele brilho, é a prova que eu não sei arranjar em lugar nenhum de que eu sou amado. Ninguém consegue fingir isso numa foto que nem sabia que tava sendo tirada
Eu guardo essa foto como quem guarda um documento. Nos dias em que a minha cabeça me disser que eu não mereço, que eu sou demais pra alguém aguentar, eu vou olhar pro teu olho naquela foto e calar a boca dela. Foi só um sábado num pagode, e eu levei dele a coisa mais importante do mundo`,
  },
]

/**
 * O fecho de cada mês de namoro, pela chave do mês (1 = o primeiro mês, contado
 * do dia 23/07). Cada mês que se completa vira a estrela mais forte do seu
 * capítulo — o mesmo peso que o pedido tem no céu do começo.
 *
 * Pra escrever o mês novo: só acrescentar a chave, e APAGAR o `draft: true`
 * quando o texto estiver pronto. Enquanto `draft: true` estiver aí, a estrela
 * aparece só no `npm run dev` — no site publicado ela não existe, então dá pra
 * mexer com calma sem ela ver o rascunho.
 */
export const monthMarks: Record<number, MonthMark> = {
  1: {
    title: 'Um mês, e o teu cheirinho de sono',
    description: `Não foi como eu esperava, e eu não vou fingir que foi. Eu queria esse dia inteiro grudado em ti, sem hora, sem nada, e não deu. Fiquei chateado pra caralho com a situação, com aquele gosto ruim de um dia que eu já tinha vivido inteiro na minha cabeça antes de acordar. Eu tinha até guardado uma grana pra caso a gente conseguisse sair — a grana do terreiro, diga-se KKKKKKKKKKK. Quase me fodi bonito (já paguei, tá pago, relaxa)
Mas tem uma coisa que nenhuma situação conseguiu tirar de mim: eu acordei do teu lado sabendo que a gente tava fazendo um mês. Um mês desde o dia em que tu disse sim, e eu abrindo o olho contigo ali, no teu calor. E o teu cheirinho de sono, Gabi... é o cheiro mais gostoso que eu já senti na vida, não tem perfume nesse mundo que chegue perto. Eu fico ali quietinho só sentindo, antes de tu acordar
Eu me declarei, como eu sempre faço, mas dessa vez saiu diferente e eu levei um tempo pra entender por quê. Antes eu tava declarando o que eu sentia e o que eu esperava da gente. Dessa vez eu tava declarando uma coisa que já tem chão embaixo: um mês de prova, um mês de nós dois vivido, contado, aguentado. Não era mais promessa. Era história
E o resto do dia foi a nossa cara: enrolar na cama pra levantar, almoçar só besteira, ver o filminho colado em ti. Eu quase dormi no meio, admito, mas fui guerreiro e aguentei até o fim KKKKKKKKKKKKK. E olha, eu não tenho culpa: é muito gostoso deitar contigo, o meu corpo simplesmente desliga, porque ele entende antes de mim que ali é o meu lugar seguro
E tem uma coisa que eu preciso deixar escrita aqui, não porque eu não te disse — eu te disse, na tua cara, e tu me respondeu que tava tudo bem. Mas pra mim não tá, e eu quero isso registrado: me perdoa por eu não ter preparado nada. Tu preparou. Eu não
Tu merece todas as flores de todos os jardins. Todas as declarações de amor, todos os poemas, todos os sonetos, e até os rascunhos deles. Todos os clássicos da MPB, um por um. E naquele dia eu não fui capaz nem de te fazer uma carta
E não foi por não ter pensado. Eu tinha um plano inteiro na cabeça: te levar pra praia, refazer um pedaço do pedido no mesmo lugar onde a gente se apaixonou, com buquê, com presente, com as besteiras que a gente gosta. Eu queria isso mais do que tu imagina. Mas essas duas últimas semanas a minha cabeça tava fudida, e disso tu sabe melhor que ninguém. Eu não consegui me organizar, e no fim eu não fiz nada. Eu não vou fingir que tá tudo bem nem me esconder atrás do que eu tava sentindo. Só que eu não desisti daquele plano: a praia continua lá, o buquê continua de pé. Vai ser fora da data, e talvez fique até melhor assim, porque aí não vai ser sobre o calendário, vai ser só sobre nós
Independente de tudo, cada segundo do teu lado vale ouro pra mim. E eu sou absurdamente grato por cada segundo desse mês, meu amor`,
    outro: `um mês.
e eu escolheria tu de novo em cada um dos trinta dias.`,
  },
}

/**
 * A carta de cada mês, pela chave do mês. É o padrão da casa: todo mês que
 * fecha ganha uma dedicatória minha pra ela, sempre com a mesma forma —
 * vocativo, a carta, as frases em âmbar, a assinatura datada no fim.
 *
 * O molde pra copiar no mês seguinte (`beat` é a frase grande em âmbar):
 *
 *   2: {
 *     draft: true,                       // apagar quando estiver pronta
 *     opening: 'Gabi,',
 *     blocks: [
 *       'primeiro parágrafo da carta',
 *       { beat: 'a frase que eu quero que ela leia devagar' },
 *       'mais um parágrafo',
 *       { beat: 'o fecho da carta', big: true },
 *     ],
 *     signature: 'teu Jão',
 *   },
 */
export const monthDedications: Record<number, Dedication> = {
  1: {
    // o mesmo verso que é a descrição da minha playlist de MPB desde sempre —
    // era o sonho de um dia dedicar pra alguém
    epigraph: {
      text: `que não seja imortal, posto que é chama
mas que seja infinito enquanto dure.`,
      author: 'Vinicius de Moraes, Soneto de Fidelidade',
    },
    opening: 'Gabi,',
    blocks: [
      {
        verses: [
          'um mês de nós',
          'um mês desde que tomei a decisão que mais me deu medo, e que mais iluminou minha vida',
          'um mês desde que minha vida tem mais cor',
          'um mês desde que meus dias tem mais luz',
          'um mês desde que eu não vivo no piloto automático, porque tem algo que importa',
          'um mês desde que eu segui o conselho de Seo Samambaia e de Seo João Sorriso, e finalmente perdi o medo de me entregar',
        ],
      },
      {
        verses: [
          'eu sou grato por cada segundo ao teu lado, gatinha',
          'cada momento',
          'cada olhar',
          'cada respiração',
          'cada cheirinho no teu cangote',
          'cada conchinha',
          'cada minuto agarradinho',
          'cada besteira',
          'cada risada (e como eu amo ouvir tua risada, meu deus)',
        ],
      },
      {
        verses: [
          'tu ilumina meus dias como eu nunca achei que alguém ia fazer',
          'eu nunca achei que poderia viver isso. sempre colocaram na minha cabeça que eu jamais ia merecer 10% do que tu faz por mim',
          'e agora, eu olho pra trás, e vejo onde eu tô',
        ],
      },
      {
        verses: [
          'com a mulher mais linda que eu já vi',
          'que tem os olhos mais lindos do mundo (e que agora eu carrego para todo canto comigo)',
          'que tem o cabelo mais cheiroso do mundo',
          'que tem o sorriso mais belo de todos',
          'que tem a voz mais gostosa de se ouvir',
        ],
      },
      { beat: 'eu amo cada detalhe em ti, meu amor, como nunca achei que seria capaz de amar' },
      'cada centímetro do teu corpo, e cada milímetro da tua alma',
      {
        beat: 'tua beleza exterior só reflete 10% da tua beleza interior, e é a coisa mais linda que eu já vi',
      },
      {
        verses: [
          'eu ainda tô lutando pra acreditar que isso é real, e tentando me habituar, mas segue sendo difícil, gatinha',
          'tu é demais, e eu sou só eu kkkkkkkkkkkkk',
          'mas eu tô tentando, eu juro, tentando conceber isso tudo',
        ],
      },
      {
        verses: ['tu é mais do que especial pra mim. tu é minha vida, agora', 'e porra, como eu amo viver!'],
      },
      { beat: 'tu é meu patuá, minha proteção, minha firmeza' },
      { beat: 'eu te amo. pra caralho.', big: true },
      'e pensa no...',
    ],
    signature: 'teu Jão',
  },
}

/**
 * Trilha própria de um mês, pela chave do mês. Os arquivos moram em `/public` e
 * são tocados em ordem, em loop — o mesmo esquema das trilhas de mundo, só que
 * mais específico: quando o mês tem trilha, ela ganha da trilha do mundo.
 *
 *   1: ['/mes-01.mp3'],            // a música do primeiro mês
 *   2: ['/mes-02.mp3', '/mes-02b.mp3'],
 *
 * Mês sem trilha própria continua na trilha do mundo (`tracks` do namoro).
 */
export const monthTracks: Record<number, string[]> = {
  1: ['/mes-01.mp3'], // nem de graça — a música do primeiro mês
}

/** Os dois mundos: o começo (até o sim) e o namoro (depois dele). */
export const worlds: World[] = [
  {
    id: 'namoro',
    // o céu do namoro é dividido em capítulos de um mês: cada mês tem a sua
    // cartela, o seu céu e o seu fecho (ver `chapters.ts`)
    chaptered: true,
    nav: 'o nosso namoro',
    heroKicker: 'o que veio depois do sim',
    heroDate: '23 · 07 · 2026',
    heroCounter: 'namoro',
    skyLabel: 'o céu que começou no sim',
    albumDir: 'namoro',
    albumLabel: 'o álbum do namoro',
    albumTitle: 'nós, namorando',
    // trilha própria do namoro — é só colocar os arquivos em public/ com esses nomes
    tracks: ['/namoro.mp3', '/namoro2.mp3', '/namoro3.mp3'],
    seed: 20260723,
    arc: { x0: 8, x1: 90, base: 21, amp: 7, freq: 0.75, phase: 0.6 },
    // sem `stars`: aqui o céu é montado mês a mês, um capítulo por vez
    milestones: namoroMilestones,
  },
  {
    id: 'comeco',
    nav: 'como tudo começou',
    heroKicker: 'a nossa história, pra ti',
    heroDate: '06 · 06 · 2026',
    heroCounter: 'conhecemos',
    skyLabel: 'a nossa constelação',
    albumDir: '',
    albumLabel: 'o nosso álbum',
    albumTitle: 'a gente, em fotos',
    tracks: ['/musica.mp3', '/musica2.mp3', '/musica3.mp3'],
    seed: 20260606,
    // o mundo 1 tem todas as posições na mão; a curva fica só de reserva
    arc: { x0: 5, x1: 85, base: 18, amp: 9, freq: 0.5, phase: 1.6 },
    stars: place(milestones, { x0: 5, x1: 85, base: 18, amp: 9, freq: 0.5, phase: 1.6 }),
    finale: PROPOSAL,
  }
]

/** O mundo que abre o site. */
export const DEFAULT_WORLD: World['id'] = 'namoro'

export const worldById = (id: string | null | undefined) =>
  worlds.find((w) => w.id === id) ?? worlds.find((w) => w.id === DEFAULT_WORLD)!
