/**
 * Constelações de verdade, pra servirem de molde ao nosso céu: cada estrela do
 * desenho é uma VAGA, e os nossos momentos vão acendendo as vagas em ordem. O
 * que ainda não vivemos fica ali de fantasma, esperando.
 *
 * Coordenadas (ascensão reta em horas, declinação em graus) conferidas na lista
 * de estrelas da constelação — nada aqui é posição chutada.
 */

export type SkyStar = {
  key: string
  /** nome da estrela, do jeito que ela é chamada */
  name: string
  /** designação (α² Cap, δ Cap...) */
  bayer: string
  /** ascensão reta, em horas decimais */
  ra: number
  /** declinação, em graus decimais */
  dec: number
  /** magnitude aparente (menor = mais brilhante) */
  mag: number
}

export type Constellation = {
  id: string
  /** nome em português */
  name: string
  /** de quem é esse céu */
  who: string
  stars: SkyStar[]
  /** o traçado clássico do desenho: pares de estrelas ligadas */
  lines: [string, string][]
}

/** Horas e minutos pra horas decimais. */
const h = (hh: number, mm: number, ss = 0) => hh + mm / 60 + ss / 3600
/** Graus e minutos pra graus decimais, ao sul do equador celeste. */
const d = (dd: number, mm: number, ss = 0) => -(Math.abs(dd) + mm / 60 + ss / 3600)
/** O mesmo, ao norte. */
const n = (dd: number, mm: number, ss = 0) => Math.abs(dd) + mm / 60 + ss / 3600

/**
 * Capricórnio — o céu do Jão. Traçado comum do bode-marinho: a cabeça (Algedi e
 * Dabih), o dorso descendo até a cauda (Deneb Algedi) e a barriga fechando o
 * triângulo por baixo.
 */
