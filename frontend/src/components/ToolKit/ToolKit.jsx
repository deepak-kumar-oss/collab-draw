import { useCanvas } from "../../context/CanvasContext";
import { useExport } from "../../hooks/useExport.js";

const TOOLS = [
  { id: "pen",         icon: "✏️",  label: "Pen",         group: "draw" },
  { id: "highlighter", icon: "🖊️",  label: "Highlighter", group: "draw" },
  { id: "eraser",      icon: "🧹",  label: "Eraser",      group: "draw" },
  { id: "fill",        icon: "🪣",  label: "Fill",        group: "draw" },
  { id: "eyedropper",  icon: "💉",  label: "Eyedropper",  group: "draw" },
  { id: "line",        icon: "╱",   label: "Line",        group: "shapes" },
  { id: "rect",        icon: "▭",   label: "Rectangle",   group: "shapes" },
  { id: "circle",      icon: "○",   label: "Circle",      group: "shapes" },
  { id: "triangle",    icon: "△",   label: "Triangle",    group: "shapes" },
  { id: "diamond",     icon: "◇",   label: "Diamond",     group: "shapes" },
  { id: "arrow",       icon: "→",   label: "Arrow",       group: "shapes" },
];

const Toolbar = () => {
  const {
    tool, setTool,
    lineWidth, setLineWidth,
    fillShape, setFillShape,
    undo, redo, clearCanvas,
    canUndo, canRedo,
  } = useCanvas();
  const { downloadAs, copyToClipboard } = useExport();

  const drawTools = TOOLS.filter(t => t.group === "draw");
  const shapeTools = TOOLS.filter(t => t.group === "shapes");

  const ToolBtn = ({ t }) => (
    <button
      key={t.id}
      title={t.label}
      onClick={() => setTool(t.id)}
      style={{
        width: "40px", height: "40px",
        borderRadius: "8px",
        border: tool === t.id ? "2px solid var(--accent)" : "2px solid transparent",
        background: tool === t.id ? "var(--accent-dim)" : "transparent",
        color: tool === t.id ? "var(--accent)" : "var(--text-dim)",
        fontSize: "16px",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s",
      }}
      onMouseEnter={e => { if (tool !== t.id) e.currentTarget.style.background = "var(--hover)"; }}
      onMouseLeave={e => { if (tool !== t.id) e.currentTarget.style.background = "transparent"; }}
    >
      {t.icon}
    </button>
  );

  const ActionBtn = ({ onClick, disabled, title, children, danger }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        width: "40px", height: "40px",
        borderRadius: "8px",
        border: "2px solid transparent",
        background: "transparent",
        color: disabled ? "var(--text-disabled)" : danger ? "var(--danger)" : "var(--text-dim)",
        fontSize: "15px",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );

  return (
    <aside style={{
      width: "60px",
      background: "var(--panel)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "12px 8px",
      gap: "4px",
      overflowY: "auto",
    }}>
   
      {drawTools.map(t => <ToolBtn key={t.id} t={t} />)}

      <div style={{ width: "32px", height: "1px", background: "var(--border)", margin: "6px 0" }} />

      {shapeTools.map(t => <ToolBtn key={t.id} t={t} />)}

      <div style={{ width: "32px", height: "1px", background: "var(--border)", margin: "6px 0" }} />

     
      <button
        title={fillShape ? "Filled" : "Outline"}
        onClick={() => setFillShape(f => !f)}
        style={{
          width: "40px", height: "40px",
          borderRadius: "8px",
          border: "2px solid var(--border)",
          background: fillShape ? "var(--accent-dim)" : "transparent",
          color: fillShape ? "var(--accent)" : "var(--text-dim)",
          fontSize: "13px",
          cursor: "pointer",
        }}
      >
        {fillShape ? "■" : "□"}
      </button>

      {[2, 4, 8, 16].map(w => (
        <button
          key={w}
          title={`${w}px`}
          onClick={() => setLineWidth(w)}
          style={{
            width: "40px", height: "30px",
            borderRadius: "6px",
            border: lineWidth === w ? "2px solid var(--accent)" : "2px solid transparent",
            background: lineWidth === w ? "var(--accent-dim)" : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <div style={{
            width: "22px", height: `${Math.min(w, 10)}px`,
            borderRadius: "3px",
            background: lineWidth === w ? "var(--accent)" : "var(--text-dim)",
          }} />
        </button>
      ))}

      <div style={{ flex: 1 }} />
      <div style={{ width: "32px", height: "1px", background: "var(--border)", margin: "6px 0" }} />

  
      <ActionBtn onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">↩</ActionBtn>
      <ActionBtn onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)">↪</ActionBtn>
      <ActionBtn onClick={() => copyToClipboard()} title="Copy to Clipboard">⎘</ActionBtn>
      <ActionBtn onClick={() => downloadAs("png")} title="Download PNG">⤓</ActionBtn>
      <ActionBtn onClick={clearCanvas} danger title="Clear Canvas">🗑</ActionBtn>
    </aside>
  );
};

export default Toolbar;
