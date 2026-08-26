import { useEffect, useState } from 'react'
import { worlds, type World } from '../data'

/**
 * Seletor de mundos no topo: o mesmo espírito das pílulas do contador, mas
 * trocando o site inteiro de céu. Se esconde ao descer (pra não atrapalhar a
 * leitura da constelação) e volta ao subir.
 */
export function WorldSwitch({
  current,
  onChange,
  onMap,
  mapActive = false,
}: {
  current: World['id']
  onChange: (id: World['id']) => void
  /** abre a aba do nosso céu: todas as estrelas dos dois mundos num mapa só */
  onMap?: () => void
  mapActive?: boolean
}) {
  const [shown, setShown] = useState(true)

  useEffect(() => {
    let last = window.scrollY
    let raf = 0
    const update = () => {
      const y = window.scrollY
      // no topo sempre aparece; descendo esconde, subindo volta
      setShown(y < 80 || y < last)
      last = y
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <nav
      aria-label="Escolher o capítulo"
      className={`fixed inset-x-0 top-0 z-[60] flex justify-center px-3 pt-3 transition-all duration-500 ease-out sm:pt-5 ${
        shown ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'
      }`}
    >
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-night-deep/70 p-1 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.9)] backdrop-blur-md">
        {worlds.map((w) => (
          <button
            key={w.id}
            onClick={() => onChange(w.id)}
            aria-current={!mapActive && w.id === current ? 'page' : undefined}
            className={`label rounded-full px-3.5 py-1.5 transition-colors ${
              !mapActive && w.id === current
                ? 'bg-ember/15 text-ember ring-1 ring-ember/40'
                : 'text-mist hover:text-star'
            }`}
          >
            {w.nav}
          </button>
        ))}
        {onMap && (
          <button
            onClick={onMap}
            aria-current={mapActive ? 'page' : undefined}
            className={`label rounded-full px-3.5 py-1.5 transition-colors ${
              mapActive
                ? 'bg-ember/15 text-ember ring-1 ring-ember/40'
                : 'text-mist hover:text-star'
            }`}
          >
            nosso céu
          </button>
        )}
      </div>
    </nav>
  )
}
