import { createContext, useContext, useRef, useState } from "react";

const CanvasContext = createContext(null);

export const CanvasProvider = ({ children }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const snapshotRef = useRef(null);
  const startX = useRef(null);
  const startY = useRef(null);
  const isDrawing = useRef(false);
  const historyRef = useRef([]);
  const redoStackRef = useRef([]);
  const currentPathRef = useRef([]);

  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#1a1a2e");
  const [lineWidth, setLineWidth] = useState(4);
  const [opacity, setOpacity] = useState(1);
  const [fillShape, setFillShape] = useState(false);
  const [layers, setLayers] = useState([{ id: 1, name: "Layer 1", visible: true, opacity: 1 }]);
  const [activeLayer, setActiveLayer] = useState(1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const saveSnapshot = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyRef.current.push(imageData);
    redoStackRef.current = [];
    setCanUndo(true);
    setCanRedo(false);
  };

  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx || historyRef.current.length === 0) return;
    const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    redoStackRef.current.push(current);
    const prev = historyRef.current.pop();
    ctx.putImageData(prev, 0, 0);
    setCanUndo(historyRef.current.length > 0);
    setCanRedo(true);
  };

  const redo = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx || redoStackRef.current.length === 0) return;
    const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyRef.current.push(current);
    const next = redoStackRef.current.pop();
    ctx.putImageData(next, 0, 0);
    setCanUndo(true);
    setCanRedo(redoStackRef.current.length > 0);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;
    saveSnapshot();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <CanvasContext.Provider value={{
      canvasRef, contextRef, snapshotRef,
      startX, startY, isDrawing,
      currentPathRef,
      tool, setTool,
      color, setColor,
      lineWidth, setLineWidth,
      opacity, setOpacity,
      fillShape, setFillShape,
      layers, setLayers,
      activeLayer, setActiveLayer,
      canUndo, canRedo,
      zoom, setZoom,
      cursorPos, setCursorPos,
      saveSnapshot, undo, redo, clearCanvas,
    }}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const ctx = useContext(CanvasContext);
  if (!ctx) throw new Error("useCanvas must be used within CanvasProvider");
  return ctx;
};
