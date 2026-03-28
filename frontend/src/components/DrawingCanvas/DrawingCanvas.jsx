import { useEffect, useRef } from "react";
import { useCanvas } from "../../context/CanvasContext";
import { useDrawing } from "../../hooks/useDrawing";

const CANVAS_W = 1200;
const CANVAS_H = 700;

const DrawingCanvas = () => {
  const { canvasRef, contextRef, tool, color, lineWidth } = useCanvas();
  const { onPointerDown, onPointerMove, onPointerUp } = useDrawing();
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    contextRef.current = ctx;

    // Checkerboard background to represent transparency
    const pattern = document.createElement("canvas");
    pattern.width = 20; pattern.height = 20;
    const pctx = pattern.getContext("2d");
    pctx.fillStyle = "#e8e8e8";
    pctx.fillRect(0, 0, 20, 20);
    pctx.fillStyle = "#c8c8c8";
    pctx.fillRect(0, 0, 10, 10);
    pctx.fillRect(10, 10, 10, 10);
  }, []);

  const getCursor = () => {
    switch (tool) {
      case "pen": return "crosshair";
      case "eraser": return "cell";
      case "fill": return "copy";
      case "eyedropper": return "zoom-in";
      case "highlighter": return "text";
      default: return "crosshair";
    }
  };

  return (
    <div
      ref={wrapRef}
      className="canvas-wrapper"
      style={{
        flex: 1,
        overflow: "auto",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: "24px",
        background: "var(--bg-dots)",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          cursor: getCursor(),
          borderRadius: "4px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
          background: "#fff",
          display: "block",
          maxWidth: "100%",
          touchAction: "none",
        }}
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onMouseLeave={onPointerUp}
        onTouchStart={onPointerDown}
        onTouchMove={onPointerMove}
        onTouchEnd={onPointerUp}
      />
    </div>
  );
};

export default DrawingCanvas;
