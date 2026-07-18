import type { Elapsed } from '../useElapsed'

const pad = (n: number) => n.toString().padStart(2, '0')

/** Contador estilo timecode de cinema: calendário + relógio, em monoespaçada. */
export function CounterTimecode({ elapsed, size = 'lg' }: { elapsed: Elapsed; size?: 'lg' | 'sm' }) {
  const calendar = [
    elapsed.years > 0 ? `${elapsed.years}a` : null,
    elapsed.months > 0 ? `${elapsed.months}m` : null,
    `${elapsed.days}d`,
  ]
    .filter(Boolean)
    .join(' ')

  const clock = `${pad(elapsed.hours)}:${pad(elapsed.minutes)}:${pad(elapsed.seconds)}`
  const big = size === 'lg'

  return (
    <div
      className={`timecode flex items-center justify-center gap-3 font-medium text-star ${
        big ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
      }`}
    >
      <span>{calendar}</span>
      <span className="text-ember/70">·</span>
      <span>{clock}</span>
    </div>
  )
}
