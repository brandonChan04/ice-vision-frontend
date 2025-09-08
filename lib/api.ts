export const API_BASE =
  process.env.NEXT_PUBLIC_ICEVISION_API_URL ?? "https://d313f0kz1fog9v.cloudfront.net";

type PredictVideoOpts = { conf?: number; every_n?: number; max_frames?: number };

export async function predictVideoFromBlob(blob: Blob, opts: PredictVideoOpts = {}) {
  const { conf = 0.25, every_n = 5, max_frames = 60 } = opts;

  const file = new File([blob], "sample.mp4", { type: blob.type || "video/mp4" });
  const fd = new FormData();
  fd.append("file", file);

  const qs = new URLSearchParams({
    conf: String(conf),
    every_n: String(every_n),
    max_frames: String(max_frames),
  });

  const res = await fetch(`${API_BASE}/predict_video?${qs.toString()}`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}
