/**
 * Barramento de áudio único (Web Audio). Roteia a música de fundo E o áudio dos
 * vídeos pelo MESMO AudioContext. Assim o celular trata tudo como um só fluxo e
 * NÃO pausa a música quando um vídeo com som toca — dá só pra abaixar o ganho
 * dela (duck) enquanto o vídeo roda, e restaurar depois.
 */

/** Volume normal da música de fundo (0–1). */
export const MUSIC_VOLUME = 0.45
/** Ganho rebaixado enquanto um vídeo em destaque toca. */
const DUCKED = 0.06

type Bus = { ctx: AudioContext; musicGain: GainNode }
let bus: Bus | null = null
/** Elementos já ligados ao barramento (createMediaElementSource só pode 1x). */
const wired = new WeakSet<HTMLMediaElement>()

/** Cria (uma vez) o contexto + ganho da música; resume no gesto do usuário. */
export function ensureBus(): Bus | null {
  if (typeof window === 'undefined') return null
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AC) return null
  if (!bus) {
    const ctx = new AC()
    const musicGain = ctx.createGain()
    musicGain.gain.value = MUSIC_VOLUME
    musicGain.connect(ctx.destination)
    bus = { ctx, musicGain }
  }
  if (bus.ctx.state === 'suspended') void bus.ctx.resume()
  return bus
}

/** Liga a música ao barramento. Retorna true se está roteada via Web Audio. */
export function connectMusic(el: HTMLAudioElement): boolean {
  const b = ensureBus()
  if (!b) return false
  if (wired.has(el)) return true
  try {
    const src = b.ctx.createMediaElementSource(el)
    src.connect(b.musicGain)
    wired.add(el)
    return true
  } catch {
    return false
  }
}

/** Liga um vídeo ao mesmo barramento (não rouba o foco da música). */
export function connectVideo(el: HTMLVideoElement): (() => void) | undefined {
  const b = ensureBus()
  if (!b || wired.has(el)) return
  try {
    const src = b.ctx.createMediaElementSource(el)
    src.connect(b.ctx.destination)
    wired.add(el)
    return () => {
      try {
        src.disconnect()
      } catch {
        /* noop */
      }
    }
  } catch {
    return
  }
}

/** Abaixa/restaura o ganho da música suavemente (sem pausar). */
export function duckMusic(active: boolean): void {
  const b = ensureBus()
  if (!b) return
  const g = b.musicGain.gain
  const now = b.ctx.currentTime
  g.cancelScheduledValues(now)
  g.setTargetAtTime(active ? DUCKED : MUSIC_VOLUME, now, 0.2)
}
