import { useId } from 'react'

/**
 * A faca do Ghostface: a Buck 120 de caça. Lâmina longa com a ponta em clip
 * (o dorso desce em curva até a ponta e o fio sobe em barriga), a canaleta no
 * meio, o bisel do fio mais claro, guarda preta, cabo preto e o pomo de
 * alumínio. Ponta pra direita. O metal e o cabo têm cor própria; o fio de luz
 * no gume obedece a cor da camada. Um fio de sangue bem discreto perto da ponta.
 */
export function Knife({ className }: { className?: string }) {
  const id = useId()
  const blade = 'M43 9.5L84 9.5C95 12.5 107 13.8 119 12.6C115 18.5 104 22 88 22L43 22Z'
  return (
    <svg viewBox="0 0 120 30" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-m`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f2f4f7" />
          <stop offset=".45" stopColor="#aab2bc" />
          <stop offset=".62" stopColor="#7d8691" />
          <stop offset="1" stopColor="#d6dbe1" />
        </linearGradient>
        <linearGradient id={`${id}-b`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#c9d0d8" />
          <stop offset="1" stopColor="#f7f9fb" />
        </linearGradient>
        <linearGradient id={`${id}-r`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-h`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#3a3b44" />
          <stop offset=".35" stopColor="#1a1b21" />
          <stop offset="1" stopColor="#060609" />
        </linearGradient>
        <linearGradient id={`${id}-p`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f0f2f5" />
          <stop offset=".5" stopColor="#9aa2ab" />
          <stop offset="1" stopColor="#c7ccd2" />
        </linearGradient>
        <clipPath id={`${id}-c`}>
          <path d={blade} />
        </clipPath>
      </defs>

      {/* pomo de alumínio */}
      <path d="M10 9.6H5.5C3 9.6 1.5 12 1.5 15.5S3 21.4 5.5 21.4H10z" fill={`url(#${id}-p)`} stroke="#5c636d" strokeWidth=".5" />
      {/* cabo preto, afinando pra guarda, com borda pra não sumir no escuro */}
      <path
        d="M9.5 10.2C18 9.6 30 10.4 40.5 11.4V19.8C30 20.8 18 21.4 9.5 20.8z"
        fill={`url(#${id}-h)`}
        stroke="#3a3f52"
        strokeWidth=".6"
      />
      <path d="M11 11.6C20 11.2 30 11.8 39.5 12.6" stroke="#fff" strokeOpacity=".18" strokeWidth=".8" fill="none" />
      {/* os aros do cabo */}
      <path d="M17 10.1v10.8M24 10.2v10.8M31 10.6v10.1" stroke="#000" strokeOpacity=".55" strokeWidth=".7" />
      <path d="M17.6 10.1v10.8M24.6 10.2v10.8M31.6 10.6v10.1" stroke="#fff" strokeOpacity=".08" strokeWidth=".5" />

      {/* a lâmina */}
      <path d={blade} fill={`url(#${id}-m)`} />
      <g clipPath={`url(#${id}-c)`}>
        {/* o bisel do fio, mais claro, subindo junto com a barriga */}
        <path d="M43 17.6L86 17.8C99 17.8 111 16 119 12.6L121 23H43z" fill={`url(#${id}-b)`} opacity=".9" />
        {/* reflexo correndo pela lâmina */}
        <path d="M58 9L66 9 54 23 46 23z" fill={`url(#${id}-r)`} opacity=".55" />
        <path d="M84 9L88 9 80 23 76 23z" fill={`url(#${id}-r)`} opacity=".35" />
        {/* a canaleta */}
        <rect x="50" y="11.6" width="31" height="2.2" rx="1.1" fill="#6b737d" />
        <path d="M51.2 13.6H80" stroke="#fff" strokeOpacity=".6" strokeWidth=".45" />
        {/* fio de sangue, discreto, escorrendo do gume perto da ponta */}
        <path d="M101 21.2C104.5 20.6 108.5 19.4 112 17.4 110.5 19.2 108 20.6 104.5 21.6c-.2 1-.6 1.6-.9 1.6s-.5-.7-.6-2z" fill="#7a0d12" opacity=".55" />
      </g>
      {/* contorno fino e o fio de luz no gume */}
      <path d={blade} fill="none" stroke="#4d545d" strokeWidth=".5" />
      <path d="M44 21.7L88 21.7C103 21.7 114 18.3 118.6 13" stroke="currentColor" strokeOpacity=".85" strokeWidth=".6" fill="none" strokeLinecap="round" />
      <path d="M44 9.8L84 9.8C95 12.8 107 14 118 12.9" stroke="#fff" strokeOpacity=".7" strokeWidth=".4" fill="none" />

      {/* guarda preta, por cima da junção */}
      <rect x="39.8" y="4.2" width="3.8" height="21.6" rx="1.4" fill={`url(#${id}-h)`} stroke="#4a5063" strokeWidth=".6" />
      <path d="M40.8 5.6v18.8" stroke="#fff" strokeOpacity=".22" strokeWidth=".6" />
    </svg>
  )
}
