import { CONSO_GRAVITE, ENTRETIEN } from "./data.js";

/**
 * Calcule les forfaits PERFADOM pour les deux modes officinaux courants :
 * - Gravité (IV ou SC)
 * - Entretien intercure chambre implantable (PERFADOM 21)
 *
 * @param {object} params
 * @param {"GRAVITE"|"INTERCURE"} params.mode
 * @param {"IV"|"SC"}   params.voieAbord        — informatif (gravité)
 * @param {number}      params.nbPerfParJour     — entier (1, 2 ou 3)
 * @param {number}      params.nbJours           — durée totale de la cure
 * @param {boolean}     params.deplacementDomicile — obligatoire pour PERFADOM 6
 * @param {"PAC"|"PICC"} params.typeVVC          — intercure seulement
 * @param {number}      params.nbActes           — nombre d'actes d'entretien
 * @returns {object}    result
 */
export function calculerForfaits({
  mode,
  voieAbord,
  nbPerfParJour,
  nbJours,
  deplacementDomicile,
  typeVVC,
  nbActes,
}) {
  const result = {
    installation:  [],
    consommables:  [],
    entretien:     [],
    calendrier:    [],
    alertes:       [],
    detailGravite: null,
  };

  // ── ENTRETIEN INTERCURE (chambre implantable) ──────────────────────────────
  if (mode === "INTERCURE") {
    const f = typeVVC === "PICC" ? ENTRETIEN[1] : ENTRETIEN[0];
    result.entretien.push({
      ...f,
      qty: nbActes,
      note: "Facturation à l'acte — voie non mobilisée ≥ 7 jours requis.",
    });
    result.alertes.push(
      "ℹ️ Non cumulable avec les forfaits consommables de la même voie sur la même période.",
      "ℹ️ Prescriptible par un médecin ou un infirmier (PERFADOM 21).",
    );
    return result;
  }

  // ── GRAVITÉ ────────────────────────────────────────────────────────────────
  if (mode === "GRAVITE") {
    const n         = nbPerfParJour;          // entier 1 / 2 / 3
    const semComp   = Math.floor(nbJours / 7);
    const joursRes  = nbJours % 7;
    const semTotal  = Math.ceil(nbJours / 7);
    const perf28j   = n * 28;

    // Alerte max
    if (n > 3) {
      result.alertes.push("⚠️ Maximum 3 perf/jour en gravité seule (5/j si association avec un autre mode).");
    }

    // ── Installation (PERFADOM 6) ──────────────────────────────────────────
    if (deplacementDomicile) {
      result.installation.push({
        code: "PERFADOM 6",
        lpp: "1172619",
        label: "Installation + suivi gravité (semaine 1)",
        qty: 1,
        note: "Inclut installation, suivi semaine 1 et déplacement au domicile.",
      });
      result.alertes.push(
        "ℹ️ PERFADOM 6 inclut installation + suivi semaine 1 — pas de forfait de suivi séparé.",
      );
    } else {
      result.alertes.push(
        "⚠️ Délivrance en officine uniquement : PERFADOM 6 non facturable (déplacement domicile obligatoire). Seuls les forfaits consommables PERFADOM 17 à 20 sont facturables.",
      );
    }

    // ── CAS RARE : < 15 perf / 28 jours → PERFADOM 17 uniquement ──────────
    if (perf28j < 15) {
      const totalPerf = n * nbJours;
      result.consommables.push({
        ...CONSO_GRAVITE[0],
        qty: totalPerf,
        note: `${totalPerf} perf au total. Max 6 unités/semaine.`,
      });
      result.alertes.push(
        "ℹ️ PERFADOM 17 : forfait à la perfusion (non hebdomadaire). Max 6 unités/semaine.",
      );
      result.detailGravite = {
        cas: "rare",
        fHebdoCode: null, fHebdoQty: 0,
        joursRes: 0, f17Res: totalPerf, n,
      };
      // Calendrier cas rare
      for (let s = 0; s < semTotal; s++) {
        const qSem = Math.min(n * 7, totalPerf - s * n * 7);
        const items = [];
        if (s === 0 && deplacementDomicile) items.push("PERFADOM 6");
        items.push(`PERFADOM 17 × ${Math.max(0, qSem)}`);
        result.calendrier.push({
          semaine: s + 1,
          label: s === 0 ? "J+6" : `J+${(s + 1) * 7 - 1}`,
          forfaits: items,
        });
      }
      return result;
    }

    // ── CAS COURANT : ≥ 1 perf/jour ────────────────────────────────────────
    // Semaine 1  → PERFADOM 6 (inclut tout)
    // Sems 2..N  → PERFADOM 18 / 19 / 20 (hebdo)
    // Jours résiduels → PERFADOM 17 à la perfusion
    const forfaitHebdo = CONSO_GRAVITE.find(
      x => x.freq === "jour" && n >= x.min && n <= x.max,
    );
    const semSuivantes = Math.max(0, semComp - 1);
    const f17Res       = joursRes * n;

    if (forfaitHebdo && semSuivantes > 0) {
      result.consommables.push({
        ...forfaitHebdo,
        qty: semSuivantes,
        note: `Semaine${semSuivantes > 1 ? "s" : ""} 2${semSuivantes > 1 ? `–${semComp}` : ""} — consommables hebdomadaires.`,
      });
    }

    if (joursRes > 0) {
      result.consommables.push({
        ...CONSO_GRAVITE[0],
        qty: f17Res,
        note: `${joursRes} jour(s) résiduel(s) × ${n} perf/j = ${f17Res} unité(s). Max 6/semaine.`,
      });
      result.alertes.push(
        `ℹ️ PERFADOM 17 × ${f17Res} pour les ${joursRes} jour(s) au-delà de la dernière semaine complète.`,
      );
    }

    result.detailGravite = {
      cas: "courant",
      fHebdoCode: forfaitHebdo?.code ?? null,
      fHebdoQty: semSuivantes,
      joursRes, f17Res, n,
    };

    // Calendrier cas courant
    for (let s = 0; s < semTotal; s++) {
      const isRes = s === semTotal - 1 && joursRes > 0;
      const label = s === 0
        ? "J+6 (sem. 1)"
        : isRes
          ? `J+${nbJours - 1} (jours résiduels)`
          : `J+${(s + 1) * 7 - 1}`;
      let items = [];
      if (s === 0) {
        items.push(
          deplacementDomicile
            ? "PERFADOM 6 (install. + suivi sem. 1)"
            : "⚠ PERFADOM 6 non facturable (pas de déplacement)",
        );
      } else if (isRes) {
        items.push(`PERFADOM 17 × ${f17Res}`);
      } else if (forfaitHebdo) {
        items.push(`${forfaitHebdo.code} (consomm. hebdo)`);
      }
      result.calendrier.push({ semaine: s + 1, label, forfaits: items });
    }
  }

  return result;
}