export const CAPRICORNIO: Constellation = {
  id: 'capricornio',
  name: 'Capricórnio',
  who: 'o meu céu',
  // as 17 estrelas mais brilhantes da constelação (até magnitude 4,82) — o mesmo
  // número de momentos que a gente tem escritos
  stars: [
    { key: 'delta', name: 'Deneb Algedi', bayer: 'δ Cap', ra: h(21, 47, 2.29), dec: d(16, 7, 36), mag: 2.85 },
    { key: 'beta1', name: 'Dabih', bayer: 'β¹ Cap', ra: h(20, 21, 0.65), dec: d(14, 46, 53), mag: 3.05 },
    { key: 'alpha2', name: 'Algedi Secunda', bayer: 'α² Cap', ra: h(20, 18, 3.22), dec: d(12, 32, 42), mag: 3.58 },
    { key: 'gamma', name: 'Nashira', bayer: 'γ Cap', ra: h(21, 40, 5.34), dec: d(16, 39, 44), mag: 3.69 },
    { key: 'zeta', name: 'Marakk', bayer: 'ζ Cap', ra: h(21, 26, 40.03), dec: d(22, 24, 41), mag: 3.77 },
    { key: 'theta', name: 'Udang', bayer: 'θ Cap', ra: h(21, 5, 56.78), dec: d(17, 13, 58), mag: 4.08 },
    { key: 'omega', name: 'Baten Algiedi', bayer: 'ω Cap', ra: h(20, 51, 49.3), dec: d(26, 55, 9), mag: 4.12 },
    { key: 'psi', name: 'Pazhan', bayer: 'ψ Cap', ra: h(20, 46, 5.77), dec: d(25, 16, 14), mag: 4.13 },
    { key: 'iota', name: 'Dai', bayer: 'ι Cap', ra: h(21, 22, 14.78), dec: d(16, 50, 4), mag: 4.27 },
    { key: 'alpha1', name: 'Sukhurmashu', bayer: 'α¹ Cap', ra: h(20, 17, 38.86), dec: d(12, 30, 30), mag: 4.3 },
    { key: 'cap24', name: '24 Capricorni', bayer: '24 Cap', ra: h(21, 7, 7.69), dec: d(25, 0, 21), mag: 4.49 },
    { key: 'cap36', name: 'Jin', bayer: '36 Cap', ra: h(21, 28, 43.32), dec: d(21, 48, 26), mag: 4.5 },
    { key: 'epsilon', name: 'Castra', bayer: 'ε Cap', ra: h(21, 37, 4.82), dec: d(19, 27, 58), mag: 4.51 },
    { key: 'kappa', name: 'Kappa', bayer: 'κ Cap', ra: h(21, 42, 39.42), dec: d(18, 51, 59), mag: 4.72 },
    { key: 'nu', name: 'Alshat', bayer: 'ν Cap', ra: h(20, 20, 39.81), dec: d(12, 45, 33), mag: 4.77 },
    { key: 'rho', name: 'Bos', bayer: 'ρ Cap', ra: h(20, 28, 51.62), dec: d(17, 48, 49), mag: 4.77 },
    { key: 'eta', name: 'Armus', bayer: 'η Cap', ra: h(21, 4, 24.32), dec: d(19, 51, 18), mag: 4.82 },
    // daqui pra baixo, o resto do campo a olho nu (até magnitude 6): são as
    // vagas que ainda vão acender
    { key: 'mu', name: 'Kuh', bayer: 'μ Cap', ra: h(21, 53, 18), dec: d(13, 33), mag: 5.07 },
    { key: 'pi', name: 'Okul', bayer: 'π Cap', ra: h(20, 27, 19), dec: d(18, 13), mag: 5.08 },
    { key: 'cap46', name: '46 Capricorni', bayer: '46 Cap', ra: h(21, 45, 0), dec: d(9, 5), mag: 5.1 },
    { key: 'upsilon', name: 'Upsilon', bayer: 'υ Cap', ra: h(20, 40, 3), dec: d(18, 8), mag: 5.15 },
    { key: 'cap42', name: '42 Capricorni', bayer: '42 Cap', ra: h(21, 41, 33), dec: d(14, 3), mag: 5.16 },
    { key: 'phi', name: 'Phi', bayer: 'φ Cap', ra: h(21, 15, 38), dec: d(20, 39), mag: 5.17 },
    { key: 'tau2', name: 'Tau', bayer: 'τ² Cap', ra: h(20, 39, 16), dec: d(14, 57), mag: 5.24 },
    { key: 'cap41', name: '41 Capricorni', bayer: '41 Cap', ra: h(21, 42, 1), dec: d(23, 16), mag: 5.24 },
    { key: 'sigma', name: 'Sigma', bayer: 'σ Cap', ra: h(20, 19, 24), dec: d(19, 7), mag: 5.28 },
    { key: 'chi', name: 'Chi', bayer: 'χ Cap', ra: h(21, 8, 34), dec: d(21, 12), mag: 5.3 },
    { key: 'cap29', name: '29 Capricorni', bayer: '29 Cap', ra: h(21, 15, 45), dec: d(15, 10), mag: 5.31 },
    { key: 'cap33', name: '33 Capricorni', bayer: '33 Cap', ra: h(21, 24, 10), dec: d(20, 51), mag: 5.38 },
    { key: 'cap30', name: '30 Capricorni', bayer: '30 Cap', ra: h(21, 17, 57), dec: d(17, 59), mag: 5.4 },
    { key: 'lambda', name: 'Lambda', bayer: 'λ Cap', ra: h(21, 46, 32), dec: d(11, 22), mag: 5.57 },
  ],
  lines: [
    ['alpha2', 'beta1'],
    ['alpha2', 'theta'],
    ['theta', 'iota'],
    ['iota', 'gamma'],
    ['gamma', 'delta'],
    ['beta1', 'psi'],
    ['psi', 'omega'],
    ['omega', 'cap24'],
    ['cap24', 'zeta'],
    ['zeta', 'delta'],
  ],
}


/**
 * Touro — o céu da Gabi. Todas as 49 estrelas visíveis a olho nu (magnitude até
 * 5), o que inclui as Híades desenhando o V do rosto e seis das sete Plêiades.
 * O traçado é o clássico: o V da cara, os dois chifres (Elnath ao norte,
 * Tianguan ao sul) e o pescoço saindo pro ombro.
 */
