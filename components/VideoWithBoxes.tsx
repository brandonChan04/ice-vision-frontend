"use client";

import * as React from "react";

type Box = { xyxy: number[]; conf: number; cls: number; label: string };
type FrameDet = { i: number; boxes: Box[]; img_w: number; img_h: number };
export type VideoDetections = {
  fps: number;
  total_frames: number;
  sampled_every_n: number;
  returned_frames: number;
  frames: FrameDet[];
};

function findNearestFrame(frames: FrameDet[], targetIndex: number) {
  // frames[i].i is the original frame index (sparse; sampled every_n)
  // do a cheap nearest search — frames are already in ascending order
  let best = frames[0];
  let bestDelta = Math.abs(best.i - targetIndex);
  for (let j = 1; j < frames.length; j++) {
    const d = Math.abs(frames[j].i - targetIndex);
    if (d < bestDelta) { best = frames[j]; bestDelta = d; } else if (frames[j].i > targetIndex) { break; }
  }
  return best;
}

export default function VideoWithBoxes({
  src,
  det,
  className,
  lineWidth = 3,
}: {
  src: string;
  det: VideoDetections;
  className?: string;
  lineWidth?: number;
}) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [dims, setDims] = React.useState({ w: 0, h: 0 });

  // Size canvas to match the rendered video box (handle DPR for crisp lines)
  function resizeCanvas() {
    const v = videoRef.current!;
    const c = canvasRef.current!;
    const rect = v.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    c.style.width = `${rect.width}px`;
    c.style.height = `${rect.height}px`;
    c.width = Math.round(rect.width * dpr);
    c.height = Math.round(rect.height * dpr);
    const ctx = c.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    setDims({ w: rect.width, h: rect.height });
  }

  React.useEffect(() => {
    const v = videoRef.current!;
    if (!v) return;
    const onLoaded = () => resizeCanvas();
    const onResize = () => resizeCanvas();
    v.addEventListener("loadedmetadata", onLoaded);
    window.addEventListener("resize", onResize);
    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Draw loop synced to video time
  React.useEffect(() => {
    const v = videoRef.current!;
    const c = canvasRef.current!;
    if (!v || !c || !det) return;

    const ctx = c.getContext("2d")!;
    let raf = 0;

    const draw = () => {
      if (!det || !v || !ctx) return;

      // current time -> nearest frame index
      const t = v.currentTime; // seconds
      const idx = Math.round(t * det.fps);
      const f = findNearestFrame(det.frames, idx);

      // scale to canvas space
      const scaleX = dims.w > 0 ? dims.w / f.img_w : 1;
      const scaleY = dims.h > 0 ? dims.h / f.img_h : 1;

      // clear & draw
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.lineWidth = lineWidth;
      ctx.font = "14px Inter, system-ui, sans-serif";
      ctx.textBaseline = "top";

      for (const b of f.boxes) {
        const [x1, y1, x2, y2] = b.xyxy;
        const rx = x1 * scaleX, ry = y1 * scaleY;
        const rw = (x2 - x1) * scaleX, rh = (y2 - y1) * scaleY;

        // box
        ctx.strokeStyle = "rgba(40,120,255,1)";
        ctx.strokeRect(rx, ry, rw, rh);

        // label
        const label = `${b.label} ${(b.conf * 100).toFixed(0)}%`;
        const padX = 6, padY = 4;
        const tw = ctx.measureText(label).width;
        const th = 16;
        ctx.fillStyle = "rgba(40,120,255,1)";
        ctx.fillRect(rx, ry - (th + padY * 2), tw + padX * 2, th + padY * 2);
        ctx.fillStyle = "#fff";
        ctx.fillText(label, rx + padX, ry - (th + padY));
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [det, dims.w, dims.h, lineWidth]);

  return (
    <div className={`relative ${className ?? ""}`}>
      <video
        ref={videoRef}
        src={src}
        controls
        className="w-full h-auto block rounded-xl"
        // draw when time updates (helps first paint)
        onTimeUpdate={() => { /* draw loop already running via rAF */ }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
