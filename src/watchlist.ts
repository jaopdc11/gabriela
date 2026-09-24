/**
 * O nosso cinema: o que a gente já viu junto, o que tá no meio, e o que ficou
 * combinado pra ver.
 *
 * Aqui não tem data em lugar nenhum, de propósito. A gente não lembra de quando
 * foi cada filme — e não é disso que se trata. O que importa é que foi com a
 * gente, deitado, com um dormindo no meio do terceiro ato.
 *
 * Pra acrescentar um título: só colar um bloco novo na lista certa. O mínimo é
 * `title` e `kind`; o resto é enfeite e pode ir chegando depois.
 *
 *   { title: 'Interestelar', kind: 'filme', year: 2014 },
 *
 * Quando a gente terminar um da lista de espera, é só mover o bloco de lista —
 * de `toWatch` (ou de `watching`) pra `seen`.
 *
 * O cartaz é automático: põe a imagem em `src/cartazes/` com o nome do filme
 * (sem acento, espaço vira hífen) que ele aparece sozinho. Sem cartaz, o título
 * vira um cartaz de letra e continua bonito — a lista nunca fica quebrada
 * esperando imagem.
 */

/**
 * A música tema, que toca quando ela abre o cartaz. `preview` é o trecho de 30
 * segundos que a própria Apple publica pra qualquer um ouvir — não é arquivo
 * nosso, é o link deles, então pode sumir um dia sem avisar (se sumir, o cartaz
 * simplesmente não toca nada, não quebra).
 */
export type Theme = {
  track: string
  artist: string
  /** URL do trecho de 30s (iTunes Preview), ou `/temas/...mp3` quando é a versão dublada que a gente cortou */
  preview: string
}

export type Watch = {
  title: string
  kind: 'filme' | 'serie'
  /**
   * Nome do arquivo em `src/cartazes/` (com ou sem extensão). Só é preciso
   * quando o nome do arquivo não bate com o título — o normal é deixar em
   * branco e nomear a imagem igual ao filme.
   */
  poster?: string
  /** O ano, quando ajuda a diferenciar (tem três "Suspiria" no mundo). */
  year?: number
  /** Quem dirigiu; na série, quem criou. */
  by?: string
  /** Duração em minutos; na série, a de um episódio. */
  runtime?: number
  /** Só nas séries: o tamanho da coisa toda. */
  seasons?: number
  episodes?: number
  /** Onde a gente parou. Só faz sentido em `watching`: 'temporada 1 de 5'. */
  progress?: string
  /** Gênero em duas palavras, do jeito que a gente falaria. */
  genre?: string
  /** Do que é o filme, curto — pra ela decidir se quer ver hoje. */
  synopsis?: string
  /** O que ficou desse título pra gente. É a minha voz, e vem depois da sinopse. */
  note?: string
  theme?: Theme
}


