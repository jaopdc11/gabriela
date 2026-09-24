import { useId } from 'react'

/**
 * Desenhos do clima do Diário de uma Paixão (cisne e chuva), do Ela Dança, Eu
 * Danço (holofote e poeira de palco) e da La Casa de Papel (a nota de 50 euros).
 * Mesma regra dos outros: pinta com `currentColor`, o que é vazado vai na cor
 * do fundo, e o traço que faz reconhecer vem antes de qualquer enfeite.
 */

/** A cor do fundo da ficha aberta: o que é vazado no desenho. */
const HOLE = '#04050b'

/* ─── diário de uma paixão ────────────────────────────────────────────────── */

/**
 * O cisne do lago, de perfil, nadando pra direita: pescoço em S, as asas meio
 * erguidas em concha com as penas marcadas, o bico laranja com a mancha preta
 * na base, e o reflexo ondulando na água embaixo.
 */
export function Swan({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 100 64" className={className} aria-hidden>
      <defs>
        {/* sombra da barriga: o volume vem de baixo pra cima */}
        <linearGradient id={`${id}-b`} x1="0" x2="0" y1="0" y2="1">
          <stop offset=".45" stopColor={HOLE} stopOpacity="0" />
          <stop offset="1" stopColor={HOLE} stopOpacity=".35" />
        </linearGradient>
        <linearGradient id={`${id}-r`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity=".22" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* o reflexo: o corpo borrado de cabeça pra baixo e as ondinhas */}
      <path d="M12 51c8 5 24 7 40 6 10-1 16-3 16-6z" fill={`url(#${id}-r)`} />
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <path d="M6 52.5q4-1.6 8 0t8 0 8 0 8 0 8 0 8 0 8 0 8 0 8 0" strokeWidth=".8" strokeOpacity=".45" />
        <path d="M16 56q4-1.2 8 0t8 0 8 0 8 0 8 0 8 0" strokeWidth=".6" strokeOpacity=".28" />
        <path d="M28 59.5q4-1 8 0t8 0 8 0" strokeWidth=".5" strokeOpacity=".16" />
      </g>

      {/* o corpo */}
      <path
        d="M9 40c-2-6 1-12 6-11 3 .6 5 2 8 1 10-4 24-6 36-3 7 2 11 6 12 12 1 6-5 11-17 12-15 1-31 0-39-4-3-2-5-4-6-7z"
        fill="currentColor"
      />
      <path
        d="M9 40c-2-6 1-12 6-11 3 .6 5 2 8 1 10-4 24-6 36-3 7 2 11 6 12 12 1 6-5 11-17 12-15 1-31 0-39-4-3-2-5-4-6-7z"
        fill={`url(#${id}-b)`}
      />

      {/* a asa erguida em concha, com as penas em camadas */}
      <path
        d="M20 33c2-10 12-17 26-17 9 0 15 3 18 8-5-1-9 0-12 2-5-2-11-2-16 0-5 1-10 4-16 7z"
        fill="currentColor"
      />
      <g fill="none" stroke={HOLE} strokeOpacity=".22" strokeWidth=".7" strokeLinecap="round">
        <path d="M24 30c4-6 10-10 18-11" />
        <path d="M27 31c4-4 9-7 16-8" />
        <path d="M31 30.5c4-2.6 9-4 14-4" />
        <path d="M44 20.5c4 0 9 1.5 12 4M42 23.5c4 0 8 1 11 3" />
      </g>
      {/* as pontas das penas da cauda, levantadas */}
      <path d="M9 36c-2-3-2-6 0-8 1 2 2 3 4 3-1-2-1-4 1-6 1 3 3 4 5 4" fill="currentColor" />

      {/* o pescoço em S e a cabeça */}
      <path
        d="M63 37c-7-6-9-14-4-21 3-5 9-8 15-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="5.4"
        strokeLinecap="round"
      />
      <ellipse cx="76" cy="8.4" rx="5.4" ry="4" fill="currentColor" />
      {/* o bico laranja, a mancha preta na base e o olho dentro dela */}
      <path d="M79.6 6.6 91 10.4 80.4 12z" fill="#e8752a" />
      <path d="M89 9.7 91 10.4 89.2 11z" fill="#1a1a1a" />
      <path d="M78 5.6c2-.8 3.8.1 3.6 2l-.4 3.2-3.4-1.6z" fill="#1a1a1a" />
      <circle cx="78.9" cy="7.2" r=".55" fill="#f5f1e8" />
    </svg>
  )
}