export const TOURO: Constellation = {
  id: 'touro',
  name: 'Touro',
  who: 'o céu dela',
  stars: [
    { key: 'alpha', name: 'Aldebaran', bayer: 'α Tau', ra: h(4, 35, 55.20), dec: n(16, 30, 35.1), mag: 0.87 },
    { key: 'beta', name: 'Elnath', bayer: 'β Tau', ra: h(5, 26, 17.50), dec: n(28, 36, 28.3), mag: 1.65 },
    { key: 'eta', name: 'Alcyone', bayer: 'η Tau', ra: h(3, 47, 29.06), dec: n(24, 6, 18.9), mag: 2.85 },
    { key: 'zeta', name: 'Tianguan', bayer: 'ζ Tau', ra: h(5, 37, 38.68), dec: n(21, 8, 33.3), mag: 2.97 },
    { key: 'theta2', name: 'Chamukuy', bayer: 'θ² Tau', ra: h(4, 28, 39.67), dec: n(15, 52, 15.4), mag: 3.40 },
    { key: 'lambda', name: 'Bibing', bayer: 'λ Tau', ra: h(4, 0, 40.82), dec: n(12, 29, 25.4), mag: 3.41 },
    { key: 'epsilon', name: 'Ain', bayer: 'ε Tau', ra: h(4, 28, 36.93), dec: n(19, 10, 49.9), mag: 3.53 },
    { key: 'omicron', name: 'ο Tauri', bayer: 'ο Tau', ra: h(3, 24, 48.84), dec: n(9, 1, 44.6), mag: 3.61 },
    { key: 'tau27', name: 'Atlas', bayer: '27 Tau', ra: h(3, 49, 9.73), dec: n(24, 3, 12.7), mag: 3.62 },
    { key: 'gamma', name: 'Prima Hyadum', bayer: 'γ Tau', ra: h(4, 19, 47.53), dec: n(15, 37, 39.7), mag: 3.65 },
    { key: 'tau17', name: 'Electra', bayer: '17 Tau', ra: h(3, 44, 52.52), dec: n(24, 6, 48.4), mag: 3.72 },
    { key: 'xi', name: 'Ushakaron', bayer: 'ξ Tau', ra: h(3, 27, 10.12), dec: n(9, 43, 58.0), mag: 3.73 },
    { key: 'delta1', name: 'Secunda Hyadum', bayer: 'δ¹ Tau', ra: h(4, 22, 56.03), dec: n(17, 32, 33.3), mag: 3.77 },
    { key: 'theta1', name: 'θ¹ Tauri', bayer: 'θ¹ Tau', ra: h(4, 28, 34.43), dec: n(15, 57, 44.0), mag: 3.84 },
    { key: 'tau20', name: 'Maia', bayer: '20 Tau', ra: h(3, 45, 49.59), dec: n(24, 22, 4.3), mag: 3.87 },
    { key: 'nu', name: 'ν Tauri', bayer: 'ν Tau', ra: h(4, 3, 9.38), dec: n(5, 59, 21.5), mag: 3.91 },
    { key: 'tau5', name: '5 Tauri', bayer: '5 Tau', ra: h(3, 30, 52.37), dec: n(12, 56, 12.1), mag: 4.14 },
    { key: 'tau23', name: 'Merope', bayer: '23 Tau', ra: h(3, 46, 19.56), dec: n(23, 56, 54.5), mag: 4.14 },
    { key: 'kappa1', name: 'κ¹ Tauri', bayer: 'κ¹ Tau', ra: h(4, 25, 22.10), dec: n(22, 17, 38.3), mag: 4.21 },
    { key: 'tau88', name: '88 Tauri', bayer: '88 Tau', ra: h(4, 35, 39.23), dec: n(10, 9, 39.3), mag: 4.25 },
    { key: 'mu', name: 'μ Tauri', bayer: 'μ Tau', ra: h(4, 15, 32.05), dec: n(8, 53, 32.7), mag: 4.27 },
    { key: 'tau90', name: '90 Tauri', bayer: '90 Tau', ra: h(4, 38, 9.40), dec: n(12, 30, 39.1), mag: 4.27 },
    { key: 'tau', name: 'Gaja', bayer: 'τ Tau', ra: h(4, 42, 14.70), dec: n(22, 57, 25.1), mag: 4.27 },
    { key: 'upsilon', name: 'υ Tauri', bayer: 'υ Tau', ra: h(4, 26, 18.39), dec: n(22, 48, 49.3), mag: 4.28 },
    { key: 'tau10', name: '10 Tauri', bayer: '10 Tau', ra: h(3, 36, 52.52), dec: n(0, 24, 10.2), mag: 4.29 },
    { key: 'tau19', name: 'Taygeta', bayer: '19 Tau', ra: h(3, 45, 12.48), dec: n(24, 28, 2.6), mag: 4.30 },
    { key: 'tau68', name: '68 Tauri', bayer: '68 Tau', ra: h(4, 25, 29.32), dec: n(17, 55, 40.8), mag: 4.30 },
    { key: 'tau119', name: 'Ruby Star', bayer: '119 Tau', ra: h(5, 32, 12.75), dec: n(18, 35, 39.3), mag: 4.32 },
    { key: 'tau37', name: '37 Tauri', bayer: '37 Tau', ra: h(4, 4, 41.66), dec: n(22, 4, 55.4), mag: 4.36 },
    { key: 'tau71', name: '71 Tauri', bayer: '71 Tau', ra: h(4, 26, 20.67), dec: n(15, 37, 6.0), mag: 4.48 },
    { key: 'tau136', name: '136 Tauri', bayer: '136 Tau', ra: h(5, 53, 19.64), dec: n(27, 36, 44.2), mag: 4.56 },
    { key: 'iota', name: 'ι Tauri', bayer: 'ι Tau', ra: h(5, 3, 5.70), dec: n(21, 35, 24.2), mag: 4.62 },
    { key: 'rho', name: 'ρ Tauri', bayer: 'ρ Tau', ra: h(4, 33, 50.86), dec: n(14, 50, 40.2), mag: 4.65 },
    { key: 'sigma2', name: 'Fùěr', bayer: 'σ² Tau', ra: h(4, 39, 16.45), dec: n(15, 55, 4.9), mag: 4.67 },
    { key: 'pi', name: 'π Tauri', bayer: 'π Tau', ra: h(4, 26, 36.38), dec: n(14, 42, 49.9), mag: 4.69 },
    { key: 'tauhd28527', name: 'HD 28527 Tauri', bayer: 'HD 28527', ra: h(4, 30, 33.57), dec: n(16, 11, 38.7), mag: 4.78 },
    { key: 'tau64', name: '64 Tauri', bayer: '64 Tau', ra: h(4, 24, 5.69), dec: n(17, 26, 39.2), mag: 4.80 },
    { key: 'tau139', name: '139 Tauri', bayer: '139 Tau', ra: h(5, 57, 59.66), dec: n(25, 57, 14.1), mag: 4.81 },
    { key: 'tau47', name: '47 Tauri', bayer: '47 Tau', ra: h(4, 13, 56.39), dec: n(9, 15, 50.0), mag: 4.84 },
    { key: 'tau126', name: '126 Tauri', bayer: '126 Tau', ra: h(5, 41, 17.72), dec: n(16, 32, 3.1), mag: 4.84 },
    { key: 'tau114', name: '114 Tauri', bayer: '114 Tau', ra: h(5, 27, 38.08), dec: n(21, 56, 13.1), mag: 4.88 },
    { key: 'tau132', name: '132 Tauri', bayer: '132 Tau', ra: h(5, 49, 0.96), dec: n(24, 34, 3.2), mag: 4.88 },
    { key: 'tau134', name: '134 Tauri', bayer: '134 Tau', ra: h(5, 49, 32.94), dec: n(12, 39, 4.9), mag: 4.89 },
    { key: 'tau104', name: '104 Tauri', bayer: '104 Tau', ra: h(5, 7, 26.68), dec: n(18, 38, 42.0), mag: 4.91 },
    { key: 'omega2', name: 'ω² Tauri', bayer: 'ω² Tau', ra: h(4, 17, 15.69), dec: n(20, 34, 43.5), mag: 4.93 },
    { key: 'tau75', name: 'Shakata', bayer: '75 Tau', ra: h(4, 28, 26.37), dec: n(16, 21, 34.7), mag: 4.96 },
    { key: 'tau109', name: '109 Tauri', bayer: '109 Tau', ra: h(5, 19, 16.59), dec: n(22, 5, 48.1), mag: 4.96 },
    { key: 'phi', name: 'φ Tauri', bayer: 'φ Tau', ra: h(4, 20, 21.23), dec: n(27, 21, 3.4), mag: 4.97 },
    { key: 'tau111', name: '111 Tauri', bayer: '111 Tau', ra: h(5, 24, 25.31), dec: n(17, 23, 0.8), mag: 5.00 },
  ],
  lines: [
    ['zeta', 'alpha'],
    ['alpha', 'theta2'],
    ['theta2', 'gamma'],
    ['gamma', 'delta1'],
    ['delta1', 'epsilon'],
    ['epsilon', 'beta'],
    ['gamma', 'lambda'],
    ['lambda', 'xi'],
    ['xi', 'omicron'],
  ],
}