/** O que a gente já viu junto, inteiro. Ordem livre — é do jeito que lembrei. */
export const seen: Watch[] = [
  {
    title: 'Ela Dança, Eu Danço',
    kind: 'filme',
    year: 2006,
    by: 'Anne Fletcher',
    runtime: 98,
    genre: 'dança, romance',
    synopsis:
      'um moleque de rua cumprindo serviço comunitário numa escola de arte acaba virando o par da bailarina que precisava de um. o mundo dele e o dela não combinam, e é isso que o filme quer.',
    theme: {
      track: '\'Bout It',
      artist: 'Yung Joc',
      preview:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/23/36/a3/2336a3d9-cea5-96c0-a8ad-33174a609b23/mzaf_11807119043534110394.plus.aac.p.m4a',
    },
  },
  {
    title: 'Piratas do Caribe: A Maldição do Pérola Negra',
    kind: 'filme',
    year: 2003,
    by: 'Gore Verbinski',
    runtime: 137,
    genre: 'aventura, fantasia',
    synopsis:
      'um ferreiro apaixonado se junta ao pirata mais desonesto do mar pra resgatar a filha do governador de uma tripulação amaldiçoada, que só aparece inteira sob a luz da lua.',
    theme: {
      track: 'He\'s a Pirate',
      artist: 'Klaus Badelt',
      preview:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/0d/21/07/0d2107c4-573b-6649-229e-e715501010cc/mzaf_8361386078907471110.plus.aac.p.m4a',
    },
  },
  {
    title: 'Piratas do Caribe: O Baú da Morte',
    kind: 'filme',
    year: 2006,
    by: 'Gore Verbinski',
    runtime: 145,
    genre: 'aventura, fantasia',
    synopsis:
      'jack sparrow deve uma alma a davy jones, o capitão do holandês voador, e o prazo venceu. o mar manda um kraken cobrar.',
    theme: {
      track: 'Jack Sparrow',
      artist: 'Hans Zimmer',
      preview:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d5/5d/9f/d55d9f9d-f757-8bc7-7884-de31d0e10130/mzaf_6341470117852937710.plus.aac.p.m4a',
    },
  },
  {
    title: 'Piratas do Caribe: No Fim do Mundo',
    kind: 'filme',
    year: 2007,
    by: 'Gore Verbinski',
    runtime: 162,
    genre: 'aventura, fantasia',
    synopsis:
      'com jack no fim do mundo e a companhia das índias caçando pirata, os nove senhores do mar se reúnem uma última vez. acaba em redemoinho, com casamento no meio da batalha.',
    theme: {
      track: 'Hoist the Colours',
      artist: 'Hans Zimmer',
      preview:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/18/b7/5b/18b75b14-d82c-7a25-3302-65f85b82c05c/mzaf_7120728705225438689.plus.aac.p.m4a',
    },
  },
  {
    title: 'Homem-Aranha: Um Novo Dia',
    kind: 'filme',
    year: 2026,
    by: 'Destin Daniel Cretton',
    runtime: 145,
    genre: 'super-herói',
    synopsis:
      'o começo de novo do peter parker: sem ninguém lembrar quem ele é, sem stark, sem atalho — só ele e a cidade.',
    theme: {
      track: 'Suite New Day (from "Spider-Man: Brand New Day" Soundtrack)',
      artist: 'Michael Giacchino',
      preview:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4a/c1/d9/4ac1d96a-42e2-b4d6-0fb6-4e801f0a818d/mzaf_342156198563813226.plus.aac.p.m4a',
    },
  },
  {
    title: 'Doutor Estranho',
    kind: 'filme',
    year: 2016,
    by: 'Scott Derrickson',
    runtime: 115,
    genre: 'super-herói, fantasia',
    synopsis:
      'um neurocirurgião arrogante destrói as próprias mãos num acidente, procura cura no nepal e encontra magia. aprende a dobrar o tempo e o espaço.',
    theme: {
      track: 'The Master of the Mystic End Credits',
      artist: 'Michael Giacchino',
      preview:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/61/22/84/612284a3-0183-87bb-be05-1f6ddb0610c0/mzaf_8287043338833271126.plus.aac.p.m4a',
    },
  },
  {
    title: 'Thor: Ragnarok',
    kind: 'filme',
    year: 2017,
    by: 'Taika Waititi',
    runtime: 130,
    genre: 'super-herói, comédia',
    synopsis:
      'thor perde o martelo, o cabelo e o planeta pra uma irmã mais velha que ele não sabia que tinha. e ainda cai num mundo de sucata onde precisa lutar com o hulk.',
    theme: {
      track: 'Immigrant Song',
      artist: 'Led Zeppelin',
      preview:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ed/88/c3/ed88c303-f417-f3b7-5962-0a079357b60a/mzaf_9028447444293467204.plus.aac.p.m4a',
    },
  },
  {
    title: 'Capitão América: Guerra Civil',
    kind: 'filme',
    year: 2016,
    by: 'Anthony e Joe Russo',
    runtime: 147,
    genre: 'super-herói, ação',
    synopsis:
      'os vingadores se racham ao meio por causa de um acordo pra fiscalizar quem tem poder. de um lado o capitão, do outro o homem de ferro, e no fundo uma coisa bem mais antiga e pessoal.',
    theme: {
      track: 'Civil War',
      artist: 'Henry Jackman',
      preview:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/9c/3c/1c/9c3c1c3d-0e42-a745-1956-b37572d71ec7/mzaf_12572055734346241221.plus.aac.p.m4a',
    },
  },
  {
    title: 'João e Maria: Caçadores de Bruxas',
    kind: 'filme',
    year: 2013,
    by: 'Tommy Wirkola',
    runtime: 88,
    genre: 'ação, fantasia',
    synopsis:
      'os irmãos do conto de fada cresceram e viraram caçadores de bruxa profissionais, com armas grandes e nenhuma paciência.',
    theme: {
      track: 'The Witch Hunters',
      artist: 'Atli Örvarsson',
      preview:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/cd/04/96/cd049682-1634-d69e-5278-c5666d602716/mzaf_5715709841136621126.plus.aac.p.m4a',
    },
  },
  {
    title: 'John Wick: De Volta ao Jogo',
    kind: 'filme',
    year: 2014,
    by: 'Chad Stahelski',
    runtime: 101,
    genre: 'ação, vingança',
    synopsis:
      'mataram o cachorrinho que a mulher dele deixou de presente antes de morrer. era a última coisa segurando o assassino aposentado.',
    theme: {
      track: 'LED Spirals',
      artist: 'Le Castle Vania',
      preview:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/7d/bf/07/7dbf0740-e8d8-c016-e172-f7420214d9c6/mzaf_18114692394589276137.plus.aac.p.m4a',
    },
  },
  {
    title: 'Todo Mundo em Pânico 6',
    kind: 'filme',
    year: 2026,
    by: 'Michael Tiddes',
    runtime: 96,
    genre: 'comédia, paródia',
    synopsis:
      'a zoeira voltou: mais uma rodada tirando com a cara dos filmes de terror da vez.',
  },
  {
    title: 'O Estranho Mundo de Jack',
    kind: 'filme',
    year: 1993,
    by: 'Henry Selick',
    runtime: 73,
    genre: 'animação, musical',
    synopsis:
      'jack skellington, o rei do halloween, cansa da própria festa, descobre o natal por acidente e decide sequestrar o papai noel pra assumir o cargo.',
    theme: {
      track: 'Isto é Halloween',
      artist: 'dublagem brasileira',
      preview: '/temas/o-estranho-mundo-de-jack.mp3',
    },
  },
  {
    title: 'Os Instrumentos Mortais: Cidade dos Ossos',
    kind: 'filme',
    year: 2013,
    by: 'Harald Zwart',
    runtime: 124,
    genre: 'fantasia, aventura',
    synopsis:
      'clary descobre que a mãe escondeu dela um mundo inteiro de caçadores de demônio — e que ela é um deles.',
    theme: {
      track: 'Heart By Heart',
      artist: 'Demi Lovato',
      preview:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/b3/3f/a8/b33fa8e3-6cfb-e70f-122a-9fb11373e6cf/mzaf_2890937221731036417.plus.aac.p.m4a',
    },
  },
  {
    title: 'Diário de uma Paixão',
    kind: 'filme',
    year: 2004,
    by: 'Nick Cassavetes',
    runtime: 123,
    genre: 'romance, drama',
    synopsis:
      'um velho lê um caderno pra uma mulher num asilo: a história de um verão de 1940 e de um casal separado por dinheiro e por guerra.',
    note:
      'foi a primeira vez que eu te vi chorar. depois eu comecei a me declarar — um pouco de propósito, eu admito, mas também porque eu me emocionei de verdade — e a gente acabou chorando junto, os dois, no meio das declarações. te ver chorando com as coisas que eu falava fez meu coração brilhar de um jeito que eu não sei explicar. tu confiar em mim pra chorar, e conseguir chorar, foi lindo. e quando a noite baixou eu agradeci a oxóssi e à iemanjá por ti — meu pai me abençoou com uma filha da minha própria mãe, e eu sou grato pra caralho por isso, vida. é um dos momentos mais especiais que eu tenho até hoje.',
    theme: {
      track: 'Main Title (The Notebook)',
      artist: 'Aaron Zigman',
      preview:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/9b/08/20/9b08209e-ce26-586a-5f37-559d5a8e392d/mzaf_18006676464140172232.plus.aac.p.m4a',
    },
  },
  {
    title: 'Irmão Urso',
    kind: 'filme',
    year: 2003,
    by: 'Aaron Blaise e Robert Walker',
    runtime: 85,
    genre: 'animação, aventura',
    synopsis:
      'um caçador mata um urso por vingança e os espíritos o transformam naquilo que ele odiava. pra voltar a ser gente ele tem que atravessar o mundo com um filhote falante de companhia.',
    theme: {
      track: 'Lá Vou Eu',
      artist: 'dublagem brasileira',
      preview: '/temas/irmao-urso.mp3',
    },
  },
]

