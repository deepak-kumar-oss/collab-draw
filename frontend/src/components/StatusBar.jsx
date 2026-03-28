import { useCanvas } from "../context/CanvasContext";
import { useExport } from "../hooks/useExport";

const StatusBar = () => {
  const { cursorPos, zoom, setZoom, tool, color, lineWidth, canUndo, canRedo, undo, redo, clearCanvas } = useCanvas();
  const { downloadAs } = useExport();

  return (
    <footer style={{
      height: "36px",
      background: "var(--panel)",
      borderTop: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      padding: "0 16px",
      gap: "20px",
      fontSize: "12px",
      color: "var(--text-dim)",
      flexShrink: 0,
    }}>
      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ opacity: 0.5 }}>X</span>{cursorPos.x}
        <span style={{ opacity: 0.5, marginLeft: "4px" }}>Y</span>{cursorPos.y}
      </span>

      <span style={{ width: "1px", height: "16px", background: "var(--border)" }} />

      <span>
        Tool: <strong style={{ color: "var(--text)" }}>{tool}</strong>
      </span>

      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        Color:
        <span style={{
          width: "14px", height: "14px", borderRadius: "3px",
          background: color, border: "1px solid var(--border)",
          display: "inline-block",
        }} />
        <strong style={{ color: "var(--text)", fontFamily: "monospace" }}>{color}</strong>
      </span>

      <span>Size: <strong style={{ color: "var(--text)" }}>{lineWidth}px</strong></span>

      <span style={{ flex: 1 }} />

      {/* History */}
      <button
        disabled={!canUndo}
        onClick={undo}
        style={{
          background: "none", border: "none",
          color: canUndo ? "var(--text-dim)" : "var(--text-disabled)",
          cursor: canUndo ? "pointer" : "not-allowed", fontSize: "13px",
        }}
        title="Undo"
      >↩ Undo</button>
      <button
        disabled={!canRedo}
        onClick={redo}
        style={{
          background: "none", border: "none",
          color: canRedo ? "var(--text-dim)" : "var(--text-disabled)",
          cursor: canRedo ? "pointer" : "not-allowed", fontSize: "13px",
        }}
        title="Redo"
      >↪ Redo</button>

      {/* Export */}
      {["png", "jpg", "svg"].map(fmt => (
        <button
          key={fmt}
          onClick={() => downloadAs(fmt)}
          style={{
            background: "var(--accent)", border: "none",
            color: "#fff", borderRadius: "5px",
            padding: "2px 10px", fontSize: "11px",
            cursor: "pointer", fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          ↓ {fmt.toUpperCase()}
        </button>
      ))}

      {/* Zoom */}
      <select
        value={zoom}
        onChange={e => setZoom(Number(e.target.value))}
        style={{
          background: "var(--input-bg)", border: "1px solid var(--border)",
          color: "var(--text)", borderRadius: "5px",
          padding: "2px 6px", fontSize: "11px",
        }}
      >
        {[25, 50, 75, 100, 150, 200].map(z => (
          <option key={z} value={z}>{z}%</option>
        ))}
      </select>
    </footer>
  );
};

export default StatusBar;
