import { useCanvas } from "../context/CanvasContext";

export const useExport = () => {
  const { canvasRef } = useCanvas();

  const downloadAs = (format = "png") => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `drawing.${format}`;
    if (format === "png" || format === "jpg") {
      link.href = canvas.toDataURL(format === "jpg" ? "image/jpeg" : "image/png", 0.95);
    } else if (format === "svg") {
      // Basic SVG export (raster embedded)
      const dataUrl = canvas.toDataURL("image/png");
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
  <image href="${dataUrl}" width="${canvas.width}" height="${canvas.height}"/>
</svg>`;
      const blob = new Blob([svgContent], { type: "image/svg+xml" });
      link.href = URL.createObjectURL(blob);
    }
    link.click();
  };

  const copyToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
      } catch (err) {
        console.error("Clipboard write failed", err);
      }
    });
  };

  return { downloadAs, copyToClipboard };
};
