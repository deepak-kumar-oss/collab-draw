import { useState } from "react";
import { useCanvas } from "../context/CanvasContext";

const PALETTE = [
  "#1a1a2e","#16213e","#0f3460","#533483","#e94560",
  "#ffffff","#f5f5f5","#d4d4d4","#737373","#404040",
  "#ef4444","#f97316","#eab308","#22c55e","#06b6d4",
  "#3b82f6","#8b5cf6","#ec4899","#14b8a6","#84cc16",
  "#fca5a5","#fdba74","#fde68a","#86efac","#67e8f9",
  "#93c5fd","#c4b5fd","#f9a8d4","#5eead4","#d9f99d",
  "#7f1d1d","#7c2d12","#713f12","#14532d","#164e63",
  "#1e3a8a","#3b0764","#831843","#134e4a","#365314",
];

const ColorPicker = () => {
  const { color, setColor, opacity, setOpacity, lineWidth, setLineWidth } = useCanvas();
  const [recent, setRecent] = useState([]);

  const pickColor = (c) => {
    setColor(c);
    setRecent(prev => [c, ...prev.filter(x => x !== c)].slice(0, 8));
  };

  return (
    <aside style={{
      width: "200px",
      background: "var(--panel)",
      borderLeft: "1px solid var(--border)",
      padding: "16px 12px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      overflowY: "auto",
    }}>
  
      <div>
        <div style={{ fontSize: "11px", color: "var(--text-dim)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Color</div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "8px",
            background: color,
            border: "2px solid var(--border)",
            flexShrink: 0,
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
            position: "relative",
            overflow: "hidden",
          }}>
            <input
              type="color"
              value={color}
              onChange={e => pickColor(e.target.value)}
              style={{
                position: "absolute", inset: 0, opacity: 0,
                width: "100%", height: "100%", cursor: "pointer",
              }}
            />
          </div>
          <input
            type="text"
            value={color}
            onChange={e => {
              if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) pickColor(e.target.value);
            }}
            style={{
              flex: 1, background: "var(--input-bg)",
              border: "1px solid var(--border)", borderRadius: "6px",
              color: "var(--text)", padding: "6px 8px",
              fontSize: "12px", fontFamily: "monospace",
            }}
          />
        </div>
      </div>

      <div>
        <div style={{ fontSize: "11px", color: "var(--text-dim)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Palette</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "3px" }}>
          {PALETTE.map(c => (
            <button
              key={c}
              onClick={() => pickColor(c)}
              title={c}
              style={{
                width: "18px", height: "18px", borderRadius: "3px",
                background: c,
                border: color === c ? "2px solid var(--accent)" : "1px solid rgba(255,255,255,0.15)",
                cursor: "pointer", padding: 0,
                transition: "transform 0.1s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.3)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            />
          ))}
        </div>
      </div>

   
      {recent.length > 0 && (
        <div>
          <div style={{ fontSize: "11px", color: "var(--text-dim)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Recent</div>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {recent.map((c, i) => (
              <button
                key={i}
                onClick={() => pickColor(c)}
                style={{
                  width: "22px", height: "22px", borderRadius: "4px",
                  background: c, border: "1px solid var(--border)",
                  cursor: "pointer", padding: 0,
                }}
              />
            ))}
          </div>
        </div>
      )}

  
      <div>
        <div style={{ fontSize: "11px", color: "var(--text-dim)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Opacity — {Math.round(opacity * 100)}%
        </div>
        <input type="range" min="0.05" max="1" step="0.05"
          value={opacity}
          onChange={e => setOpacity(parseFloat(e.target.value))}
          style={{ width: "100%", accentColor: "var(--accent)" }}
        />
      </div>

  
      <div>
        <div style={{ fontSize: "11px", color: "var(--text-dim)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Brush size — {lineWidth}px
        </div>
        <input type="range" min="1" max="80" step="1"
          value={lineWidth}
          onChange={e => setLineWidth(parseInt(e.target.value))}
          style={{ width: "100%", accentColor: "var(--accent)" }}
        />
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          marginTop: "8px",
          width: "100%", height: "40px",
        }}>
          <div style={{
            borderRadius: "50%",
            width: `${Math.min(lineWidth, 40)}px`,
            height: `${Math.min(lineWidth, 40)}px`,
            background: color,
            opacity,
            transition: "all 0.15s",
          }} />
        </div>
      </div>
    </aside>
  );
};

export default ColorPicker;