/**
 * O que a gente começou e ainda não terminou. Fica aceso na parede, igual ao
 * que já vimos — a gente já entrou nessa história —, só que com o selo dizendo
 * onde a gente parou.
 */
export const watching: Watch[] = [
  {
    title: 'La Casa de Papel',
    kind: 'serie',
    year: 2017,
    by: 'Álex Pina',
    runtime: 70,
    seasons: 5,
    episodes: 41,
    progress: 'temporada 1 de 5',
    genre: 'assalto, suspense',
    synopsis:
      'um homem que se chama professor junta oito ladrões com nome de cidade pra invadir a casa da moeda da espanha e imprimir o próprio resgate.',
    theme: {
      track: 'Bella Ciao (Música Original de la Serie La Casa de Papel / Money Heist)',
      artist: 'Manu Pilas',
      preview:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ca/47/9b/ca479b14-5c55-22e1-4afe-c5497735df66/mzaf_18311470039273782382.plus.aac.p.m4a',
    },
  },
]

/**
 * O que a gente combinou de ver e ainda não viu. No site esses cartazes ficam
 * apagados, esperando: acendem quando ela passa o dedo.
 */
export const toWatch: Watch[] = [
  {
    title: 'Vingadores: Doomsday',
    kind: 'filme',
    year: 2026,
    by: 'Anthony e Joe Russo',
    genre: 'super-herói',
    synopsis:
      'a reunião gigante da marvel, com o doutor destino do outro lado da mesa.',
    theme: {
      track: 'The Avengers',
      artist: 'Alan Silvestri',
      preview:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/bf/a7/9f/bfa79f79-b635-0f8c-d72f-e59db79108af/mzaf_9009025771638181825.plus.aac.p.m4a',
    },
  },
  {
    title: 'Shadowhunters',
    kind: 'serie',
    year: 2016,
    by: 'Ed Decter',
    runtime: 42,
    seasons: 3,
    episodes: 55,
    genre: 'fantasia, aventura',
    synopsis:
      'a mesma história dos instrumentos mortais, agora esticada com tempo pra respirar: clary, os caçadores, e o mundo que existe por baixo do nosso.',
    theme: {
      track: 'Game Of Survival',
      artist: 'Ruelle',
      preview:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/cb/0e/d2/cb0ed2d0-b3b5-7ec3-c808-425638f68a36/mzaf_12093575919374375811.plus.aac.p.m4a',
    },
  },
  {
    title: 'Verity',
    kind: 'filme',
    year: 2026,
    by: 'Michael Showalter',
    genre: 'suspense, drama',
    synopsis:
      'uma escritora é contratada pra terminar os livros de uma autora acidentada, e acha no escritório dela um manuscrito que ninguém devia ler.',
  },
  {
    title: 'Piratas do Caribe: Navegando em Águas Misteriosas',
    kind: 'filme',
    year: 2011,
    by: 'Rob Marshall',
    runtime: 136,
    genre: 'aventura, fantasia',
    synopsis:
      'jack sparrow atrás da fonte da juventude, junto de uma ex que ele preferia não ter reencontrado e do barba negra.',
    theme: {
      track: 'Angelica (feat. Rodrigo y Gabriela)',
      artist: 'Hans Zimmer',
      preview:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/60/dd/57/60dd575b-ae5b-db8f-1377-638f818d6d79/mzaf_496727952455067292.plus.aac.p.m4a',
    },
  },
  {
    title: 'Piratas do Caribe: A Vingança de Salazar',
    kind: 'filme',
    year: 2017,
    by: 'Joachim Rønning e Espen Sandberg',
    runtime: 129,
    genre: 'aventura, fantasia',
    synopsis:
      'um capitão espanhol morto-vivo sai do triângulo do diabo pra cobrar de jack uma conta velha, e o filho do will turner quer quebrar a maldição do pai.',
    theme: {
      track: 'Salazar',
      artist: 'Geoff Zanelli',
      preview:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/18/2f/64/182f649c-b298-ec82-c86c-8124673777fe/mzaf_12877243854248412426.plus.aac.p.m4a',
    },
  },
  {
    title: 'Ela Dança, Eu Danço 2: As Ruas',
    kind: 'filme',
    year: 2008,
    by: 'Jon M. Chu',
    runtime: 98,
    genre: 'dança, romance',
    synopsis:
      'uma dançarina de rua entra na escola de arte de baltimore e monta uma crew com os desajustados da turma pra encarar a batalha clandestina da cidade.',
    theme: {
      track: 'Low (feat. T-Pain)',
      artist: 'Flo Rida',
      preview:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/4c/53/06/4c530616-d7e2-b108-e5cb-0ba2f6a1a141/mzaf_17877470589452967902.plus.aac.p.m4a',
    },
  },
  {
    title: 'Ela Dança, Eu Danço 3',
    kind: 'filme',
    year: 2010,
    by: 'Jon M. Chu',
    runtime: 111,
    genre: 'dança',
    synopsis:
      'a crew de nova york dança pelo aluguel do galpão onde mora, numa competição mundial. é o que tem o número na água.',
    theme: {
      track: 'Club Can\'t Handle Me (feat. David Guetta) [From "Step Up 3D"]',
      artist: 'Flo Rida',
      preview:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ff/07/97/ff0797ab-a24b-5423-64b3-c5b6e0173583/mzaf_11135363908447775433.plus.aac.p.m4a',
    },
  },
  {
    title: 'Ela Dança, Eu Danço 4',
    kind: 'filme',
    year: 2012,
    by: 'Scott Speer',
    runtime: 97,
    genre: 'dança',
    synopsis:
      'uma crew de miami transforma flash mob em protesto pra impedir que o bairro onde eles cresceram seja demolido.',
  },
  {
    title: 'Ela Dança, Eu Danço 5: Tudo ou Nada',
    kind: 'filme',
    year: 2014,
    by: 'Trish Sie',
    runtime: 112,
    genre: 'dança',
    synopsis:
      'as crews dos filmes anteriores se juntam num reality show de dança em las vegas: o encontro de todo mundo.',
  },
  {
    title: 'A Escolha Perfeita',
    kind: 'filme',
    year: 2012,
    by: 'Jason Moore',
    runtime: 112,
    genre: 'comédia, musical',
    synopsis:
      'uma caloura que só queria ser dj entra sem querer no grupo de canto a capella da faculdade, que precisa parar de ser ridículo pra ganhar o nacional.',
    theme: {
      track: 'Cups (When I\'m Gone) [From "Pitch Perfect"]',
      artist: 'Anna Kendrick',
      preview:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/68/0d/a8/680da875-864e-8e97-2f7f-e3624d9941f0/mzaf_7077360117491860366.plus.aac.p.m4a',
    },
  },
  {
    title: 'Irmão Urso 2',
    kind: 'filme',
    year: 2006,
    by: 'Ben Gluckman',
    runtime: 73,
    genre: 'animação, aventura',
    synopsis:
      'kenai continua urso, e a nita, amiga de infância dele, precisa queimar o amuleto que ele deu pra ela quando eram crianças pra poder casar. os dois vão juntos até as cachoeiras, com o koda de vela no caminho todo.',
    theme: {
      track: 'Não Há Segredo',
      artist: 'dublagem brasileira',
      preview: '/temas/irmao-urso-2.mp3',
    },
  },
  {
    title: 'Homem-Aranha: De Volta ao Lar',
    kind: 'filme',
    year: 2017,
    by: 'Jon Watts',
    runtime: 133,
    genre: 'super-herói, aventura',
    synopsis:
      'peter tem quinze anos, uma queda pela liz e um traje emprestado pelo tony stark. só quer provar que dá conta de coisa grande, e aí aparece o abutre.',
    theme: {
      track: 'Theme (from "Spider Man") [Original Television Series]',
      artist: 'Michael Giacchino',
      preview:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/98/90/3d/98903dea-11ed-69be-f8db-50fd89d178c1/mzaf_12408173817130875504.plus.aac.p.m4a',
    },
  },
  {
    title: 'Homem-Aranha: Longe de Casa',
    kind: 'filme',
    year: 2019,
    by: 'Jon Watts',
    runtime: 129,
    genre: 'super-herói, aventura',
    synopsis:
      'excursão da escola pela europa, peter querendo só se declarar pra mj, e um cara de aquário na cabeça dizendo que veio de outra dimensão pra ajudar.',
    theme: {
      track: 'Far From Home Suite Home (from "Spider-Man: Far From Home" Soundtrack)',
      artist: 'Michael Giacchino',
      preview:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/de/8a/ff/de8aff39-3d55-c0f9-b8db-d16c55654353/mzaf_3325337127529967900.plus.aac.p.m4a',
    },
  },
  {
    title: 'Homem-Aranha: Sem Volta para Casa',
    kind: 'filme',
    year: 2021,
    by: 'Jon Watts',
    runtime: 148,
    genre: 'super-herói, ação',
    synopsis:
      'peter pede pro doutor estranho fazer o mundo esquecer quem ele é. o feitiço racha, e os vilões das outras versões caem aqui.',
    theme: {
      track: 'Arachnoverture (from "Spider-Man: No Way Home" Soundtrack)',
      artist: 'Michael Giacchino',
      preview:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/fb/09/ae/fb09aece-954c-de9f-628b-626b183650cc/mzaf_3363810067298231749.plus.aac.p.m4a',
    },
  },
]

/** Sem acento, sem espaço: 'Cidade de Deus' -> 'cidade-de-deus'. */
export const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
