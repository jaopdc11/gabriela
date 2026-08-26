# Ideia guardada: as nossas estrelas em constelações reais

Ideia levantada em 24/08/2026, tirada do site a pedido do João. **Não está mais no
app** — o código foi movido pra `notas/codigo-constelacoes/` (fora de `src/`, então
não entra no build nem no typecheck). Pra ressuscitar: mover
`constellations.ts` de volta pra `src/`, `ConstellationMap.tsx` pra
`src/components/`, e religar a rota `?constelacao=<id>` no `App.tsx`.

## O que era

Em vez do céu inventado (as estrelas espalhadas por uma curva), usar uma
**constelação de verdade como molde**: cada estrela real do campo é uma *vaga*, com
a posição astronômica correta (ascensão reta e declinação convertidas pro plano,
com a escala de RA corrigida pela declinação média, orientação de mapa celeste —
RA crescendo pra esquerda). Os nossos momentos acendem as vagas; o que ainda não
foi vivido fica de fantasma, esperando.

Duas constelações montadas: **Capricórnio** (o signo do João) e **Touro** (o da
Gabi). Chegaram a funcionar, com imagens geradas em `~/Imagens/`.

## Regra de atribuição que ficou boa

- as estrelas ordenadas por magnitude (mais brilhante primeiro);
- os **marcos** (o pedido de namoro e os fechos de mês) vão nas mais brilhantes;
- os **dias comuns** entram em ordem cronológica nas seguintes.

Resultado que caiu sozinho, sem forçar:

| momento | Capricórnio | Touro |
|---|---|---|
| o pedido de namoro | Deneb Algedi (δ, mag 2,85 — a mais brilhante) | **Aldebaran** (α, 0,87 — o olho do touro) |
| um mês de nós | Dabih (β¹, 3,05) | Elnath (β, 1,65 — ponta do chifre norte) |
| a gente se conheceu | Algedi Secunda (α², 3,58) | Alcyone (η, 2,85 — a maior das Plêiades) |

## Quantas estrelas cada uma tem

Não existe número canônico: constelação é uma *região* do céu, e o "quantas
estrelas tem" depende de onde se corta a magnitude.

**Capricórnio** — a menor e uma das mais fracas do zodíaco (414 deg²):
- 10 no traçado clássico do bode-marinho;
- 17 até magnitude 4,82 (coincidência: o número de momentos que a gente tinha);
- **31 até magnitude 6** (limite do olho nu);
- 87 linhas na tabela completa (o resto precisa de binóculo).

**Touro** — bem mais rica (797 deg²):
- 12 no traçado clássico (V do rosto + dois chifres + pescoço/ombro);
- **49 até magnitude 5,0**, já incluindo seis das sete Plêiades (Alcyone, Atlas,
  Electra, Maia, Merope, Taygeta — faltam Pleione, Celaeno e Asterope, todas mais
  fracas que 5,0).

## Traçados usados (pares ligados)

**Capricórnio:** α²–β¹ (cabeça) · α²–θ–ι–γ–δ (dorso até a cauda) ·
β¹–ψ–ω–24–ζ–δ (barriga fechando o triângulo).

**Touro:** ζ–α (chifre sul ao olho) · α–θ²–γ (rosto de baixo) ·
γ–δ¹–ε–β (rosto de cima até o chifre norte) · γ–λ (pescoço) · λ–ξ–ο (ombro).
As pernas (ν e 10 Tau) ficaram fora do traço de propósito — não achei versão
confiável do desenho pra elas.

## O zodíaco inteiro: a conta

Áreas somadas das 12 constelações zodiacais ≈ **8.685 deg²**, uns **21% do céu**
(41.253 deg²). Aplicando isso às contagens do céu todo:

| corte | no céu inteiro | nas 12 do zodíaco |
|---|---|---|
| só os traçados | — | ~150 estrelas |
| magnitude ≤ 6,0 | ~5.000–6.000 | **~1.150** |
| magnitude ≤ 6,5 (limite absoluto do olho) | 9.096 | **~1.900** |

Ritmo de momentos registrados: **17 em 78 dias** (06/06 a 23/08) = 6,6 por mês;
considerando só o namoro, 5 em 31 dias = 4,8 por mês.

Tempo pra completar, a partir dos 17 já vividos:

| alvo | a 6,6/mês | a 4,8/mês |
|---|---|---|
| os 12 traçados (~150) | ~1 ano e 8 meses | ~2 anos e 4 meses |
| tudo a olho nu, mag 6 (~1.150) | ~14 anos | ~20 anos |
| mag 6,5 (~1.900) | ~24 anos | ~33 anos |

Ressalva: esse ritmo é de começo de namoro, cheio de primeira vez. Se cair pra 3
por mês, os traçados viram ~4 anos e o campo completo passa de 30.

## Fontes

- [List of stars in Capricornus — Wikipedia](https://en.wikipedia.org/wiki/List_of_stars_in_Capricornus)
- [List of stars in Taurus — Wikipedia](https://en.wikipedia.org/wiki/List_of_stars_in_Taurus)
- [Capricornus Constellation — Constellation Guide](https://www.constellation-guide.com/constellation-list/capricornus-constellation/)
- [Taurus Constellation — Constellation Guide](https://www.constellation-guide.com/constellation-list/taurus-constellation/)
- [Zodiac Constellations (áreas) — Constellation Guide](https://www.constellation-guide.com/constellation-map/zodiac-constellations/)
- [How Many Stars in the Sky? 9,096 — Sky & Telescope](https://skyandtelescope.org/astronomy-blogs/how-many-stars-night-sky-09172014/)
