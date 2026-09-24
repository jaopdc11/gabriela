import { useId } from 'react'

/**
 * O lado do Homem de Ferro no clima de Guerra Civil (o escudo do Capitão é o
 * outro lado, em `marvel.tsx`). Tudo desenhado pra direita, pra onde ele voa e
 * atira; o motor espelha quem vai pra esquerda.
 */

type P = { className?: string }

/**
 * O Homem de Ferro voando de lado, de barriga pra baixo como no filme: capacete
 * na frente com os olhos acesos, um braço esticado com a palma aberta (repulsor
 * aceso), o outro colado no corpo, e as botas soltando o jato azul-branco pra
 * trás. Armadura vermelha e dourada, com luz de cima e reflexo.
 */
export function IronManFlying({ className }: P) {
  const id = useId()
  const red = `url(#${id}-red)`
  const gold = `url(#${id}-gold)`
  return (
    <svg viewBox="0 0 160 60" overflow="visible" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-red`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#e0343c" />
          <stop offset=".45" stopColor="#b3171f" />
          <stop offset="1" stopColor="#5e0a10" />
        </linearGradient>
        <linearGradient id={`${id}-gold`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset=".5" stopColor="#d9a441" />
          <stop offset="1" stopColor="#8a5f22" />
        </linearGradient>
        {/* o jato: branco colado na bota, azul, e some pra trás */}
        <linearGradient id={`${id}-jet`} x1="1" x2="0" y1="0" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
          <stop offset=".18" stopColor="#bfe8ff" stopOpacity=".9" />
          <stop offset=".55" stopColor="#5fb4ff" stopOpacity=".45" />
          <stop offset="1" stopColor="#2f7cff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".35" stopColor="#c9f0ff" stopOpacity=".9" />
          <stop offset="1" stopColor="#6fd0ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* os jatos, um de cada bota */}
      <path d="M51 24.4L6 20c5 4 5 8 0 11l45-2.4z" fill={`url(#${id}-jet)`} opacity=".8" />
      <path d="M50 29.4L2 26.5c6 4 6 9 0 13L50 35z" fill={`url(#${id}-jet)`} />
      <ellipse cx="51" cy="26.8" rx="3" ry="3.4" fill={`url(#${id}-glow)`} />
      <ellipse cx="50" cy="32.2" rx="3.6" ry="4" fill={`url(#${id}-glow)`} />

      {/* a perna de trás, mais escura e um pouco acima */}
      <path d="M97 23.6c-8-.4-16-.4-22 0l-17 .6v5l17 .4c7 .2 15 .6 22 1.4z" fill={red} opacity=".75" />
      <path d="M58 24.1h-6.4c-.8 0-1.2.6-1.2 1.4v2.6c0 .8.4 1.4 1.2 1.4H58z" fill="#7a0d14" />
      <path d="M58 24.1h3v5h-3z" fill={gold} opacity=".8" />
      <path d="M74 23.9c2-.8 4-.8 5.6 0v5.8c-1.6.6-3.6.6-5.6 0z" fill={gold} opacity=".75" />

      {/* a perna da frente: coxa larga afinando até o tornozelo, bota, joelheira */}
      <path d="M98 27c-8 .2-16 .6-23 1.4-6 .6-11 .8-16 .8v5.4c5 0 10 .2 16 .8 7 .8 15 1.6 23 2.4z" fill={red} />
      <path d="M59 29.2h-7.8c-1 0-1.6.7-1.6 1.6v3c0 .9.6 1.6 1.6 1.6H59z" fill="#8e1018" />
      <path d="M59 29.2h3.2v6.2H59z" fill={gold} />
      <path d="M73.6 28.6c2.4-1 5-1 7 0v7c-2 .8-4.6.8-7 0z" fill={gold} />
      <path d="M77 29.2v5.8" stroke="#6b4518" strokeWidth=".5" opacity=".7" />
      {/* as emendas da armadura */}
      <path d="M88 28v8.2M66 29.4v5.4" stroke="#3a0a0e" strokeWidth=".6" opacity=".6" />

      {/* tronco: peito mais fundo, costas retas */}
      <path d="M96 25.5c8-2.6 18-3.4 26-2.4 3 .4 5 2.6 5 5.4v5.6c0 2.6-2 4.4-5 4.8-9 1-19 .2-26-2z" fill={red} />
      {/* cintura e abdômen dourados */}
      <path d="M96 26.4c3-.8 6-1.2 9-1.3l.5 11.2c-3.2-.1-6.5-.6-9.5-1.4z" fill={gold} />
      <path d="M99 26v10M102 25.6v10.6" stroke="#6b4518" strokeWidth=".5" opacity=".6" />

      {/* o braço de trás, colado no corpo */}
      <path d="M118 26.5c-6 .2-13 .8-18 1.8-1.4.3-1.6 2.4-.2 2.7 5 1 12 1.2 18 .8z" fill={red} opacity=".85" />
      <path d="M99.5 27.4c-2 .3-3 1.4-2.8 2.4.2 1 1.4 1.6 3 1.2z" fill={gold} />

      {/* o reator no peito, virado pra baixo — só a luz vazando por baixo */}
      <ellipse cx="116" cy="38.4" rx="5" ry="2.6" fill={`url(#${id}-glow)`} />
      <ellipse cx="116" cy="37.8" rx="2.2" ry="1" fill="#ffffff" />

      {/* ombro */}
      <path d="M116 23.6c3-1.4 7-1.2 9 .6 1.4 1.4 1 3.8-1 4.6-3 1.2-7 .8-9-.8-1.2-1.2-.6-3.4 1-4.4z" fill={red} />

      {/* o braço da frente, esticado, com a palma aberta */}
      <path d="M122 28.6l18 3.4c1.6.3 2 2.6.4 3.1l-18.6 1.2c-2 .1-3-1.2-2.6-2.8z" fill={red} />
      <path d="M131 30.6l8.4 1.6-.4 2.8-8.6.5z" fill={gold} />
      {/* a mão aberta, dedos pra baixo */}
      <path d="M140.2 30.4c2.2-.2 4 .8 4.6 2.6.5 1.6-.3 3.4-2 4l.4 2.6-1.4.2-.6-2.4-1 .2.2 2.6-1.4 0-.4-2.8c-1.4-.6-2-2.2-1.6-3.6.3-1.6 1.4-3.2 3.2-3.4z" fill={red} />
      <circle cx="145.4" cy="33.4" r="5.5" fill={`url(#${id}-glow)`} />
      <circle cx="145" cy="33.4" r="1.5" fill="#ffffff" />

      {/* o capacete: vermelho em cima, a máscara dourada na frente */}
      <path d="M126 22.6c1.2-3.6 5-6 9.4-5.6 4.4.4 7.4 3.6 7.6 7.6.2 3.4-1.4 6.2-4 7.4-3.4 1.6-8 1.4-11-.4-2.4-1.4-3.2-5.2-2-9z" fill={red} />
      <path d="M135.2 17.4c3.6.4 6.4 3.2 6.8 6.8.3 3-1 5.8-3.4 7-2 1-4.4 1.2-6.2.6l.6-5.6c.2-2.4 1-4.4 2.2-6z" fill={gold} />
      {/* o olho aceso */}
      <path d="M136.6 22.8l4.6-.4c.4 0 .6.6.2.8l-4.6 1.4c-.6.2-1-.8-.2-1.8z" fill="#eafaff" />
      <path d="M136 22.4l6-.6" stroke="#9fe4ff" strokeWidth="2.2" strokeLinecap="round" opacity=".35" />
      {/* a boca, a linha do queixo */}
      <path d="M137.8 28.4l3.2-.6" stroke="#6b4518" strokeWidth=".6" strokeLinecap="round" />

      {/* luz de cima nas costas e no capacete */}
      <path
        d="M60 29.6c8-.6 20-1.4 36-2.2M98 25.2c9-2.4 18-3 25-2M128 21c1.4-2.4 4.2-3.6 7-3.4"
        stroke="#ffb3a8"
        strokeWidth=".8"
        strokeLinecap="round"
        fill="none"
        opacity=".7"
      />
    </svg>
  )
}

/**
 * O disparo do repulsor: o anel de choque na boca, o feixe com o miolo branco
 * e o halo na cor da camada, e faíscas soltando. Sai da esquerda e vai pra
 * direita.
 */
export function RepulsorBlast({ className }: P) {
  const id = useId()
  return (
    <svg viewBox="0 0 160 40" overflow="visible" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-beam`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity=".9" />
          <stop offset=".7" stopColor="currentColor" stopOpacity=".55" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-core`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".8" stopColor="#ffffff" stopOpacity=".8" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-mouth`}>
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".4" stopColor="currentColor" stopOpacity=".8" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* halo largo, feixe e miolo */}
      <path d="M10 20c20-9 60-10 150-4v8c-90 6-130 5-150-4z" fill={`url(#${id}-beam)`} opacity=".35" />
      <path d="M10 20c20-5 60-5 150-2v4c-90 3-130 3-150-2z" fill={`url(#${id}-beam)`} />
      <path d="M12 20c20-2 60-2 146-.8v1.6C72 22 32 22 12 20z" fill={`url(#${id}-core)`} />
      {/* a boca do disparo e o anel de choque */}
      <circle cx="12" cy="20" r="12" fill={`url(#${id}-mouth)`} />
      <ellipse cx="22" cy="20" rx="3" ry="11" fill="none" stroke="currentColor" strokeWidth="1.4" opacity=".7" />
      <ellipse cx="34" cy="20" rx="2.4" ry="8" fill="none" stroke="currentColor" strokeWidth="1" opacity=".45" />
      <circle cx="12" cy="20" r="3.4" fill="#ffffff" />
      {/* faíscas */}
      <g stroke="#ffffff" strokeWidth=".9" strokeLinecap="round" opacity=".85">
        <path d="M40 12l6-3M56 28l7 3M72 11l5-2M90 29l6 2M30 29l4 3M104 12l5-2" />
      </g>
      <g fill="currentColor">
        <circle cx="48" cy="8" r=".9" />
        <circle cx="64" cy="32" r="1" />
        <circle cx="96" cy="32" r=".8" />
        <circle cx="112" cy="9" r=".8" />
      </g>
    </svg>
  )
}

/**
 * O clarão redondo do reator/repulsor, pra piscar: miolo branco, anéis e o
 * raio de luz em volta. O halo segue a cor da camada.
 */
export function ArcReactorFlash({ className }: P) {
  const id = useId()
  const rays = Array.from({ length: 16 }, (_, i) => i * 22.5)
  return (
    <svg viewBox="0 0 100 100" overflow="visible" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-g`}>
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".22" stopColor="#e6f8ff" />
          <stop offset=".45" stopColor="currentColor" stopOpacity=".55" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-ray`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="1" stopColor="#ffffff" stopOpacity=".8" />
        </linearGradient>
      </defs>
      {/* os raios de luz, compridos e curtos alternando */}
      {rays.map((a, i) => (
        <polygon
          key={a}
          points={i % 2 ? '50,22 51,40 49,40' : '50,4 51.6,40 48.4,40'}
          fill={`url(#${id}-ray)`}
          transform={`rotate(${a} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="30" fill={`url(#${id}-g)`} />
      {/* os anéis do reator */}
      <circle cx="50" cy="50" r="13" fill="none" stroke="#ffffff" strokeWidth="1.4" opacity=".9" />
      <circle cx="50" cy="50" r="9" fill="none" stroke="currentColor" strokeWidth="2.6" strokeDasharray="2.2 1.3" />
      <circle cx="50" cy="50" r="17.5" fill="none" stroke="currentColor" strokeWidth=".8" opacity=".6" />
      <circle cx="50" cy="50" r="5" fill="#ffffff" />
    </svg>
  )
}