export const constellations: Constellation[] = [CAPRICORNIO, TOURO]

export const constellationById = (id: string | null | undefined) =>
  constellations.find((c) => c.id === id)

export type ProjectedStar = SkyStar & { x: number; y: number }

/**
 * Joga a constelação no plano do mapa: ascensão reta pra esquerda (como num
 * mapa celeste), declinação pra cima, com a escala de RA corrigida pela
 * declinação média — senão o desenho estica na horizontal. Sai em 0–100 de
 * largura, com a altura que o desenho pedir.
 */
export function project(c: Constellation, width = 100): { stars: ProjectedStar[]; height: number } {
  const decMid = c.stars.reduce((s, st) => s + st.dec, 0) / c.stars.length
  const k = Math.cos((decMid * Math.PI) / 180)

  const raw = c.stars.map((s) => ({ ...s, px: -s.ra * 15 * k, py: -s.dec }))
  const xs = raw.map((s) => s.px)
  const ys = raw.map((s) => s.py)
  const x0 = Math.min(...xs)
  const y0 = Math.min(...ys)
  const scale = width / (Math.max(...xs) - x0)

  return {
    stars: raw.map((s) => ({
      ...s,
      x: (s.px - x0) * scale,
      y: (s.py - y0) * scale,
    })),
    height: (Math.max(...ys) - y0) * scale,
  }
}
