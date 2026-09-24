import { useCallback, useMemo } from 'react'
import { buildChapters } from '../chapters'
import { NAMORO_DATE, worlds } from '../data'
import { ChapterCard } from './ChapterCard'
import { MonthLetter } from './Letter'
import { NightJourney } from './NightJourney'
import { chapterColor } from './SkyMap'
import { PhotoCarousel } from './PhotoCarousel'
import { Prologue, PrologueNamoro } from './Prologue'

/** Onde cada capítulo começa nesta página, pra cartela poder pular de mês. */
const anchorOf = (n: number) => `tudo-mes-${n}`

/**
 * O site inteiro emendado: os mesmos pedaços das abas de mundo, um atrás do
 * outro, numa rolagem só. Primeiro o começo (o prólogo, o céu com o pedido e o
 * álbum), depois a ponte do sim e cada mês de namoro com a sua cartela, a sua
 * carta, o seu céu e as suas fotos.
 *
 * Nada aqui é conteúdo novo nem versão paralela: são os componentes de verdade,
 * com os mesmos dados. O que muda é só que não tem troca de aba no meio — dá
 * pra ler do primeiro dia até agora sem sair do lugar.
 */
export function Everything({ onBack }: { onBack?: () => void }) {
  const { comeco, namoro, chapters } = useMemo(() => {
    const comeco = worlds.find((w) => w.id === 'comeco')
    const namoro = worlds.find((w) => w.id === 'namoro')
    return {
      comeco,
      namoro,
      chapters: namoro
        ? buildChapters(namoro, NAMORO_DATE, new Date(), import.meta.env.DEV)
        : [],
    }
  }, [])

  /** aqui a cartela não troca de capítulo: ela rola até ele, que já está na página */
  const goTo = useCallback((n: number) => {
    document.getElementById(anchorOf(n))?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const monthTabs = useMemo(() => chapters.map((c) => ({ n: c.n, nav: c.nav })), [chapters])

  return (
    <>
      {comeco && (
        <>
          <Prologue />
          <NightJourney
            stars={comeco.stars ?? []}
            finale={comeco.finale}
            seed={comeco.seed}
            label={comeco.skyLabel}
          />
          <PhotoCarousel
            dir={comeco.albumDir}
            label={comeco.albumLabel}
            title={comeco.albumTitle}
          />
        </>
      )}

      {namoro && chapters.length > 0 && (
        <>
          <PrologueNamoro />
          {chapters.map((c) => (
            <div key={c.n} id={anchorOf(c.n)}>
              <ChapterCard chapter={c} chapters={chapters} onChange={goTo} />
              {c.dedication && (
                <MonthLetter
                  dedication={c.dedication}
                  label={`a carta do ${c.bareName}`}
                  date={c.end}
                />
              )}
              <NightJourney
                stars={c.stars}
                color={chapterColor(c.n)}
                finale={c.finale}
                seed={c.seed}
                label={`${c.name}, nas estrelas`}
                emptyNote={
                  c.current
                    ? 'esse mês tá acontecendo agora. as estrelas dele ainda vão acender.'
                    : 'esse mês ainda não tem estrela aqui.'
                }
              />
              <PhotoCarousel
                dir={namoro.albumDir}
                label={namoro.albumLabel}
                title={namoro.albumTitle}
                months={monthTabs}
                activeMonth={c.n}
              />
            </div>
          ))}
        </>
      )}

      {onBack && (
        <div className="pb-28 pt-4 text-center">
          <button onClick={onBack} className="label text-mist transition-colors hover:text-star">
            voltar
          </button>
        </div>
      )}
    </>
  )
}
