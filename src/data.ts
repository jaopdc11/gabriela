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
    description: `Eu não tava nem um pouco a fim de ir nessa festa, zero mesmo. Mas tinha uma voz insistindo no meu ouvido, e como eu confio na minha espiritualidade, acabei indo. Cheguei já de saco cheio, meu amigo me chamou pra vazar e a voz mandou eu ficar. Fiquei.
Meia hora depois eu já tava de papo com você, morrendo de medo de você ser areia demais pro meu caminhão. Rolou aquele silêncio constrangedor, eu virei pra falar alguma coisa e você já tava me olhando: "tu ficaria comigo?". Travei, falei que sim, e cara, que beijo foi aquele. Fiquei tão bobo que nem o teu Insta eu consegui pedir, e você vazou atrás da Andressa.
No dia seguinte passei o dia todo me xingando, torrando a paciência do Matheus. Aí você me mandou solicitação pra eu te seguir e eu tremi na base. Tava jogando sinuca com os amigos e de tão nervoso precisei de ajuda até pra te responder.`,
    x: 5,
    y: 28,
  },
  {
    date: new Date(2026, 5, 13),
    title: 'A primeira vez, só nós dois',
    description: `Eu tinha um compromisso com um amigo pra resolver uma treta, mas meti um migué e fui pra Univali. Na real só queria dar um jeito de te ver de novo. Não te achei, mas foi esse amigo que me deu coragem pra te chamar pra sair no Quinta (um lugar meio ruim, confesso, mas eu mal te conhecia, então arrisquei).
Você me deixou DOZE minutos no vácuo. Doze. Eu tremendo, achando que tinha estragado tudo de afobado. Aí do nada você aceitou, e eu GRITEI. Meu amigo caiu na risada. Foi numa terça, e a gente saiu na sexta.
Esse rolê foi incrível, foi quando deu pra conversar de verdade. Você me ganhou de vez quando pediu pra eu te explicar umas coisas da minha umbanda, e eu fiquei olhando os teus olhinhos e o teu sorrisinho me ouvindo. Foi ali que eu me apaixonei, uma semana depois de te conhecer. Ainda joguei sinuca fazendo o possível pra te deixar ganhar (não rolou), e despistei dois amigos que brotaram do nada quando vi que você ficou meio sem graça.`,
    x: 12,
    y: 23,
  },
  {
    date: new Date(2026, 5, 15),
    title: 'O dia da praia (a gente se apaixonando)',
    description: `No Quinta você tinha soltado que gostava de praia e de bike. De indireta aquilo não teve nada kkk, e eu peguei a deixa e dei a ideia depois. E a gente foi.
Minha bike tava toda fudida desde que me atropelaram no começo do ano, nunca arrumei, e tava pesadíssima. Mas fui assim mesmo, morrendo de pedalar e sem reclamar nada. Lá pela metade do caminho você trocou de bike comigo e finalmente entendeu que eu não tava sendo fresco, a bike era um horror mesmo.
A gente chegou, sentou e ficou ali: conversa, baralho, um rolê de casal já, mesmo a gente ainda nem sendo. Não fomos pra se pegar nem nada, e foi isso que deixou o dia tão bom. Ah, e eu perdi de novo, 7 a 2 no pife, fiquei puto brincando. Guardei as cartas usando a derrota de desculpa ("cansei de perder"), mas na real era só pra te abraçar. Ficamos coladinhos olhando o mar.
Aí eu soltei uma cantadinha e te beijei. Foi incrível. Depois a gente deitou na areia de conchinha, vendo o mar, e você dormiu nos meus braços. Eu fiquei em choque, pqp, com a confiança de você dormir ali, tão tranquila, do meu lado.
Foi nesse dia também que eu aprendi uma coisa que eu não vou esquecer nunca: que o teu "não" é sagrado, e que você nunca precisa ter medo de me dizer. A gente conversou sobre isso e eu fiz questão de deixar bem claro.
Foi na praia, nesse dia, que a gente se apaixonou de vez, um pelo outro.`,
    x: 18,
    y: 26,
  },
  {
    date: new Date(2026, 5, 20),
    title: 'A primeira noite na sua casa',
    description: `Eu tava doido pra ir na tua casa, sem segunda intenção nenhuma. Só queria conhecer o teu cantinho, o teu mundinho. Até então eu só parava na tua esquina, nem sabia direito onde você morava, e te respeitei demais por isso. Quando ouvi o teu áudio me convidando eu quase chorei, e fui na hora.
Antes disso a gente se encontrou no fim do dia e foi no cinema debaixo de uma chuva do caramba. Vimos "Todo Mundo em Pânico 6" (eu nunca tinha visto os outros cinco), mas a tua risada é tão gostosa que a gente acabou rindo o filme inteiro.
Cheguei na tua casa com medo de te incomodar, e quase fui embora de vergonha quando derrubei a Ice na tua toalha, de puro nervoso. A gente jogou baralho e eu apanhei, porque você SEMPRE me ganha no pife (que saco kkk). Depois a gente foi deitar, e eu nunca tinha tido uma noite tão tranquila na vida. Dormir no teu calor e no teu cheiro foi a melhor coisa que me aconteceu em muito tempo. Fiquei viciado.`,
    x: 25,
    y: 17,
  },
  {
    date: new Date(2026, 5, 25),
    title: 'A primeira tempestade',
    description: `Foi uma coisa que você fez, e depois me contou, que me machucou pra caramba. Eu tava no escritório e precisei ir pro banheiro. Vou ser sincero, chorei ali dentro. Doeu tanto que passou pela minha cabeça não falar mais com você.
Você propôs a gente conversar pessoalmente, e sinceramente eu nem queria te ver naquele dia. Cheguei em casa, firmei uma vela pra Oxóssi e perguntei pro meu pai se eu devia ir. Ele foi direto: devia. Então eu fui.
Foi ali que eu chorei na tua frente pela primeira vez, e vi o teu olho brilhar também, segurando o choro. O tempo todo eu só queria te abraçar e nunca mais te soltar, mas antes eu precisava te ouvir. Doeu, doeu muito. Mas eu te amo demais, e a gente atravessou isso junto.`,
    x: 32,
    y: 20,
  },
  {
    date: new Date(2026, 5, 26),
    title: 'O primeiro "eu te amo"',
    description: `A gente já vinha há dias rondando as "três palavrinhas", aquela vontade de soltar toda vez que se via, mas sempre segurando. Até que numa madrugada você me acordou. E como é só do teu lado que eu durmo fundo de verdade, você perguntou "tá acordado?" e eu, de tanto sono, respondi "eu tava, fala", totalmente sem sentido. A gente riu por um tempão disso.
Aí, do nada, você falou: "eu amo você, e tenho medo de te perder". Meu olho encheu na hora, e eu não parei mais de falar. De você, de estar com você, de dormir com você, do teu cheiro, de tudo.`,
    x: 38,
    y: 11,
  },
  {
    date: new Date(2026, 5, 27),
    title: 'Conhecemos as mães',
    description: `Você conheceu a minha e eu conheci a sua no mesmo dia. Eu tava morrendo de nervoso pra encarar a tua mãe, então, de surpresa e sem te avisar, te joguei pra conhecer a minha primeiro. Você ficou toda tímida, e essa foi a minha vingancinha, que valeu cada segundo kkk.
No fim eu ainda voltei pra casa com o teu moletom, e você ficou com uma camisa minha. Não larguei aquele moletom até o teu cheiro sumir dele. E mesmo agora, sem ele, eu ainda sinto esse cheiro só de pensar em você.`,
    x: 45,
    y: 14,
  },
  {
    date: new Date(2026, 6, 11),
    title: 'A festa TYC (nosso primeiro rolê fora)',
    description: `Foi o nosso primeiro rolê pra fora, juntos, e só por isso já entrou pra história. A gente foi na van da atlética, todo coladinho, escolhendo as músicas pra postar as nossas fotos no Insta. Foi a primeira vez que a gente se assumiu assim, escancarado, com rosto e tudo (nas outras eu nunca aparecia direito). Isso mexeu demais comigo.
A festa em si foi tranquila. Dediquei um pagode pra você, a gente dançou, e de vez em quando eu dava um pulo pra ver os amigos. Nada de mais, mas teve duas coisas que ficaram cravadas em mim: a gente dançando agarradinho e se beijando na frente de todo mundo, até das tuas amigas. Eu ali, sem esconder de ninguém que era teu.
Você acabou bebendo além da conta e passou mal, então a gente voltou mais cedo. Foi também a primeira vez que você me viu fumando, e eu confesso que me senti meio mal com isso. Mas no fim o que ficou foi você, podre de bêbada, dormindo do meu lado. E eu do lado, com a mesma sensação de sempre: é aqui que eu quero ficar.`,
    x: 52,
    y: 8,
  },
  {
    date: new Date(2026, 6, 13),
    title: 'A bênção nas alianças',
    description: `Esse foi um dos maiores passos que eu já dei por nós. Peguei as alianças de namoro que eu já tinha comprado e levei lá no terreiro, pro Seo Tranca Rua das Almas, o Exu da minha mãe de santo, cruzar e abençoar. Era pra blindar o nosso namoro de olho gordo, de fofoca, de tudo que pudesse tentar separar a gente.
E ele fez. O Seo Tranca Rua das Almas deu a bênção nas nossas alianças.
Ali eu senti uma coisa que lá no fundo eu já sabia, mas que naquele momento virou certeza absoluta: que a gente tem que estar junto mesmo. Porque se não tivesse caminho pra nós, ele JAMAIS teria feito aquilo. Jamais. Saí de lá mais feliz, mais confiante e mais seguro do que eu já tinha me sentido na vida. E, por fundamento, te contei tudo assim que botei o pé pra fora do terreiro.`,
    x: 58,
    y: 13,
  },
  {
    date: new Date(2026, 6, 19),
    title: 'O show do Alexandre Pires',
    description: `Essa estrela tá guardada pro nosso primeiro show juntos: Alexandre Pires, puro pagode. Quando o dia chegar eu volto aqui e conto tudo, como foi cantar essas músicas todas grudado em você.`,
    x: 65,
    y: 11,
  },
  {
    date: new Date(2026, 6, 20),
    title: 'O meu amaci (você no meu terreiro)',
    description: `Essa é uma das estrelas mais importantes de todas, por isso ela tá reservada com todo cuidado. É o dia em que você vai pisar no meu terreiro, no meu amaci, o meu momento mais sagrado, o mais meu que existe. Te levar pra lá é te abrir a minha fé inteira. Depois que acontecer, eu venho aqui e preencho com o que a gente viver.`,
    x: 72,
    y: 19,
  },
]
