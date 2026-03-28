
import { useCanvas } from "../context/CanvasContext";
import { useExport } from "../hooks/useExport";

const MenuBar = () => {
  const { clearCanvas, undo, redo, canUndo, canRedo } = useCanvas();
  const { downloadAs, copyToClipboard } = useExport();

  return (
    <header style={{
      height: "48px",
      background: "var(--panel)",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      padding: "0 20px",
      gap: "8px",
      flexShrink: 0,
      zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        marginRight: "20px",
      }}>
        <div style={{
          width: "28px", height: "28px", borderRadius: "7px",
          background: "linear-gradient(135deg, var(--accent), #a855f7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "15px",
        }}>✏️</div>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "17px", fontWeight: 700,
          color: "var(--text)",
          letterSpacing: "-0.02em",
        }}>Canvas</span>
      </div>

      {/* File menu items */}
      {[
        { label: "New", onClick: clearCanvas },
        { label: "Undo", onClick: undo, disabled: !canUndo },
        { label: "Redo", onClick: redo, disabled: !canRedo },
        { label: "Copy", onClick: copyToClipboard },
      ].map(item => (
        <button
          key={item.label}
          onClick={item.onClick}
          disabled={item.disabled}
          style={{
            background: "none",
            border: "1px solid transparent",
            borderRadius: "5px",
            color: item.disabled ? "var(--text-disabled)" : "var(--text-dim)",
            padding: "4px 10px",
            fontSize: "13px",
            cursor: item.disabled ? "not-allowed" : "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { if (!item.disabled) { e.currentTarget.style.background = "var(--hover)"; e.currentTarget.style.borderColor = "var(--border)"; }}}
          onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "transparent"; }}
        >
          {item.label}
        </button>
      ))}

      <span style={{ flex: 1 }} />

      {/* Export buttons */}
      <div style={{ display: "flex", gap: "6px" }}>
        {["png", "jpg", "svg"].map(fmt => (
          <button
            key={fmt}
            onClick={() => downloadAs(fmt)}
            style={{
              background: fmt === "png" ? "var(--accent)" : "var(--hover)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              color: fmt === "png" ? "#fff" : "var(--text)",
              padding: "5px 12px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.04em",
              transition: "all 0.15s",
            }}
          >
            Export {fmt.toUpperCase()}
          </button>
        ))}
      </div>
    </header>
  );
};

export default MenuBar;
