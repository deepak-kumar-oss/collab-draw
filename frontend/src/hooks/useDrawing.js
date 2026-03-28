import { useCallback } from "react";
import { useCanvas } from "../context/CanvasContext";
import { applyContextSettings, drawShape, floodFill, getColorAtPixel } from "../utils/drawingUtils";

export const useDrawing = () => {
  const {
    canvasRef, contextRef, snapshotRef,
    startX, startY, isDrawing, currentPathRef,
    tool, color, lineWidth, opacity, fillShape,
    saveSnapshot, setColor, setCursorPos,
  } = useCanvas();

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) {
      return {
        offsetX: (e.touches[0].clientX - rect.left) * scaleX,
        offsetY: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      offsetX: (e.clientX - rect.left) * scaleX,
      offsetY: (e.clientY - rect.top) * scaleY,
    };
  };

  const onPointerDown = useCallback((e) => {
    e.preventDefault();
    const ctx = contextRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    const { offsetX, offsetY } = getPos(e);

    if (tool === "fill") {
      saveSnapshot();
      applyContextSettings(ctx, color, lineWidth, opacity, tool);
      floodFill(canvas, ctx, offsetX, offsetY, color);
      return;
    }
    if (tool === "eyedropper") {
      const picked = getColorAtPixel(canvas, ctx, offsetX, offsetY);
      setColor(picked);
      return;
    }

    saveSnapshot();
    applyContextSettings(ctx, color, lineWidth, opacity, tool);

    isDrawing.current = true;
    startX.current = offsetX;
    startY.current = offsetY;

    if (["pen", "eraser", "highlighter"].includes(tool)) {
      currentPathRef.current = [{ x: offsetX, y: offsetY }];
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
      if (tool === "highlighter") {
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = lineWidth * 4;
      }
    } else {
      snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
  }, [tool, color, lineWidth, opacity, fillShape]);

  const onPointerMove = useCallback((e) => {
    e.preventDefault();
    const ctx = contextRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas || !isDrawing.current) return;
    const { offsetX, offsetY } = getPos(e);
    setCursorPos({ x: offsetX, y: offsetY });
    setCursorPos({ x: Math.round(offsetX), y: Math.round(offsetY) });
    if (!isDrawing.current) return;

    if (["pen", "eraser", "highlighter"].includes(tool)) {
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    } else {
      ctx.putImageData(snapshotRef.current, 0, 0);
      applyContextSettings(ctx, color, lineWidth, opacity, tool);
      drawShape(ctx, tool, startX.current, startY.current, offsetX, offsetY, fillShape);
    }
  }, [tool, color, lineWidth, opacity, fillShape]);

  const onPointerUp = useCallback((e) => {
    e.preventDefault();
    isDrawing.current = false;
  }, []);

  
  return { onPointerDown, onPointerMove, onPointerUp };
};
