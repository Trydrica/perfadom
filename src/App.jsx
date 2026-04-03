import { useState } from "react";
import { Disclaimer } from "./Disclaimer.jsx";
import { calculerForfaits } from "./calcul.js";
import { MODES_DEF, TARIFS } from "./data.js";
import { ForfaitCard, Toggle, Card, SectionLabel, CalendrierRow } from "./components.jsx";

// ─── ÉCRAN CALCULATEUR ────────────────────────────────────────────────────────
function Calculateur() {
  const [mode,                setMode]                = useState(null);
  const [voieAbord,           setVoieAbord]           = useState("IV");
  const [nbPerfParJour,       setNbPerfParJour]       = useState(1);
  const [nbJours,             setNbJours]             = useState(14);
  const [deplacementDomicile, setDeplacementDomicile] = useState(true);
  const [typeVVC,             setTypeVVC]             = useState("PAC");
  const [nbActes,             setNbActes]             = useState(2);
  const [step,                setStep]                = useState(1); // 1=mode 2=params 3=résultats
  const [result,              setResult]              = useState(null);

  const currentMode = MODES_DEF.find(m => m.key === mode);

  function doCalcul() {
    const r = calculerForfaits({ mode, voieAbord, nbPerfParJour, nbJours, deplacementDomicile, typeVVC, nbActes });
    setResult(r);
    setStep(3);
  }

  function reset() {
    setMode(null); setResult(null); setStep(1);
    setNbPerfParJour(1); setNbJours(14);
    setDeplacementDomicile(true); setVoieAbord("IV");
  }

  // ── Aperçu gravité temps réel ──────────────────────────────────────────────
  const graviteApercu = () => {
    if (mode !== "GRAVITE") return null;
    const n        = nbPerfParJour;
    const semComp  = Math.floor(nbJours / 7);
    const joursR   = nbJours % 7;
    const semSuiv  = Math.max(0, semComp - 1);
    const perf28j  = n * 28;
    const casRare  = perf28j < 15;
    const fHebdo   = !casRare
      ? [null,
         { code: "PERFADOM 18" },
         { code: "PERFADOM 19" },
         { code: "PERFADOM 20" },
        ][Math.min(n, 3)]
      : null;
    return { n, semSuiv, joursR, f17qty: joursR * n, fHebdo, casRare, semComp };
  };
  const ga = graviteApercu();

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#f0f4ff", minHeight: "100vh" }}>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", padding: "22px 16px 34px", color: "white" }}>
        <div style={{ maxWidth: 660, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: "rgba(255,255,255,.18)", borderRadius: 12, padding: "7px 11px", fontSize: 22 }}>💊</div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.4px" }}>Calculateur PERFADOM</h1>
              <p style={{ opacity: .7, fontSize: 11, marginTop: 1 }}>Perfusion par gravité · Entretien PAC · Pharmaciens d'officine</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 660, margin: "-16px auto 0", padding: "0 13px 40px" }}>

        {/* ══ ÉTAPE 1 : CHOIX DU MODE ══════════════════════════════════════ */}
        {step === 1 && (
          <div className="fd">
            <Card>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>
                Que souhaitez-vous calculer ?
              </h2>
              <p style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>
                Sélectionnez le type de prise en charge
              </p>
              <div style={{ display: "grid", gap: 10 }}>
                {MODES_DEF.map(m => (
                  <div
                    key={m.key}
                    onClick={() => setMode(m.key)}
                    style={{
                      border: `2px solid ${mode === m.key ? m.col : "#e2e8f0"}`,
                      background: mode === m.key ? m.col + "10" : "white",
                      borderRadius: 13, padding: "14px 16px", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 13,
                      transition: "all .18s",
                      boxShadow: mode === m.key ? `0 0 0 3px ${m.col}28` : "none",
                    }}
                  >
                    <span style={{ fontSize: 26, flexShrink: 0 }}>{m.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: mode === m.key ? m.col : "#1e293b" }}>
                        {m.label}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{m.sub}</div>
                    </div>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                      border: `2px solid ${mode === m.key ? m.col : "#cbd5e1"}`,
                      background: mode === m.key ? m.col : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {mode === m.key && <div style={{ width: 6, height: 6, background: "white", borderRadius: "50%" }} />}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button className="bp" disabled={!mode} onClick={() => setStep(2)}>Suivant →</button>
            </div>
          </div>
        )}

        {/* ══ ÉTAPE 2 : PARAMÈTRES ══════════════════════════════════════════ */}
        {step === 2 && (
          <div className="fd">

            {/* ── GRAVITÉ ── */}
            {mode === "GRAVITE" && (
              <>
                <Card>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>🌊 Perfusion par gravité</h2>
                  <p style={{ fontSize: 12, color: "#64748b", marginBottom: 14 }}>Antibiothérapie, hydratation, soins palliatifs…</p>

                  {/* Voie d'abord */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 8 }}>
                      Voie d'abord <span style={{ color: "#94a3b8", fontWeight: 400 }}>(informatif)</span>
                    </label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[{ v: "IV", l: "🩸 Intraveineuse (IV)" }, { v: "SC", l: "💉 Sous-cutanée (SC)" }].map(o => (
                        <div
                          key={o.v}
                          onClick={() => setVoieAbord(o.v)}
                          style={{
                            flex: 1, padding: "10px 12px",
                            border: `2px solid ${voieAbord === o.v ? "#059669" : "#e2e8f0"}`,
                            borderRadius: 10, cursor: "pointer",
                            background: voieAbord === o.v ? "#f0fdf4" : "white",
                            textAlign: "center", fontWeight: 600, fontSize: 12,
                            color: voieAbord === o.v ? "#059669" : "#374151",
                          }}
                        >
                          {o.l}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nb perf/jour */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 8 }}>
                      Nombre de perfusions par jour
                    </label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[1, 2, 3].map(n => (
                        <div
                          key={n}
                          onClick={() => setNbPerfParJour(n)}
                          style={{
                            flex: 1, padding: "14px 8px",
                            border: `2px solid ${nbPerfParJour === n ? "#059669" : "#e2e8f0"}`,
                            borderRadius: 10, cursor: "pointer",
                            background: nbPerfParJour === n ? "#f0fdf4" : "white",
                            textAlign: "center", fontWeight: 800, fontSize: 22,
                            color: nbPerfParJour === n ? "#059669" : "#374151",
                          }}
                        >
                          {n}
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>
                      Maximum 3 perf/jour en gravité seule
                    </p>
                  </div>

                  {/* Durée */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 8 }}>
                      Durée de la cure
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, marginBottom: 10 }}>
                      {[7, 10, 14, 15, 21, 28].map(d => (
                        <div
                          key={d}
                          onClick={() => setNbJours(d)}
                          style={{
                            border: `2px solid ${nbJours === d ? "#059669" : "#e2e8f0"}`,
                            borderRadius: 9, padding: "9px 10px", cursor: "pointer",
                            background: nbJours === d ? "#f0fdf4" : "white",
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                          }}
                        >
                          <span style={{ fontWeight: 700, color: nbJours === d ? "#059669" : "#374151", fontSize: 13 }}>
                            {d}j
                          </span>
                          <span style={{ fontSize: 10, color: "#94a3b8" }}>{Math.ceil(d / 7)}s</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <input
                        type="number" min={1} max={365}
                        value={nbJours}
                        onChange={e => setNbJours(Math.max(1, parseInt(e.target.value) || 1))}
                        className="inp" style={{ maxWidth: 90 }}
                      />
                      <span style={{ fontSize: 13, color: "#64748b" }}>
                        jours → <strong style={{ color: "#059669" }}>{Math.ceil(nbJours / 7)} semaine{Math.ceil(nbJours / 7) > 1 ? "s" : ""}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Déplacement domicile */}
                  <Toggle
                    checked={deplacementDomicile}
                    onChange={setDeplacementDomicile}
                    label="Déplacement au domicile du patient"
                    sub="Obligatoire pour facturer PERFADOM 6 (installation + suivi). Si délivrance en officine uniquement : PERFADOM 6 non facturable."
                  />
                </Card>

                {/* Aperçu temps réel */}
                {ga && (
                  <Card style={{ background: "#f0fdf4", border: "1px solid #86efac" }}>
                    <div style={{ fontWeight: 700, color: "#15803d", fontSize: 13, marginBottom: 10 }}>
                      💡 Aperçu — {nbJours} jours, {nbPerfParJour} perf/jour
                    </div>
                    {ga.casRare ? (
                      <div style={{ fontSize: 12, color: "#92400e", background: "#fffbeb", borderRadius: 8, padding: "8px 11px", border: "1px solid #fcd34d" }}>
                        ⚠ &lt; 15 perf/28j → <strong>PERFADOM 17 uniquement</strong> à la perfusion{deplacementDomicile ? " (+ PERFADOM 6 sem. 1)" : ""}
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {deplacementDomicile && (
                          <ApercuChip color="#059669" code="PERFADOM 6 × 1" desc="Semaine 1 — installation + suivi (50,00 €)" />
                        )}
                        {ga.semSuiv > 0 && ga.fHebdo && (
                          <ApercuChip
                            color="#059669"
                            code={`${ga.fHebdo.code} × ${ga.semSuiv}`}
                            desc={`Semaine${ga.semSuiv > 1 ? "s" : ""} 2${ga.semSuiv > 1 ? `–${ga.semComp}` : ""} — consomm. hebdo (${TARIFS[ga.fHebdo.code]?.toFixed(2)} € × ${ga.semSuiv} = ${(TARIFS[ga.fHebdo.code] * ga.semSuiv).toFixed(2)} €)`}
                          />
                        )}
                        {ga.joursR > 0 && (
                          <ApercuChip
                            color="#d97706"
                            code={`PERFADOM 17 × ${ga.f17qty}`}
                            desc={`${ga.joursR} jour(s) résiduel(s) × ${nbPerfParJour} perf/j (${(11.8 * ga.f17qty).toFixed(2)} €)`}
                          />
                        )}
                      </div>
                    )}
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 10, borderTop: "1px solid #bbf7d0", paddingTop: 8 }}>
                      📅 Facturation à terme échu : J+6, J+13… Jamais à la délivrance.
                    </div>
                  </Card>
                )}
              </>
            )}

            {/* ── INTERCURE PAC ── */}
            {mode === "INTERCURE" && (
              <Card>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>🔧 Entretien chambre implantable</h2>
                <p style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>
                  Rinçage et entretien voie veineuse centrale — post-chimiothérapie
                </p>

                {/* Type VVC */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 8 }}>
                    Type d'accès veineux central
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[
                      { v: "PAC",  l: "Chambre implantable (PAC)",  code: "PERFADOM 21 — 10,00 €",  col: "#be185d" },
                      { v: "PICC", l: "PICC-LINE",                   code: "PERFADOM 22 — 19,50 €",  col: "#7c3aed" },
                    ].map(o => (
                      <div
                        key={o.v}
                        onClick={() => setTypeVVC(o.v)}
                        style={{
                          flex: 1, padding: "12px 13px",
                          border: `2px solid ${typeVVC === o.v ? o.col : "#e2e8f0"}`,
                          borderRadius: 10, cursor: "pointer",
                          background: typeVVC === o.v ? o.col + "10" : "white",
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: 13, color: typeVVC === o.v ? o.col : "#374151" }}>{o.l}</div>
                        <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{o.code}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nb actes */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 8 }}>
                    Nombre d'actes d'entretien
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <input
                      type="number" min={1} max={50}
                      value={nbActes}
                      onChange={e => setNbActes(Math.max(1, parseInt(e.target.value) || 1))}
                      className="inp" style={{ maxWidth: 90 }}
                    />
                    <span style={{ fontSize: 13, color: "#64748b" }}>
                      acte(s) → <strong style={{ color: "#be185d" }}>
                        {(nbActes * (typeVVC === "PICC" ? 19.5 : 10)).toFixed(2)} €
                      </strong>
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>
                    Facturation à l'acte — voie non mobilisée ≥ 7 jours requis
                  </p>
                </div>

                <div style={{ background: "#fdf2f8", border: "1px solid #f9a8d4", borderRadius: 9, padding: 11, fontSize: 11, color: "#9d174d", lineHeight: 1.6 }}>
                  ⚠ Non cumulable avec les forfaits consommables de la même VVC sur la même période.<br />
                  Prescriptible par un <strong>médecin ou un infirmier</strong>.
                </div>
              </Card>
            )}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button className="bo" onClick={() => setStep(1)}>← Retour</button>
              <button className="bp" onClick={doCalcul}>Calculer →</button>
            </div>
          </div>
        )}

        {/* ══ ÉTAPE 3 : RÉSULTATS ═══════════════════════════════════════════ */}
        {step === 3 && result && (
          <div className="fd">
            {/* Récap */}
            <div style={{
              background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
              color: "white", borderRadius: 15, padding: "15px 18px", marginBottom: 13,
            }}>
              <div style={{ fontSize: 11, opacity: .65, marginBottom: 7 }}>Récapitulatif</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[
                  currentMode && `${currentMode.icon} ${currentMode.label}`,
                  mode === "GRAVITE" && `Voie ${voieAbord}`,
                  mode === "GRAVITE" && `${nbPerfParJour} perf/jour`,
                  mode === "GRAVITE" && `${nbJours} jours`,
                  mode === "INTERCURE" && `${nbActes} acte(s)`,
                  mode === "INTERCURE" && (typeVVC === "PICC" ? "PICC-LINE" : "Chambre implantable (PAC)"),
                ].filter(Boolean).map((b, i) => (
                  <span key={i} style={{ background: "rgba(255,255,255,.18)", borderRadius: 7, padding: "2px 10px", fontSize: 11 }}>{b}</span>
                ))}
              </div>
            </div>

            {/* Alertes */}
            {result.alertes.length > 0 && (
              <Card>
                <div style={{ fontWeight: 700, color: "#92400e", fontSize: 13, marginBottom: 9 }}>⚠ Points d'attention</div>
                {result.alertes.map((a, i) => <div key={i} className="alerte">{a}</div>)}
              </Card>
            )}

            {/* Synthèse gravité cas courant */}
            {mode === "GRAVITE" && result.detailGravite?.cas === "courant" && (
              <Card style={{ background: "#f0fdf4", border: "1px solid #86efac" }}>
                <div style={{ fontWeight: 700, color: "#15803d", fontSize: 13, marginBottom: 11 }}>
                  📊 Décomposition des forfaits
                </div>
                <div style={{ display: "grid", gap: 7 }}>
                  {[
                    deplacementDomicile && { icon: "1️⃣", code: "PERFADOM 6 × 1", desc: "Semaine 1 — installation + suivi inclus", total: 50, border: "#bbf7d0" },
                    result.detailGravite.fHebdoQty > 0 && {
                      icon: "📅",
                      code: `${result.detailGravite.fHebdoCode} × ${result.detailGravite.fHebdoQty}`,
                      desc: `Semaine${result.detailGravite.fHebdoQty > 1 ? "s" : ""} 2${result.detailGravite.fHebdoQty > 1 ? `–${result.detailGravite.fHebdoQty + 1}` : ""} — consommables hebdo`,
                      total: (TARIFS[result.detailGravite.fHebdoCode] ?? 0) * result.detailGravite.fHebdoQty,
                      border: "#bbf7d0",
                    },
                    result.detailGravite.joursRes > 0 && {
                      icon: "🔢",
                      code: `PERFADOM 17 × ${result.detailGravite.f17Res}`,
                      desc: `${result.detailGravite.joursRes} j résiduel(s) × ${result.detailGravite.n} perf/j — à la perfusion`,
                      total: 11.8 * result.detailGravite.f17Res,
                      border: "#fde68a",
                    },
                  ].filter(Boolean).map((row, i) => (
                    <div key={i} style={{ background: "white", borderRadius: 9, padding: "9px 13px", border: `1px solid ${row.border}`, display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ fontSize: 17 }}>{row.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "#166534" }}>{row.code}</div>
                        <div style={{ fontSize: 11, color: "#4b5563" }}>{row.desc}</div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "#166534", flexShrink: 0 }}>
                        {row.total.toFixed(2)} €
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Forfaits */}
            {result.installation.length > 0 && (
              <Card>
                <SectionLabel bg="#ede9fe" color="#7c3aed">Installation</SectionLabel>
                {result.installation.map((x, i) => <ForfaitCard key={i} item={x} type="installation" />)}
              </Card>
            )}
            {result.consommables.length > 0 && (
              <Card>
                <SectionLabel bg="#d1fae5" color="#065f46">Consommables & Accessoires</SectionLabel>
                {result.consommables.map((x, i) => <ForfaitCard key={i} item={x} type="consommables" />)}
              </Card>
            )}
            {result.entretien.length > 0 && (
              <Card>
                <SectionLabel bg="#fef3c7" color="#92400e">Entretien intercure</SectionLabel>
                {result.entretien.map((x, i) => <ForfaitCard key={i} item={x} type="entretien" />)}
              </Card>
            )}

            {/* Calendrier */}
            {result.calendrier.length > 0 && (
              <Card>
                <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 13, marginBottom: 11 }}>📅 Calendrier de facturation</div>
                <div style={{ fontSize: 11, color: "#64748b", background: "#f8fafc", borderRadius: 7, padding: 9, marginBottom: 10 }}>
                  J = jour de la 1ère perfusion effective au domicile. Facturation à terme échu — jamais à la délivrance.
                </div>
                {result.calendrier.map((row, i) => <CalendrierRow key={i} label={row.label} forfaits={row.forfaits} />)}
              </Card>
            )}

            {/* Sources */}
            <Card style={{ background: "#f8fafc" }}>
              <div style={{ fontWeight: 700, color: "#64748b", fontSize: 11, marginBottom: 6 }}>📚 Sources réglementaires</div>
              <div style={{ fontSize: 10.5, color: "#94a3b8", lineHeight: 1.8 }}>
                <div>• Circulaire CNAMTS CIR-3/2022 — Modalités PERFADOM</div>
                <div>• Arrêté du 26/06/2019 (JO 27/06/2019) — Nomenclature LPP</div>
                <div>• OMéDIT Normandie — Support nomenclature v3</div>
                <div>• OMéDIT Île-de-France — Fiche pharmaciens d'officine (nov. 2024)</div>
              </div>
            </Card>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button className="bo" onClick={() => { setResult(null); setStep(2); }}>← Modifier</button>
              <button className="bp" onClick={reset}>Nouveau calcul</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Petit composant aperçu ───────────────────────────────────────────────────
function ApercuChip({ color, code, desc }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <span style={{ background: color, color: "white", borderRadius: 5, padding: "2px 9px", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
        {code}
      </span>
      <span style={{ fontSize: 11, color: "#374151" }}>{desc}</span>
    </div>
  );
}

// ─── POINT D'ENTRÉE ───────────────────────────────────────────────────────────
export default function App() {
  const [accepted, setAccepted] = useState(false);
  return accepted ? <Calculateur /> : <Disclaimer onAccept={() => setAccepted(true)} />;
}
