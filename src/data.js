// ─── TARIFS LPP (source : tableau CIR-3/2022) ────────────────────────────────
export const TARIFS = {
  "PERFADOM 6":  50.00,
  "PERFADOM 17": 11.80,
  "PERFADOM 18": 83.00,
  "PERFADOM 19": 157.00,
  "PERFADOM 20": 223.00,
  "PERFADOM 21": 10.00,
  "PERFADOM 22": 19.50,
};

// ─── CONSOMMABLES GRAVITÉ ─────────────────────────────────────────────────────
// PERFADOM 6  : installation + suivi semaine 1 (déplacement domicile obligatoire)
// PERFADOM 17 : < 15 perf/28j — facturation À LA PERFUSION (pas hebdo), max 6/sem
// PERFADOM 18 : 1 perf/jour   — hebdomadaire
// PERFADOM 19 : 2 perf/jour   — hebdomadaire
// PERFADOM 20 : > 2 perf/jour — hebdomadaire
export const CONSO_GRAVITE = [
  { code: "PERFADOM 17", lpp: "1185160", label: "< 15 perf/28 jours — à la perfusion", freq: "perf" },
  { code: "PERFADOM 18", lpp: "1121326", label: "1 perf/jour (hebdo)",  min: 1, max: 1,  freq: "jour" },
  { code: "PERFADOM 19", lpp: "1143279", label: "2 perf/jour (hebdo)",  min: 2, max: 2,  freq: "jour" },
  { code: "PERFADOM 20", lpp: "1153616", label: "> 2 perf/jour (hebdo)",min: 3, max: 99, freq: "jour" },
];

// ─── ENTRETIEN INTERCURE VVC ──────────────────────────────────────────────────
// Prescriptible médecin OU infirmier
// Non cumulable avec consommables de la même voie sur la même période
// Facturation à l'acte (voie non mobilisée ≥ 7 jours)
export const ENTRETIEN = [
  { code: "PERFADOM 21", lpp: "1103392", label: "Entretien VVC hors PICC-LINE — chambre implantable (PAC)" },
  { code: "PERFADOM 22", lpp: "1170419", label: "Entretien PICC-LINE" },
];

// ─── MODES ────────────────────────────────────────────────────────────────────
export const MODES_DEF = [
  {
    key: "GRAVITE",
    icon: "🌊",
    label: "Perfusion par gravité",
    sub: "Antibiothérapie, hydratation, soins palliatifs… (≥ 15 min)",
    col: "#059669",
    hasFreq: true,
  },
  {
    key: "INTERCURE",
    icon: "🔧",
    label: "Entretien chambre implantable (PAC)",
    sub: "Rinçage post-chimiothérapie — PERFADOM 21",
    col: "#be185d",
    hasFreq: false,
  },
];
