export const applyContextSettings = (ctx, color, lineWidth, opacity, tool) => {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.globalAlpha = opacity;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.globalCompositeOperation =
    tool === "eraser" ? "destination-out" : "source-over";
};

export const drawShape = (ctx, tool, sx, sy, ex, ey, fill) => {
  ctx.beginPath();
  switch (tool) {
    case "rect":
      fill
        ? ctx.fillRect(sx, sy, ex - sx, ey - sy)
        : ctx.strokeRect(sx, sy, ex - sx, ey - sy);
      break;
    case "circle": {
      const rx = Math.abs(ex - sx) / 2;
      const ry = Math.abs(ey - sy) / 2;
      const cx = sx + (ex - sx) / 2;
      const cy = sy + (ey - sy) / 2;
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      fill ? ctx.fill() : ctx.stroke();
      break;
    }
    case "line":
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      break;
    case "triangle":
      ctx.moveTo(sx + (ex - sx) / 2, sy);
      ctx.lineTo(sx, ey);
      ctx.lineTo(ex, ey);
      ctx.closePath();
      fill ? ctx.fill() : ctx.stroke();
      break;
    case "arrow": {
      const headlen = 15;
      const angle = Math.atan2(ey - sy, ex - sx);
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.lineTo(ex - headlen * Math.cos(angle - Math.PI / 6), ey - headlen * Math.sin(angle - Math.PI / 6));
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex - headlen * Math.cos(angle + Math.PI / 6), ey - headlen * Math.sin(angle + Math.PI / 6));
      ctx.stroke();
      break;
    }
    case "diamond": {
      const mx = (sx + ex) / 2;
      const my = (sy + ey) / 2;
      ctx.moveTo(mx, sy);
      ctx.lineTo(ex, my);
      ctx.lineTo(mx, ey);
      ctx.lineTo(sx, my);
      ctx.closePath();
      fill ? ctx.fill() : ctx.stroke();
      break;
    }
    default:
      break;
  }
};

export const floodFill = (canvas, ctx, x, y, fillColorHex) => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const idx = (px, py) => (py * width + px) * 4;

  const targetIdx = idx(Math.floor(x), Math.floor(y));
  const tr = data[targetIdx], tg = data[targetIdx + 1], tb = data[targetIdx + 2], ta = data[targetIdx + 3];

  const hex = fillColorHex.replace("#", "");
  const fr = parseInt(hex.substring(0, 2), 16);
  const fg = parseInt(hex.substring(2, 4), 16);
  const fb = parseInt(hex.substring(4, 6), 16);

  if (tr === fr && tg === fg && tb === fb && ta === 255) return;

  const stack = [[Math.floor(x), Math.floor(y)]];
  const visited = new Uint8Array(width * canvas.height);

  while (stack.length) {
    const [px, py] = stack.pop();
    if (px < 0 || px >= width || py < 0 || py >= canvas.height) continue;
    const i = idx(px, py);
    if (visited[py * width + px]) continue;
    if (data[i] !== tr || data[i + 1] !== tg || data[i + 2] !== tb || data[i + 3] !== ta) continue;
    visited[py * width + px] = 1;
    data[i] = fr; data[i + 1] = fg; data[i + 2] = fb; data[i + 3] = 255;
    stack.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]);
  }
  ctx.putImageData(imageData, 0, 0);
};

export const getColorAtPixel = (canvas, ctx, x, y) => {
  const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
  const toHex = v => v.toString(16).padStart(2, "0");
  return `#${toHex(pixel[0])}${toHex(pixel[1])}${toHex(pixel[2])}`;
};