/**
 * Um fio de chuva: some em cima, acende embaixo e termina numa gotinha — é o
 * degradê que faz parecer que está caindo rápido. Continua fino (2–3px).
 */
export function RainDrop({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 4 60" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset=".7" stopColor="currentColor" stopOpacity=".55" />
          <stop offset="1" stopColor="currentColor" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path d="M3.3 0 1.9 55c-.3 2.6 2.3 2.8 2-.2L3.5 0z" fill={`url(#${id}-g)`} />
      {/* o brilho na cabeça da gota */}
      <circle cx="2.8" cy="56.4" r=".55" fill="#fff" fillOpacity=".7" />
    </svg>
  )
}

/* ─── ela dança, eu danço ─────────────────────────────────────────────────── */

/** Onde a poeira boia dentro do facho (x, y, raio, opacidade), fixa. */
const MOTES: [number, number, number, number][] = [
  [48, 60, 1.1, 0.7],
  [55, 95, 0.8, 0.5],
  [42, 130, 1.4, 0.6],
  [60, 150, 0.9, 0.45],
  [36, 185, 1.2, 0.5],
  [52, 205, 1.6, 0.55],
  [66, 235, 1, 0.4],
  [30, 250, 0.9, 0.35],
  [47, 272, 1.3, 0.4],
  [70, 290, 1.1, 0.3],
  [25, 310, 1.4, 0.28],
  [58, 330, 1, 0.25],
]

/**
 * O facho do holofote: o refletor lá em cima, a luz saindo estreita e abrindo,
 * com o miolo mais claro que as bordas (que vão sumindo pros lados) e a poeira
 * brilhando dentro. Vai apagando pra baixo por uma máscara.
 */
