import { useId } from 'react'

/**
 * Desenhos do clima pro Jack, o Pânico, João e Maria e John Wick (ver
 * `Ambience.tsx`). Pintam com `currentColor`; o volume vem de degradê por cima
 * (luz em branco, sombra na cor do fundo), nunca de filtro — filtro de blur
 * trava no celular. O `useId` dá a cada cópia os seus degradês.
 */

/** A cor do fundo da ficha aberta: o que é vazado no desenho. */
const HOLE = '#04050b'

type P = { className?: string }

/* ─── o estranho mundo de jack ────────────────────────────────────────────── */

/**
 * A cabeça do Jack: crânio largo, queixo afinando sem pescoço, olhos enormes
 * caídos pra fora e o sorriso costurado passando da borda. O volume é uma luz
 * vinda do alto à esquerda e uma sombra redonda nas beiradas; as sobrancelhas
 * são o vinco em cima do olho, que dá a cara de deboche dele.
 */
export function JackSkull({ className }: P) {
  const id = useId()
  return (
    <svg viewBox="0 0 48 52" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-v`} cx=".38" cy=".3" r=".75">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset=".45" stopColor="#fff" stopOpacity="0" />
          <stop offset=".8" stopColor={HOLE} stopOpacity=".12" />
          <stop offset="1" stopColor={HOLE} stopOpacity=".45" />
        </radialGradient>
      </defs>
      <path
        d="M24 2C11 2 3 10.5 3 22c0 6.2 2.1 10.4 5 13.6 2.6 2.9 4.4 5.9 6.6 9.3C17 48.6 20 50.5 24 50.5s7-1.9 9.4-5.6c2.2-3.4 4-6.4 6.6-9.3 2.9-3.2 5-7.4 5-13.6C45 10.5 37 2 24 2z"
        fill="currentColor"
      />
      <path
        d="M24 2C11 2 3 10.5 3 22c0 6.2 2.1 10.4 5 13.6 2.6 2.9 4.4 5.9 6.6 9.3C17 48.6 20 50.5 24 50.5s7-1.9 9.4-5.6c2.2-3.4 4-6.4 6.6-9.3 2.9-3.2 5-7.4 5-13.6C45 10.5 37 2 24 2z"
        fill={`url(#${id}-v)`}
      />
      {/* as maçãs do rosto afundando embaixo do olho */}
      <path d="M6 27c2 4 5 5.5 8 5.5M42 27c-2 4-5 5.5-8 5.5" stroke={HOLE} strokeOpacity=".18" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      {/* a órbita: um halo de sombra em volta, depois o buraco */}
      <path d="M6.3 18.8c.6-7.6 7.4-10 13.2-7 4.1 2.3 3.5 9.9-.6 14-4.6 4.1-13.2 1.7-12.6-7z" fill={HOLE} fillOpacity=".22" />
      <path d="M41.7 18.8c-.6-7.6-7.4-10-13.2-7-4.1 2.3-3.5 9.9.6 14 4.6 4.1 13.2 1.7 12.6-7z" fill={HOLE} fillOpacity=".22" />
      <path d="M7.5 19c.5-6.5 6.5-8.5 11.5-6 3.5 2 3 8.5-.5 12-4 3.5-11.5 1.5-11-6z" fill={HOLE} />
      <path d="M40.5 19c-.5-6.5-6.5-8.5-11.5-6-3.5 2-3 8.5.5 12 4 3.5 11.5 1.5 11-6z" fill={HOLE} />
      {/* as sobrancelhas: o vinco arqueado, uma mais alta que a outra */}
      <path d="M7.8 11.2c3-3.4 8.4-4.2 12.2-1.6M40.2 10.2c-3-2.6-8-3-11.6-.8" stroke={HOLE} strokeOpacity=".45" strokeWidth="1.1" strokeLinecap="round" fill="none" />
      {/* a rachadurinha na testa */}
      <path d="M31.5 3.2l-1 2.6 1.6 1.4-1.2 2.4" stroke={HOLE} strokeOpacity=".35" strokeWidth=".7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* narinas */}
      <path d="M22.3 27.2l-.9 2M25.7 27.2l.9 2" stroke={HOLE} strokeWidth="1.5" strokeLinecap="round" />
      {/* o sorriso de orelha a orelha, grosso no meio e afinando nas pontas,
          com os pontos da costura atravessando meio tortos */}
      <path d="M5.6 30.6c6.2 10.6 30.6 10.6 36.8 0-6.4 8.4-30.4 8.4-36.8 0z" fill={HOLE} stroke={HOLE} strokeWidth="1" strokeLinejoin="round" />
      <path
        d="M8.4 31.4l.6 4.4M12.1 33.6l.3 4.6M16.6 35.2v4.6M21.4 35.9l-.1 4.7M26.6 35.9l.1 4.7M31.4 35.2v4.6M35.9 33.6l-.3 4.6M39.6 31.4l-.6 4.4"
        stroke={HOLE}
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      {/* a covinha nas pontas do sorriso */}
      <path d="M4.6 29.4c.4 1 1 1.6 1.8 2M43.4 29.4c-.4 1-1 1.6-1.8 2" stroke={HOLE} strokeWidth="1" strokeLinecap="round" fill="none" />
    </svg>
  )
}

/* ─── todo mundo em pânico ────────────────────────────────────────────────── */

/**
 * O Pânico, desenhado por cima da foto de frente do Ghostface (a do Scream de
 * 2022, na wiki de Scream): as medidas saíram dela, numa grade de 500×700, e o
 * grupo de dentro escala isso pro 60×84.
 *
 * A máscara é comprida e estreita embaixo: testa larga, bochecha descendo em
 * curva até o queixo em cunha. Os olhos são gotas com a ponta de cima pra
 * dentro, perto do nariz, e a barriga caindo pra fora; o nariz são duas
 * fendinhas; a boca é o grito comprido, quase até o queixo. O capuz é largo,
 * de pontinha, cai pelos ombros e emoldura o rosto num buraco escuro. Só a
 * máscara obedece a cor da camada; o capuz tem cor de pano e um fio de borda
 * pra não sumir no fundo.
 */
const GF_MASK =
  'M270 70C287.3 70.0 308.7 75.0 322 80C335.3 85.0 342.3 91.7 350 100C357.7 108.3 363.7 118.3 368 130C372.3 141.7 374.0 155.0 376 170C378.0 185.0 379.8 203.3 380 220C380.2 236.7 378.7 256.7 377 270C375.3 283.3 373.5 290.8 370 300C366.5 309.2 361.0 316.7 356 325C351.0 333.3 345.2 337.5 340 350C334.8 362.5 329.2 381.7 325 400C320.8 418.3 318.5 442.5 315 460C311.5 477.5 308.2 493.3 304 505C299.8 516.7 295.7 523.8 290 530C284.3 536.2 276.7 542.0 270 542C263.3 542.0 255.7 536.2 250 530C244.3 523.8 240.2 516.7 236 505C231.8 493.3 228.5 477.5 225 460C221.5 442.5 219.2 418.3 215 400C210.8 381.7 205.2 362.5 200 350C194.8 337.5 189.0 333.3 184 325C179.0 316.7 173.5 309.2 170 300C166.5 290.8 164.7 283.3 163 270C161.3 256.7 159.8 236.7 160 220C160.2 203.3 162.0 185.0 164 170C166.0 155.0 167.7 141.7 172 130C176.3 118.3 182.3 108.3 190 100C197.7 91.7 204.7 85.0 218 80C231.3 75.0 252.7 70.0 270 70Z'
const GF_EYE = 'M259 190c-18 1-50 13-72 34-16 16-19 46-3 58s44-2 59-26c12-18 19-44 16-66z'
const GF_NOSTRIL = 'M259 287c-6 4-8 12-4 16 4-2 8-8 8-14z'
const GF_MOUTH =
  'M270 336c-15 0-23 12-25 34-3 35-8 80-5 115 3 28 16 45 30 45s27-17 30-45c3-35-2-80-5-115-2-22-10-34-25-34z'
const mirror = 'matrix(-1 0 0 1 540 0)'

export function Ghostface({ className }: P) {
  const id = useId()
  return (
    <svg viewBox="0 0 60 84" className={className} aria-hidden>
      <defs>
        {/* o pano do capuz: luz no alto da cabeça, escurecendo pros ombros */}
        <linearGradient id={`${id}-c`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#343948" />
          <stop offset=".35" stopColor="#1b1e28" />
          <stop offset="1" stopColor="#0b0c12" />
        </linearGradient>
        {/* o buraco do capuz: mais fundo no meio, onde a máscara afunda */}
        <radialGradient id={`${id}-o`} cx=".5" cy=".45" r=".6">
          <stop offset="0" stopColor="#010102" />
          <stop offset=".8" stopColor="#05060a" />
          <stop offset="1" stopColor="#10121a" />
        </radialGradient>
        {/* plástico branco com luz de cima, sombra nas beiradas e no queixo */}
        <radialGradient id={`${id}-m`} cx=".45" cy=".22" r=".85">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset=".35" stopColor="#fff" stopOpacity="0" />
          <stop offset=".75" stopColor={HOLE} stopOpacity=".18" />
          <stop offset="1" stopColor={HOLE} stopOpacity=".5" />
        </radialGradient>
        <linearGradient id={`${id}-s`} x1="0" x2="0" y1="0" y2="1">
          <stop offset=".55" stopColor={HOLE} stopOpacity="0" />
          <stop offset="1" stopColor={HOLE} stopOpacity=".35" />
        </linearGradient>
        {/* o fundo da boca e dos olhos: um tico de luz lá dentro dá profundidade */}
        <linearGradient id={`${id}-b`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={HOLE} />
          <stop offset=".7" stopColor="#0b0c12" />
          <stop offset="1" stopColor="#1a1c26" />
        </linearGradient>
      </defs>

      <g transform="translate(-2.6 0) scale(.1304)">
        {/* o capuz, de pontinha, caindo pelos ombros */}
        <path
          d="M285 2C215 6 150 30 110 90 80 135 70 200 66 270c-4 60-14 100-46 130C0 420-20 480-20 644h544c0-124-15-194-40-224-20-25-28-60-32-120-4-80-8-150-38-205C382 45 340 6 285 2z"
          fill={`url(#${id}-c)`}
          stroke="#444b60"
          strokeWidth="9"
        />
        {/* o brilho do pano no alto da cabeça */}
        <path
          d="M150 70c40-40 85-58 135-60 50 2 90 25 118 62"
          stroke="#5e6780"
          strokeOpacity=".55"
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
        />
        {/* as dobras do pano */}
        <g stroke="#0a0b10" strokeWidth="12" strokeLinecap="round" fill="none" strokeOpacity=".9">
          <path d="M150 390c20 70 40 150 50 250" />
          <path d="M392 420c-18 70-35 140-45 220" />
          <path d="M92 470c-15 55-28 110-32 170" />
          <path d="M440 480c10 55 18 110 20 160" />
          <path d="M215 575c20 22 40 30 55 30s35-8 55-30" />
        </g>
        <g stroke="#3a4054" strokeWidth="5" strokeLinecap="round" fill="none" strokeOpacity=".6">
          <path d="M165 395c20 70 38 150 48 245" />
          <path d="M378 425c-16 70-32 140-42 215" />
          <path d="M104 470c-14 55-26 110-30 170" />
        </g>

        {/* o buraco do capuz em volta do rosto */}
        <path
          d="M270 42c-72 3-122 50-132 128-8 70 0 150 30 220 30 70 67 165 102 185 35-20 72-115 102-190 30-75 37-155 29-215-10-78-59-125-131-128z"
          fill={`url(#${id}-o)`}
        />

        {/* a máscara */}
        <path d={GF_MASK} fill="currentColor" />
        <path d={GF_MASK} fill={`url(#${id}-m)`} />
        <path d={GF_MASK} fill={`url(#${id}-s)`} />
        {/* as sobrancelhas esculpidas e o vinco da bochecha até a boca */}
        <g stroke={HOLE} strokeLinecap="round" fill="none">
          <path d="M176 214c22-22 52-32 80-30" strokeWidth="18" strokeOpacity=".06" />
          <path d="M176 214c22-22 52-32 80-30" transform={mirror} strokeWidth="18" strokeOpacity=".06" />
          <path d="M236 300c-8 12-12 26-11 40" strokeWidth="12" strokeOpacity=".05" />
          <path d="M236 300c-8 12-12 26-11 40" transform={mirror} strokeWidth="12" strokeOpacity=".05" />
          <path d="M270 250v30" strokeWidth="6" strokeOpacity=".1" />
        </g>
        {/* a órbita afundada em volta de cada olho, e o olho */}
        <path d={GF_EYE} fill="none" stroke={HOLE} strokeOpacity=".1" strokeWidth="26" strokeLinejoin="round" />
        <path d={GF_EYE} transform={mirror} fill="none" stroke={HOLE} strokeOpacity=".1" strokeWidth="26" strokeLinejoin="round" />
        <path d={GF_EYE} fill={`url(#${id}-b)`} />
        <path d={GF_EYE} transform={mirror} fill={`url(#${id}-b)`} />
        {/* narinas */}
        <path d={GF_NOSTRIL} fill={HOLE} />
        <path d={GF_NOSTRIL} transform={mirror} fill={HOLE} />
        {/* o grito, com a beirada de baixo pegando luz */}
        <path d={GF_MOUTH} fill={`url(#${id}-b)`} />
        <path
          d="M246 492c6 22 14 32 24 32s18-10 24-32"
          stroke="#fff"
          strokeOpacity=".35"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          transform="translate(0 9)"
        />
      </g>
    </svg>
  )
}

/* ─── joão e maria ────────────────────────────────────────────────────────── */

/**
 * Bala embrulhada em papel brilhante: as pontas torcidas com as dobras, a bala
 * redonda com luz de verniz, a listra e o reflexo.
 */
export function Candy({ className }: P) {
  const id = useId()
  return (
    <svg viewBox="0 0 44 24" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-b`} cx=".38" cy=".3" r=".75">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset=".4" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor={HOLE} stopOpacity=".38" />
        </radialGradient>
        <linearGradient id={`${id}-w`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".35" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor={HOLE} stopOpacity=".3" />
        </linearGradient>
      </defs>
      {/* as pontas torcidas do papel, em leque */}
      <g fill="currentColor" fillOpacity=".82">
        <path d="M13.5 12L2.5 3.2 4.6 7.6 1 9.8l3.2 2.2L1 14.2l3.6 2.2-2.1 4.4z" />
        <path d="M30.5 12l11-8.8-2.1 4.4 3.6 2.2-3.2 2.2 3.2 2.2-3.6 2.2 2.1 4.4z" />
      </g>
      <g fill={`url(#${id}-w)`}>
        <path d="M13.5 12L2.5 3.2 4.6 7.6 1 9.8l3.2 2.2L1 14.2l3.6 2.2-2.1 4.4z" />
        <path d="M30.5 12l11-8.8-2.1 4.4 3.6 2.2-3.2 2.2 3.2 2.2-3.6 2.2 2.1 4.4z" />
      </g>
      {/* as dobras do papel */}
      <path d="M12.6 11.2L5.4 7.8M12.6 12.8l-7.2 3.4M31.4 11.2l7.2-3.4M31.4 12.8l7.2 3.4" stroke={HOLE} strokeOpacity=".28" strokeWidth=".7" strokeLinecap="round" />
      {/* a torção, onde o papel aperta */}
      <path d="M13 9.6v4.8M31 9.6v4.8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M13 9.6v4.8M31 9.6v4.8" stroke={HOLE} strokeOpacity=".3" strokeWidth="2.4" strokeLinecap="round" />
      <ellipse cx="22" cy="12" rx="9.6" ry="7.8" fill="currentColor" />
      <path d="M16.6 5.4c3 4 3 9.2 0 13.2M22.8 4.3c3.2 4.4 3.2 11 0 15.4" stroke="#fff" strokeOpacity=".5" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <ellipse cx="22" cy="12" rx="9.6" ry="7.8" fill={`url(#${id}-b)`} />
      {/* o reflexo */}
      <path d="M16 7.6c1.6-1.8 3.8-2.8 6-2.9" stroke="#fff" strokeOpacity=".85" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    </svg>
  )
}

/** Pirulito de espiral, com a luz de vidro de doce duro e o reflexo curvo. */
export function Lollipop({ className }: P) {
  const id = useId()
  return (
    <svg viewBox="0 0 30 50" className={className} aria-hidden>
      <defs>
        <clipPath id={`${id}-c`}>
          <circle cx="15" cy="15" r="12.4" />
        </clipPath>
        <radialGradient id={`${id}-g`} cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#fff" stopOpacity=".5" />
          <stop offset=".35" stopColor="#fff" stopOpacity="0" />
          <stop offset=".8" stopColor={HOLE} stopOpacity=".1" />
          <stop offset="1" stopColor={HOLE} stopOpacity=".45" />
        </radialGradient>
        <linearGradient id={`${id}-s`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#f6f2ea" />
          <stop offset=".35" stopColor="#fff" />
          <stop offset="1" stopColor="#bdb6a8" />
        </linearGradient>
      </defs>
      <rect x="13.8" y="26" width="2.4" height="23" rx="1.2" fill={`url(#${id}-s)`} />
      <circle cx="15" cy="15" r="13" fill="currentColor" />
      <g clipPath={`url(#${id}-c)`} fill="none" strokeLinecap="round">
        {/* a espiral em duas cores: o sulco escuro e a faixa clara do lado */}
        <path d="M15 15m-2 0a2 2 0 1 1 4 0a5 5 0 1 1-10 0a8 8 0 1 1 16 0a11 11 0 1 1-22 0" stroke="#fff" strokeOpacity=".55" strokeWidth="2.2" />
        <path d="M15.8 15m-2 0a2 2 0 1 1 4 0a5 5 0 1 1-10 0a8 8 0 1 1 16 0a11 11 0 1 1-22 0" stroke={HOLE} strokeOpacity=".18" strokeWidth="1" />
      </g>
      <circle cx="15" cy="15" r="13" fill={`url(#${id}-g)`} />
      <circle cx="15" cy="15" r="12.6" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth=".7" />
      {/* o reflexo curvo de vidro */}
      <path d="M6.2 11.4c1.2-3.4 4-5.8 7.4-6.4" stroke="#fff" strokeOpacity=".9" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <circle cx="21.6" cy="22" r=".9" fill="#fff" fillOpacity=".6" />
    </svg>
  )
}

/**
 * O boneco de gengibre da casa da bruxa, com a cobertura branca de glacê em
 * zigue-zague e os botões. Esse tem cor própria (biscoito é biscoito); a cor
 * da camada entra só nos botões.
 */
export function Gingerbread({ className }: P) {
  const id = useId()
  const body =
    'M20 2c-4.4 0-7.6 3.2-7.6 7.4 0 2.4 1 4.4 2.6 5.8-2.6.4-5.6 1.2-9.2 2.4-3 1-3.6 4.8-.6 5.8 3 1 6.4.2 8.6-.6-.4 3.4-1 6.2-2.4 9.6L8 40.8c-1.4 3.4 2.2 5.8 4.8 3.4l7.2-7.4 7.2 7.4c2.6 2.4 6.2 0 4.8-3.4l-3.4-8.4c-1.4-3.4-2-6.2-2.4-9.6 2.2.8 5.6 1.6 8.6.6 3-1 2.4-4.8-.6-5.8-3.6-1.2-6.6-2-9.2-2.4 1.6-1.4 2.6-3.4 2.6-5.8C27.6 5.2 24.4 2 20 2z'
  return (
    <svg viewBox="0 0 40 46" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-v`} cx=".4" cy=".3" r=".8">
          <stop offset="0" stopColor="#e3a064" />
          <stop offset=".6" stopColor="#b86b35" />
          <stop offset="1" stopColor="#7a4220" />
        </radialGradient>
      </defs>
      <path d={body} fill={`url(#${id}-v)`} />
      {/* o glacê: contorno em zigue-zague nos braços e nas pernas */}
      <g fill="none" stroke="#fbf6ec" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5.4 19.6l1.2-1.4 1.2 1.4 1.2-1.4 1.2 1.4M34.6 19.6l-1.2-1.4-1.2 1.4-1.2-1.4-1.2 1.4" />
        <path d="M10.4 40.4l1.4-1 .6 1.6 1.4-1M29.6 40.4l-1.4-1-.6 1.6-1.4-1" />
        <path d="M17 12.2c1.8 1.4 4.2 1.4 6 0" />
      </g>
      <circle cx="17.6" cy="8.2" r="1.1" fill="#2a1408" />
      <circle cx="22.4" cy="8.2" r="1.1" fill="#2a1408" />
      <g fill="currentColor" stroke="#fbf6ec" strokeWidth=".5">
        <circle cx="20" cy="19.4" r="1.5" />
        <circle cx="20" cy="24" r="1.5" />
        <circle cx="20" cy="28.6" r="1.5" />
      </g>
    </svg>
  )
}

/* ─── john wick ───────────────────────────────────────────────────────────── */

/**
 * Cápsula de bala: latão em cilindro (escuro nas beiradas, um risco de luz
 * perto da esquerda), o aro saliente da base e a boca aberta escurecida. Tem
 * que ler com 8 px de largura, então é pouca peça e muito contraste.
 */
export function Casing({ className }: P) {
  const id = useId()
  return (
    <svg viewBox="0 0 10 28" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-c`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={HOLE} stopOpacity=".6" />
          <stop offset=".14" stopColor={HOLE} stopOpacity=".15" />
          <stop offset=".26" stopColor="#fff" stopOpacity=".55" />
          <stop offset=".34" stopColor="#fff" stopOpacity=".95" />
          <stop offset=".44" stopColor="#fff" stopOpacity=".2" />
          <stop offset=".62" stopColor={HOLE} stopOpacity=".05" />
          <stop offset=".85" stopColor={HOLE} stopOpacity=".35" />
          <stop offset="1" stopColor={HOLE} stopOpacity=".7" />
        </linearGradient>
      </defs>
      {/* o corpo, afinando um tico no pescoço */}
      <path d="M1.3 4.2L1 22.8h8L8.7 4.2c0-.8-.5-1.2-1.2-1.2h-5c-.7 0-1.2.4-1.2 1.2z" fill="currentColor" />
      <path d="M1.3 4.2L1 22.8h8L8.7 4.2c0-.8-.5-1.2-1.2-1.2h-5c-.7 0-1.2.4-1.2 1.2z" fill={`url(#${id}-c)`} />
      {/* o sulco da extração e o aro da base */}
      <rect x="1.2" y="22.8" width="7.6" height="1.2" fill={HOLE} fillOpacity=".55" />
      <rect x=".2" y="24" width="9.6" height="3.4" rx=".7" fill="currentColor" />
      <rect x=".2" y="24" width="9.6" height="3.4" rx=".7" fill={`url(#${id}-c)`} />
      {/* a boca aberta */}
      <ellipse cx="5" cy="3.2" rx="3.4" ry=".9" fill={HOLE} fillOpacity=".85" />
      <path d="M1.6 3.2c.8-.6 2-.9 3.4-.9s2.6.3 3.4.9" stroke="#fff" strokeOpacity=".45" strokeWidth=".4" fill="none" />
    </svg>
  )
}

/**
 * A moeda de ouro do Continental: borda chanfrada (luz em cima, sombra
 * embaixo), a inscrição em volta feita de marquinhas, e o brasão no meio em
 * relevo — escudo com a coroa por cima — mais o risco de brilho metálico.
 */
export function ContinentalCoin({ className }: P) {
  const id = useId()
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-g`} cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset=".35" stopColor="#fff" stopOpacity=".05" />
          <stop offset=".8" stopColor={HOLE} stopOpacity=".15" />
          <stop offset="1" stopColor={HOLE} stopOpacity=".45" />
        </radialGradient>
        <linearGradient id={`${id}-r`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".7" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor={HOLE} stopOpacity=".55" />
        </linearGradient>
        <linearGradient id={`${id}-i`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={HOLE} stopOpacity=".5" />
          <stop offset=".5" stopColor={HOLE} stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity=".5" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="19" fill="currentColor" />
      <circle cx="20" cy="20" r="19" fill={`url(#${id}-g)`} />
      {/* a borda chanfrada: o anel de fora pega luz em cima, o de dentro o contrário */}
      <circle cx="20" cy="20" r="18.2" fill="none" stroke={`url(#${id}-r)`} strokeWidth="1.6" />
      <circle cx="20" cy="20" r="15.6" fill="none" stroke={`url(#${id}-i)`} strokeWidth=".9" />
      {/* a inscrição: marquinhas em volta, com um ponto de separação */}
      <circle cx="20" cy="20" r="13.6" fill="none" stroke={HOLE} strokeOpacity=".4" strokeWidth="1.5" strokeDasharray=".8 1.1 1.8 1.1 .8 2.6" />
      {/* o brasão em relevo: escudo, faixa e a coroa por cima */}
      <g transform="translate(20 21)">
        <path d="M-6.4-6.6h12.8v5.2c0 4.6-3 7.4-6.4 8.6-3.4-1.2-6.4-4-6.4-8.6z" fill={HOLE} fillOpacity=".22" transform="translate(.5 .6)" />
        <path d="M-6.4-6.6h12.8v5.2c0 4.6-3 7.4-6.4 8.6-3.4-1.2-6.4-4-6.4-8.6z" fill="currentColor" stroke="#fff" strokeOpacity=".45" strokeWidth=".6" />
        <path d="M-6.4-6.6h12.8v5.2c0 4.6-3 7.4-6.4 8.6-3.4-1.2-6.4-4-6.4-8.6z" fill={`url(#${id}-g)`} />
        <path d="M-6.2-2.6L6.2 1.6" stroke={HOLE} strokeOpacity=".4" strokeWidth="1.6" />
        <path d="M-5-10.8l1.8 2.2 1.6-3 1.6 2.6 1.6-2.6 1.6 3 1.8-2.2-.8 3.6H-4.2z" fill={HOLE} fillOpacity=".38" />
      </g>
      {/* o risco de brilho do metal */}
      <path d="M8.2 11.6c2-3.2 5.2-5.4 8.8-6" stroke="#fff" strokeOpacity=".85" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  )
}
