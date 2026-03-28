# Calculateur PERFADOM — v2 Officine

Outil d'aide à la facturation PERFADOM recentré sur les cas courants en pharmacie d'officine de ville.

## Périmètre volontairement limité

| Couvert | Non couvert |
|---|---|
| ✅ Perfusion par gravité (IV + SC) | ❌ SAE / Diffuseur (prestataire) |
| ✅ Entretien chambre implantable PAC (PERFADOM 21) | ❌ Immunoglobulines (PERFADOM 41–44) |
| ✅ Entretien PICC-LINE (PERFADOM 22) | ❌ NPAD |
| ✅ Disclaimer avec case à cocher obligatoire | ❌ PSL / transfusion |

## Structure

```
src/
├── data.js        — tarifs, codes LPP, définition des deux modes
├── calcul.js      — logique pure (calculerForfaits), testable sans UI
├── components.jsx — ForfaitCard, Toggle, Card, CalendrierRow
├── Disclaimer.jsx — écran d'avertissement avec case à cocher
└── App.jsx        — application complète (disclaimer → calculateur)
```

## Logique gravité

| Situation | Forfaits |
|---|---|
| Semaine 1 (avec déplacement domicile) | PERFADOM 6 × 1 |
| Semaines 2..N complètes | PERFADOM 18 / 19 / 20 × N |
| Jours résiduels au-delà | PERFADOM 17 × (jours × perf/j) |
| < 15 perf/28j (cas rare) | PERFADOM 17 uniquement |
| Délivrance officine sans déplacement | PERFADOM 17–20 seulement |

## Sources

- Circulaire CNAMTS CIR-3/2022
- Arrêté 26/06/2019 (JO 27/06/2019)
- OMéDIT Normandie v3 · OMéDIT IDF nov. 2024

> ⚠ Outil d'aide uniquement. Vérifier avec la LPP et la circulaire en vigueur.
# perfadom
