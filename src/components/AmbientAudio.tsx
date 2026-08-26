import { useEffect, useRef, useState } from 'react'

/** Playlist padrão (dentro de /public), tocada em ordem e em loop no fim. */
const TRACKS = ['/musica.mp3', '/musica2.mp3', '/musica3.mp3']
/** Se nenhuma faixa do mundo carregar (arquivo ainda não colocado), cai nessa. */
const FALLBACK = '/musica.mp3'
/** Velocidade de reprodução (mantendo o tom). */
const SPEED = 1.15
/** Volume de fundo (0–1). */
const VOLUME = 0.45
/** Volume rebaixado enquanto um vídeo em destaque toca. */
const DUCKED = 0.06
/** Evento pra abaixar/restaurar a música (disparado ao abrir/fechar vídeo). */
export const AUDIO_DUCK_EVENT = 'audio-duck'
/** Evento pra iniciar a música (disparado por um gesto disfarçado, ex.: "desce aí"). */
export const AUDIO_PLAY_EVENT = 'ambient-play'

/**
 * Trilha de fundo em playlist, própria de cada mundo. Tenta tocar assim que o
 * site abre; se o navegador bloquear o autoplay com som, entra no primeiro gesto
 * do usuário. Ao abrir um vídeo em destaque, o volume abaixa (não pausa); volta
 * ao fechar. Ao trocar de mundo, a playlist troca e recomeça na primeira faixa.
 */
export function AmbientAudio({ tracks = TRACKS }: { tracks?: string[] }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const list = tracks.length ? tracks : TRACKS
    // troca de mundo: se a faixa atual não é dessa playlist, começa da primeira
    if (!list.some((t) => audio.src.endsWith(t))) audio.src = list[0]
    audio.volume = VOLUME

    // ao acabar uma faixa, passa pra próxima; depois da última, volta pra primeira
    let idx = 0
    const onEnded = () => {
      idx = (idx + 1) % list.length
      audio.src = list[idx]
      audio.play().catch(() => {})
    }
    audio.addEventListener('ended', onEnded)

    // faixa que não carrega (arquivo ainda não colocado em public/) não pode
    // deixar o site mudo: pula pra próxima e, se todas falharem, usa a padrão
    let failures = 0
    const onError = () => {
      failures++
      if (failures > list.length) {
        if (!audio.src.endsWith(FALLBACK)) {
          audio.src = FALLBACK
          audio.play().catch(() => {})
        }
        return
      }
      onEnded()
    }
    audio.addEventListener('error', onError)

    const start = () => {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false))
    }
    start()

    // insiste em cada gesto até o play REALMENTE começar (no Android um scroll
    // passivo às vezes não libera o som; só solta os listeners quando tocar)
    const events = ['pointerdown', 'touchend', 'click', 'keydown', 'scroll', 'wheel'] as const
    const removeGestureListeners = () =>
      events.forEach((ev) => window.removeEventListener(ev, onGesture))
    const onGesture = () => {
      if (!audio.paused) {
        removeGestureListeners()
        return
      }
      audio
        .play()
        .then(() => {
          audio.playbackRate = SPEED
          setPlaying(true)
          removeGestureListeners()
        })
        .catch(() => {})
    }
    events.forEach((ev) => window.addEventListener(ev, onGesture, { passive: true }))

    const onPlay = () => {
      audio.playbackRate = SPEED // reafirma a cada faixa (o src novo reseta)
      setPlaying(true)
    }
    const onPause = () => setPlaying(false)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    // duck: abaixa/restaura o volume suavemente quando um vídeo abre/fecha
    let fadeRaf = 0
    const fadeTo = (target: number) => {
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
      fadeTo(active ? DUCKED : VOLUME)
    }
    window.addEventListener(AUDIO_DUCK_EVENT, onDuck)

    // pedido explícito de play (vindo de um gesto disfarçado, ex.: o "desce aí")
    const onPlayRequest = () => {
      if (audio.paused) start()
    }
    window.addEventListener(AUDIO_PLAY_EVENT, onPlayRequest)

    return () => {
      removeGestureListeners()
      cancelAnimationFrame(fadeRaf)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      window.removeEventListener(AUDIO_DUCK_EVENT, onDuck)
      window.removeEventListener(AUDIO_PLAY_EVENT, onPlayRequest)
    }
  }, [tracks])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) audio.play().catch(() => {})
    else audio.pause()
  }

  return (
    <>
      <audio ref={audioRef} preload="none" />
      <button
        onClick={toggle}
        aria-label={playing ? 'Pausar música' : 'Tocar música'}
        title={playing ? 'Pausar música' : 'Tocar música'}
        className="group fixed bottom-5 right-5 z-[60] flex h-10 w-10 items-center justify-center rounded-full border border-ember/25 bg-night-soft/70 text-mist backdrop-blur-sm transition-colors hover:border-ember/50 hover:text-star"
      >
        {playing ? (
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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
            <path d="M17 9l4 6M21 9l-4 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </>
  )
}
