import type { ReactNode } from 'react'

/** Palavras de axé que acendem em âmbar no meio do texto. */
export const SACRED_WORDS = ['axé', 'Ora Ye Ye ô', 'Laroyê']

/**
 * Os nomes das entidades e dos orixás. Ficam separados das palavras porque o céu
 * do começo destaca só as palavras (é o texto como ele já foi escrito), e as
 * cartas destacam tudo — nome de quem guarda a gente acende.
 */
export const SACRED_NAMES = [
  // do mais longo pro mais curto: o primeiro que casar é o que vale
  'Seo Tranca Rua das Almas',
  'Seo Tranca Rua',
  'Seo Samambaia',
  'Seo João Sorriso',
  'Iemanjá',
  'Oxóssi',
  'Oxum',
]

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Quebra o texto e devolve os termos sagrados em âmbar, o resto igual. Os termos
 * vêm na ordem em que devem casar (mais específico primeiro).
 */
export function highlightSacred(text: string, terms: string[]): ReactNode[] {
  const re = new RegExp(`(${terms.map(escape).join('|')})`, 'g')
  return text.split(re).map((part, i) =>
    terms.includes(part) ? (
      <span key={i} className="font-medium text-ember">
        {part}
      </span>
    ) : (
      part
    ),
  )
}

/** O destaque das cartas: nomes de entidade e palavras de axé. */
export const sacred = (text: string) =>
  highlightSacred(text, [...SACRED_NAMES, ...SACRED_WORDS])
