import { useEffect, useState } from 'react'

export type Elapsed = {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
  /** Total de dias corridos desde a data (útil pra frases tipo "há 30 dias"). */
  totalDays: number
}

/** Diferença de calendário entre `from` e `to`, quebrada em anos/meses/dias/horas/min/seg. */
function diff(from: Date, to: Date): Elapsed {
  let years = to.getFullYear() - from.getFullYear()
  let months = to.getMonth() - from.getMonth()
  let days = to.getDate() - from.getDate()
  let hours = to.getHours() - from.getHours()
  let minutes = to.getMinutes() - from.getMinutes()
  let seconds = to.getSeconds() - from.getSeconds()

  if (seconds < 0) {
    seconds += 60
    minutes--
  }
  if (minutes < 0) {
    minutes += 60
    hours--
  }
  if (hours < 0) {
    hours += 24
    days--
  }
  if (days < 0) {
    // dias do mês anterior ao mês de `to`
    const daysInPrevMonth = new Date(to.getFullYear(), to.getMonth(), 0).getDate()
    days += daysInPrevMonth
    months--
  }
  if (months < 0) {
    months += 12
    years--
  }

  const totalDays = Math.floor((to.getTime() - from.getTime()) / 86_400_000)

  return { years, months, days, hours, minutes, seconds, totalDays }
}

/** Contador ao vivo: recalcula a cada segundo o tempo decorrido desde `start`. */
export function useElapsed(start: Date | null): Elapsed | null {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    if (!start) return
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [start])

  if (!start) return null
  if (now.getTime() < start.getTime()) {
    // Data ainda no futuro — zera o contador.
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalDays: 0 }
  }
  return diff(start, now)
}
