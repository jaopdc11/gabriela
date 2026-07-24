import { useEffect, useRef, useState } from 'react'
import { connectMusic, duckMusic, MUSIC_VOLUME } from '../audioBus'

/** Playlist de fundo (dentro de /public), tocada em ordem e em loop no fim. */
const TRACKS = ['/musica.mp3', '/musica2.mp3', '/musica3.mp3']
/** Volume rebaixado (fallback sem Web Audio) enquanto um vídeo toca. */
const DUCKED_VOLUME = 0.06
/** Evento pra abaixar/restaurar a música (disparado ao abrir/fechar vídeo). */
export const AUDIO_DUCK_EVENT = 'audio-duck'

/**
 * Trilha de fundo em playlist. Tenta tocar assim que o site abre; se o navegador
 * bloquear o autoplay com som (quase sempre bloqueia), a música entra sozinha no
 * primeiro gesto do usuário. O áudio é roteado por um AudioContext único (ver
 * audioBus) pra que o som dos vídeos NÃO pause a música — só abaixe o volume dela.
 * Um botão discreto no canto permite pausar/retomar.
 */
export function AmbientAudio() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (!audio.src) audio.src = TRACKS[0]

    // liga ao barramento Web Audio; se rolar, o ganho fica com o bus (volume=1)
    const usingBus = connectMusic(audio)
    audio.volume = usingBus ? 1 : MUSIC_VOLUME

    // ao acabar uma faixa, passa pra próxima; depois da última, volta pra primeira
    let idx = 0
    const onEnded = () => {
      idx = (idx + 1) % TRACKS.length
      audio.src = TRACKS[idx]
      audio.play().catch(() => {})
    }
    audio.addEventListener('ended', onEnded)

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

    // duck: com Web Audio, abaixa o ganho (sem pausar). Sem Web Audio, fallback
    // suave no volume do elemento.
    let fadeRaf = 0
    const fadeVolumeTo = (target: number) => {
      cancelAnimationFrame(fadeRaf)
      const step = () => {
        const diff = target - audio.volume
        if (Math.abs(diff) < 0.01) {
          audio.volume = target
          return
        }
        audio.volume = Math.min(1, Math.max(0, audio.volume + diff * 0.15))
        fadeRaf = requestAnimationFrame(step)
      }
      step()
    }
    const onDuck = (e: Event) => {
      const active = !!(e as CustomEvent<{ active: boolean }>).detail?.active
      if (usingBus) duckMusic(active)
      else fadeVolumeTo(active ? DUCKED_VOLUME : MUSIC_VOLUME)
    }
    window.addEventListener(AUDIO_DUCK_EVENT, onDuck)

    return () => {
      removeGestureListeners()
      cancelAnimationFrame(fadeRaf)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      window.removeEventListener(AUDIO_DUCK_EVENT, onDuck)
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
      {/* preload="none": não baixa nada na abertura; o play() no primeiro gesto
          dispara o download da faixa atual. Ordem/loop no efeito (evento 'ended'). */}
      <audio ref={audioRef} preload="none" />
      <button
        onClick={toggle}
        aria-label={playing ? 'Pausar música' : 'Tocar música'}
        title={playing ? 'Pausar música' : 'Tocar música'}
        className="group fixed bottom-5 right-5 z-[60] flex h-10 w-10 items-center justify-center rounded-full border border-ember/25 bg-night-soft/70 text-mist backdrop-blur-sm transition-colors hover:border-ember/50 hover:text-star"
      >
        {playing ? (
          // som ligado: ondinhas
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
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
