import { TARIFS } from "./data.js";

// ─── ForfaitCard ──────────────────────────────────────────────────────────────
export const ForfaitCard = ({ item, type }) => {
  const cfg = {
    installation: { border: "#a78bfa", bg: "#f5f3ff", color: "#7c3aed" },
    consommables: { border: "#34d399", bg: "#f0fdf4", color: "#065f46" },
    entretien:    { border: "#fbbf24", bg: "#fffbeb", color: "#92400e" },
  }[type] ?? { border: "#94a3b8", bg: "#f8fafc", color: "#475569" };

  const tarif = TARIFS[item.code] ?? null;

  return (
    <div style={{
      borderLeft: `4px solid ${cfg.border}`,
      background: cfg.bg,
      borderRadius: "0 10px 10px 0",
      padding: "11px 13px",
      marginBottom: 8,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 7 }}>
            <span style={{ fontWeight: 800, color: "#1e293b", fontSize: 14 }}>{item.code}</span>
            <span style={{ fontSize: 10, color: "#94a3b8", fontFamily: "monospace" }}>LPP {item.lpp}</span>
            {tarif != null && (
              <span style={{
                background: "white", border: `1px solid ${cfg.border}`,
                color: cfg.color, borderRadius: 5, padding: "1px 7px",
                fontSize: 11, fontWeight: 700,
              }}>
                {tarif.toFixed(2)} €
              </span>
            )}
          </div>
          <div style={{ color: "#475569", fontSize: 13, marginTop: 3 }}>{item.label}</div>
          {item.note && (
            <div style={{ color: "#92400e", fontSize: 11, marginTop: 4, fontStyle: "italic" }}>
              {item.note}
            </div>
          )}
        </div>
        {item.qty != null && (
          <div style={{
            textAlign: "center", minWidth: 52,
            background: "white", borderRadius: 8,
            padding: "5px 8px", border: `1px solid ${cfg.border}`,
            flexShrink: 0,
          }}>
            <div style={{ fontSize: 19, fontWeight: 800, color: cfg.color, lineHeight: 1 }}>
              ×{item.qty}
            </div>
            {tarif != null && item.qty > 1 && (
              <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 1 }}>
                {(tarif * item.qty).toFixed(2)} €
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Toggle ───────────────────────────────────────────────────────────────────
export const Toggle = ({ checked, onChange, label, sub }) => (
  <div
    style={{
      display: "flex", alignItems: "flex-start", gap: 12,
      padding: "10px 0", borderBottom: "1px solid #f1f5f9", cursor: "pointer",
    }}
    onClick={() => onChange(!checked)}
  >
    <div style={{
      width: 42, height: 23,
      background: checked ? "#4f46e5" : "#cbd5e1",
      borderRadius: 12, position: "relative",
      flexShrink: 0, transition: "background .2s", marginTop: 2,
    }}>
      <div style={{
        position: "absolute", top: 3, left: checked ? 21 : 3,
        width: 17, height: 17,
        background: "white", borderRadius: "50%",
        transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)",
      }} />
    </div>
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);

// ─── Card ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, style = {} }) => (
  <div style={{
    background: "white", borderRadius: 16,
    padding: "18px 20px",
    boxShadow: "0 2px 8px rgba(0,0,0,.06)",
    marginBottom: 13,
    ...style,
  }}>
    {children}
  </div>
);

// ─── SectionLabel ─────────────────────────────────────────────────────────────
export const SectionLabel = ({ children, bg, color }) => (
  <div style={{
    fontWeight: 700, fontSize: 12, marginBottom: 9,
    background: bg, color,
    display: "inline-block", borderRadius: 6, padding: "2px 9px",
  }}>
    {children}
  </div>
);

// ─── CalendrierRow ────────────────────────────────────────────────────────────
export const CalendrierRow = ({ label, forfaits }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 9,
    padding: "8px 0", borderBottom: "1px solid #f1f5f9",
  }}>
    <div style={{
      background: "#4f46e5", color: "white",
      borderRadius: 7, padding: "3px 9px",
      fontSize: 11, fontWeight: 700,
      minWidth: 130, textAlign: "center", flexShrink: 0,
    }}>
      {label}
    </div>
    <div style={{ flex: 1, fontSize: 12, color: "#475569" }}>
      {forfaits.join(" + ")}
    </div>
  </div>
);