export function Spotlight({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 100 400" preserveAspectRatio="none" className={className} aria-hidden>
      <defs>
        {/* de lado: borda some, miolo acende */}
        <linearGradient id={`${id}-h`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset=".3" stopColor="currentColor" stopOpacity=".35" />
          <stop offset=".5" stopColor="currentColor" stopOpacity=".6" />
          <stop offset=".7" stopColor="currentColor" stopOpacity=".35" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
        {/* de cima pra baixo: forte perto do refletor, sumindo no chão */}
        <linearGradient id={`${id}-v`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".45" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${id}-m`}>
          <rect width="100" height="400" fill={`url(#${id}-v)`} />
        </mask>
        <radialGradient id={`${id}-l`}>
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset=".4" stopColor="currentColor" stopOpacity=".7" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g mask={`url(#${id}-m)`}>
        <polygon points="43,10 57,10 100,400 0,400" fill={`url(#${id}-h)`} />
        {/* o miolo, mais estreito e mais claro */}
        <polygon points="47.5,10 52.5,10 70,400 30,400" fill="currentColor" fillOpacity=".22" />
        <g fill="currentColor">
          {MOTES.map(([x, y, r, o]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fillOpacity={o} />
          ))}
        </g>
      </g>

      {/* o refletor: a lata escura e a lente acesa, com o clarão em volta */}
      <ellipse cx="50" cy="11" rx="16" ry="7" fill={`url(#${id}-l)`} />
      <path d="M41 0h18l-2 8H43z" fill="#2b2f3a" />
      <path d="M41 0h18" stroke="#4a5060" strokeWidth="1.2" />
      <ellipse cx="50" cy="8.6" rx="7.2" ry="2" fill="#fff" />
    </svg>
  )
}

/**
 * Um pontinho de luz — poeira de palco, faísca do Estranho: o miolo acende e
 * a borda some, pra não parecer bolinha chapada.
 */
export function Dot({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 10 10" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-g`}>
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset=".35" stopColor="currentColor" stopOpacity="1" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="5" cy="5" r="5" fill={`url(#${id}-g)`} />
    </svg>
  )
}

/* ─── la casa de papel ────────────────────────────────────────────────────── */

/** As linhas finas de guilhochê que enchem o fundo da nota, geradas uma vez. */
const GUILLOCHE = Array.from({ length: 8 }, (_, k) => {
  const y0 = 5.5 + k * 4.4
  const amp = 1.3 + 0.35 * (k % 3)
  const pts: string[] = []
  for (let x = 3; x <= 77; x += 1) pts.push(`${x} ${(y0 + amp * Math.sin(x / 3.1 + k * 0.9)).toFixed(2)}`)
  return 'M' + pts.join('L')
}).join('')

/** As doze estrelas da bandeira da UE, em círculo. */
const EU_STARS = Array.from({ length: 12 }, (_, i) => {
  const a = -Math.PI / 2 + (i * Math.PI) / 6
  return [8.5 + 3.4 * Math.cos(a), 8 + 3.4 * Math.sin(a)] as const
})

/**
 * A nota de 50 euros que eles imprimem na casa da moeda. O que faz ser euro e
 * não dinheiro qualquer: o arco românico no meio (as notas de euro são janelas
 * e portais), a bandeirinha da UE no canto, a faixa holográfica prateada, o
 * "50" grande e o "€". Tudo por cima de um fundo de guilhochê fino.
 */
export function EuroNote({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 80 42" className={className} aria-hidden>
      <defs>
        {/* luz de cima: papel tem volume, não é cartão chapado */}
        <linearGradient id={`${id}-p`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".18" />
          <stop offset="1" stopColor={HOLE} stopOpacity=".18" />
        </linearGradient>
        <linearGradient id={`${id}-holo`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f4f4f8" />
          <stop offset=".3" stopColor="#a9b0c0" />
          <stop offset=".5" stopColor="#e9dcf5" />
          <stop offset=".7" stopColor="#9fb8c9" />
          <stop offset="1" stopColor="#f4f4f8" />
        </linearGradient>
        <clipPath id={`${id}-c`}>
          <rect x="1" y="1" width="78" height="40" rx="2.5" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id}-c)`}>
        <rect x="1" y="1" width="78" height="40" fill="currentColor" />
        <rect x="1" y="1" width="78" height="40" fill={`url(#${id}-p)`} />
        <path d={GUILLOCHE} fill="none" stroke={HOLE} strokeOpacity=".13" strokeWidth=".35" />

        {/* o arco românico, com as colunas e a janela escura no fundo */}
        <g stroke={HOLE} strokeOpacity=".38" fill="none" strokeWidth=".9">
          <path d="M30 36V22a9 9 0 0 1 18 0v14" />
          <path d="M32.6 36V22.5a6.4 6.4 0 0 1 12.8 0V36" />
          <path d="M28 36h22M29 22h1.5M47.5 22H49" />
        </g>
        <path d="M32.6 36V22.5a6.4 6.4 0 0 1 12.8 0V36z" fill={HOLE} fillOpacity=".16" />

        {/* a faixa holográfica */}
        <rect x="56" y="1" width="6" height="40" fill={`url(#${id}-holo)`} opacity=".9" />
        <text
          x="59"
          y="24"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="5"
          fontWeight="bold"
          fill={HOLE}
          fillOpacity=".35"
        >
          €
        </text>

        {/* a bandeira da UE no canto */}
        <rect x="3" y="3" width="11" height="10" rx="1" fill="#2c4aa0" />
        <g fill="#ffd24a">
          {EU_STARS.map(([x, y]) => (
            <circle key={`${x.toFixed(2)}-${y.toFixed(2)}`} cx={x} cy={y} r=".55" />
          ))}
        </g>

        {/* o 50 grande e o €, na cor escura da nota */}
        <text
          x="70.5"
          y="36"
          textAnchor="middle"
          fontFamily="system-ui, 'Helvetica Neue', Arial, sans-serif"
          fontSize="13"
          fontWeight="800"
          fill="#5a2a10"
          fillOpacity=".75"
        >
          50
        </text>
        <text
          x="7"
          y="36"
          fontFamily="system-ui, 'Helvetica Neue', Arial, sans-serif"
          fontSize="6"
          fontWeight="800"
          fill="#5a2a10"
          fillOpacity=".7"
        >
          50
        </text>
        <text
          x="19"
          y="13"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="8"
          fontWeight="bold"
          fill="#5a2a10"
          fillOpacity=".6"
        >
          €
        </text>
        <text
          x="3.5"
          y="39.6"
          fontFamily="system-ui, 'Helvetica Neue', Arial, sans-serif"
          fontSize="2.6"
          letterSpacing=".4"
          fill="#5a2a10"
          fillOpacity=".55"
        >
          EURO ΕΥΡΩ
        </text>
      </g>
      <rect x="1" y="1" width="78" height="40" rx="2.5" fill="none" stroke="#5a2a10" strokeOpacity=".35" strokeWidth=".6" />
    </svg>
  )
}
