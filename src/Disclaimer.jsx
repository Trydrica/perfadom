import { useState } from "react";

export function Disclaimer({ onAccept }) {
  const [checked, setChecked] = useState(false);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px 16px",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={{ maxWidth: 560, width: "100%" }}>

        {/* Logo / titre */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 60, height: 60, borderRadius: 16,
            background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
            fontSize: 28, marginBottom: 14, boxShadow: "0 8px 24px rgba(79,70,229,.3)",
          }}>💊</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e293b", letterSpacing: "-.4px" }}>
            Calculateur PERFADOM
          </h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
            Aide à la facturation · Pharmaciens d'officine
          </p>
        </div>

        {/* Carte principale */}
        <div style={{
          background: "white", borderRadius: 20,
          boxShadow: "0 4px 24px rgba(0,0,0,.08)",
          overflow: "hidden",
        }}>
          {/* Bandeau avertissement */}
          <div style={{
            background: "linear-gradient(135deg,#fef3c7,#fde68a)",
            borderBottom: "1px solid #fcd34d",
            padding: "14px 20px",
            display: "flex", alignItems: "flex-start", gap: 10,
          }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#92400e" }}>
                Outil d'aide — pas un substitut à la réglementation
              </div>
              <div style={{ fontSize: 12, color: "#78350f", marginTop: 2 }}>
                Lisez les informations ci-dessous avant d'utiliser cet outil.
              </div>
            </div>
          </div>

          {/* Corps */}
          <div style={{ padding: "20px 22px" }}>

            {/* Ce que l'outil fait */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>
                ✅ Ce que cet outil couvre
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                {[
                  { icon: "🌊", text: "Perfusions par gravité (IV et SC) — les plus fréquentes en officine de ville" },
                  { icon: "🔧", text: "Entretien intercure des chambres implantables (PAC) post-chimiothérapie" },
                  { icon: "📅", text: "Calcul des forfaits PERFADOM 6, 17, 18, 19, 20, 21" },
                  { icon: "🗓", text: "Calendrier de facturation à terme échu (J+6, J+13…)" },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 9, alignItems: "flex-start",
                    background: "#f0fdf4", borderRadius: 8, padding: "7px 10px",
                    border: "1px solid #bbf7d0",
                  }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: 12, color: "#374151" }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ce que l'outil ne couvre PAS */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>
                ❌ Ce que cet outil ne couvre pas
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                {[
                  "Systèmes actifs électriques (pompes, PSE) — gérés par prestataire",
                  "Diffuseurs élastométriques — gérés par prestataire",
                  "Immunoglobulines intraveineuses (PERFADOM 41–44)",
                  "Nutrition parentérale à domicile (NPAD)",
                  "Transfusion de produits sanguins labiles (PSL)",
                  "Règles de non-cumul entre plusieurs modes simultanés",
                  "Cas complexes et situations particulières (HAD, décès en cours de cure…)",
                ].map((text, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 9, alignItems: "flex-start",
                    background: "#fef2f2", borderRadius: 8, padding: "7px 10px",
                    border: "1px solid #fecaca",
                  }}>
                    <span style={{ fontSize: 12, color: "#ef4444", flexShrink: 0 }}>✗</span>
                    <span style={{ fontSize: 12, color: "#374151" }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sources */}
            <div style={{
              background: "#f8fafc", borderRadius: 10, padding: "10px 13px",
              border: "1px solid #e2e8f0", marginBottom: 20,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 5 }}>
                📚 Sources réglementaires utilisées
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.7 }}>
                Circulaire CNAMTS CIR-3/2022 · Arrêté du 26/06/2019 (JO 27/06/2019)<br />
                OMéDIT Normandie v3 · OMéDIT Île-de-France (nov. 2024)
              </div>
              <div style={{ fontSize: 11, color: "#f59e0b", marginTop: 6, fontWeight: 600 }}>
                ⚠ Les tarifs LPP peuvent évoluer — vérifiez toujours sur ameli.fr et legifrance.gouv.fr
              </div>
            </div>

            {/* Case à cocher */}
            <div
              onClick={() => setChecked(c => !c)}
              style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                cursor: "pointer", padding: "12px 14px",
                background: checked ? "#eef2ff" : "#f8fafc",
                borderRadius: 10,
                border: `2px solid ${checked ? "#4f46e5" : "#e2e8f0"}`,
                transition: "all .2s", marginBottom: 16,
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                border: `2px solid ${checked ? "#4f46e5" : "#cbd5e1"}`,
                background: checked ? "#4f46e5" : "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginTop: 1, transition: "all .2s",
              }}>
                {checked && <span style={{ color: "white", fontSize: 13, lineHeight: 1 }}>✓</span>}
              </div>
              <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>
                J'ai pris connaissance des limites de cet outil. Je l'utilise comme{" "}
                <strong>aide à la facturation</strong>, en complément de la réglementation en vigueur,
                et non comme référence exclusive.
              </span>
            </div>

            {/* Bouton */}
            <button
              disabled={!checked}
              onClick={onAccept}
              style={{
                width: "100%", padding: "13px",
                background: checked ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "#e2e8f0",
                color: checked ? "white" : "#94a3b8",
                border: "none", borderRadius: 12,
                fontSize: 15, fontWeight: 700, cursor: checked ? "pointer" : "default",
                transition: "all .25s", fontFamily: "inherit",
                boxShadow: checked ? "0 4px 14px rgba(79,70,229,.4)" : "none",
              }}
            >
              {checked ? "Accéder au calculateur →" : "Cochez la case pour continuer"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", marginTop: 16 }}>
          Outil non officiel · Aucune responsabilité en cas d'erreur de facturation
        </p>
      </div>
    </div>
  );
}
