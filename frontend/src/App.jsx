import { useEffect } from "react";
import { CanvasProvider, useCanvas } from "./context/CanvasContext";
import MenuBar from "./components/MenuBar";
import Toolbar from "./components/ToolKit/ToolKit";
import DrawingCanvas from "./components/DrawingCanvas/DrawingCanvas";
import ColorPicker from "./components/ColorPicker";
import StatusBar from "./components/StatusBar";



const AppInner = () => (
  <div style={{
    display: "flex", flexDirection: "column",
    height: "100vh", width: "100vw", overflow: "hidden",
  }}>
    
    <MenuBar />
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      <Toolbar />
      <DrawingCanvas />
      <ColorPicker />
    </div>
    <StatusBar />
  </div>
);

const App = () => (
  <CanvasProvider>
    <AppInner />
  </CanvasProvider>
);

export default App;
