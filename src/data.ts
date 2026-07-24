export type Milestone = {
  /** Data do momento (horário local). */
  date: Date
  title: string
  description: string
  /** Posição da estrela na constelação: x em 0–100, y em 0–44 (widescreen). */
  x: number
  y: number
}

/** A data em que tudo começou — usada no contador principal. */
export const START_DATE = new Date(2026, 5, 7, 3, 30) // 07/06/2026 03:30

/** Nossa constelação: cada estrela é um momento, em ordem cronológica. */
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
Aí vieram doze minutos de vácuo (ainda não superei) que pareceram a minha vida inteira. Doze. Eu já me achando um idiota afobado que tinha estragado tudo antes de começar. Quando tu aceitou, eu gritei, não teve como segurar, e meu amigo riu da minha cara como se eu fosse o maior otário do planeta KKKKKKKKKKKK
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
