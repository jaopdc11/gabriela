import { useEffect, useRef, useState } from 'react'

/** Nome do arquivo de música dentro de /public. */
const TRACK_SRC = '/musica.mp3'
/** Volume de fundo (0–1), suave pra não competir com a leitura. */
const VOLUME = 0.45

/**
 * Trilha de fundo em loop. Tenta tocar assim que o site abre; se o navegador
 * bloquear o autoplay com som (quase sempre bloqueia), a música entra sozinha
 * no primeiro gesto do usuário (toque, clique, tecla ou rolagem). Um botão
 * discreto no canto permite pausar/retomar a qualquer momento.
 */
export function AmbientAudio() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = VOLUME

    const start = () => {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false))
    }

    // 1) tenta tocar de cara (funciona em alguns navegadores/PWA)
    start()

    // 2) se o autoplay foi barrado, começa no primeiro gesto
    const onFirstGesture = () => {
      if (audio.paused) start()
      removeGestureListeners()
    }
    const events = ['pointerdown', 'keydown', 'touchstart', 'scroll', 'wheel'] as const
    const removeGestureListeners = () =>
      events.forEach((ev) => window.removeEventListener(ev, onFirstGesture))
    events.forEach((ev) => window.addEventListener(ev, onFirstGesture, { once: false, passive: true }))

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      removeGestureListeners()
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) audio.play().catch(() => {})
    else audio.pause()
  }

  return (
    <>
      <audio ref={audioRef} src={TRACK_SRC} loop preload="auto" />
      <button
        onClick={toggle}
        aria-label={playing ? 'Pausar música' : 'Tocar música'}
        title={playing ? 'Pausar música' : 'Tocar música'}
        className="group fixed bottom-5 right-5 z-[60] flex h-10 w-10 items-center justify-center rounded-full border border-ember/25 bg-night-soft/70 text-mist backdrop-blur-sm transition-colors hover:border-ember/50 hover:text-star"
      >
        {playing ? (
          // som ligado: ondinhas
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 9v6h4l5 4V5L8 9H4z"
              fill="currentColor"
            />
            <path
              d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <animate attributeName="opacity" values="0.5;1;0.5" dur="2.4s" repeatCount="indefinite" />
            </path>
          </svg>
        ) : (
          // som pausado/mudo: alto-falante cortado
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
            <path d="M17 9l4 6M21 9l-4 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </>
  )
}
