"use client";

import * as React from "react";
import VideoWithBoxes, { type VideoDetections } from "@/components/VideoWithBoxes";
import { predictVideoFromBlob } from "@/lib/api";

/**
 * Toggle this to turn the live API on/off.
 */
const API_ON = true

export default function Page() {
  const [src, setSrc] = React.useState<string>(""); // preview src
  const fileRef = React.useRef<File | null>(null);
  const [det, setDet] = React.useState<VideoDetections | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const [conf, setConf] = React.useState(0.25);
  const [everyN, setEveryN] = React.useState(15);
  const [maxFrames, setMaxFrames] = React.useState(60);

  function chooseFile() {
    if (!API_ON) return;
    inputRef.current?.click();
  }
  function onDragOver(e: React.DragEvent) {
    if (!API_ON) return;
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }
  function onDragLeave(e: React.DragEvent) {
    if (!API_ON) return;
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }
  function onDrop(e: React.DragEvent) {
    if (!API_ON) return;
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleNewFile(file);
  }
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!API_ON) return;
    const file = e.target.files?.[0] ?? null;
    if (file) handleNewFile(file);
    e.currentTarget.value = "";
  }

  function handleNewFile(file: File) {
    setError(null);
    setDet(null);
    if (!file.type.startsWith("video/")) {
      setError("Please choose a video file (mp4, webm, mov, …)");
      return;
    }
    setSrc((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
    fileRef.current = file;
  }

  async function runDetection() {
    if (!API_ON) {
      setError("API is currently off. Contact me for a live demo: bjc19@sfu.ca");
      return;
    }
    const file = fileRef.current;
    if (!file) {
      setError("Pick or drop a video first.");
      return;
    }
    try {
      setError(null);
      setLoading(true);
      const json = await predictVideoFromBlob(file, {
        conf,
        every_n: everyN,
        max_frames: maxFrames,
      });
      setDet(json);
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "Request failed");
    } finally {
      setLoading(false);
    }
  }

  // cleanup object URL
  React.useEffect(() => {
    return () => {
      if (src) URL.revokeObjectURL(src);
    };
  }, [src]);

  // When API is OFF, show the demo video by default:
  const showDemo = !API_ON;
  const demoSrc = "/samples/demo.mp4";

  return (
    <main className="min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-8">
          <h1 className="text-5xl font-extrabold">Ice Vision</h1>
          <p className="text-gray-400 mt-2">
            {API_ON
              ? "Drag a video below, then run detection. We’ll call the API and overlay boxes on the video."
              : "Preview demo below. The live API is currently off to save GPU time."}
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-[1fr,340px] items-start">
          {/* LEFT: dropzone / video / overlay */}
          <div className="rounded-2xl bg-zinc-900 p-4">
            {showDemo ? (
              // API off: show demo video inside the “dropzone”
              <div className="relative">
                <div className="rounded-xl overflow-hidden border border-zinc-800">
                  <video
                    src={demoSrc}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-auto"
                  />
                </div>
                <p className="mt-3 text-sm text-gray-400">
                  API is currently off because GPU time isn’t cheap!
                </p>
              </div>
            ) : !src ? (
              <div
                onClick={chooseFile}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`flex items-center justify-center border-2 border-dashed rounded-xl h-80 cursor-pointer transition
                ${dragActive ? "border-blue-400 bg-blue-400/10" : "border-zinc-600"}`}
              >
                <div className="text-center">
                  <p className="text-lg">Drag & drop a video here</p>
                  <p className="text-sm text-gray-400">or click to choose a file</p>
                </div>
              </div>
            ) : det ? (
              <VideoWithBoxes src={src} det={det} />
            ) : (
              <video src={src} controls className="w-full h-auto rounded-xl" />
            )}

            {/* hidden file input (only useful when API_ON) */}
            <input
              ref={inputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={onFileChange}
              disabled={!API_ON}
            />
          </div>

          {/* RIGHT: params + actions OR notice */}
          <aside className="space-y-4">
            {API_ON ? (
              <div className="rounded-2xl bg-zinc-900 p-4">
                <h2 className="font-semibold mb-3">Parameters</h2>
                <label className="block text-sm mb-2">
                  Confidence (0–1)
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={conf}
                    onChange={(e) => setConf(parseFloat(e.target.value) || 0)}
                    className="mt-1 w-full bg-zinc-800 rounded px-3 py-2"
                  />
                </label>
                <label className="block text-sm mb-2">
                  every_n
                  <input
                    type="number"
                    min="1"
                    value={everyN}
                    onChange={(e) => setEveryN(parseInt(e.target.value) || 1)}
                    className="mt-1 w-full bg-zinc-800 rounded px-3 py-2"
                  />
                </label>
                <label className="block text-sm mb-3">
                  max_frames
                  <input
                    type="number"
                    min="1"
                    value={maxFrames}
                    onChange={(e) => setMaxFrames(parseInt(e.target.value) || 1)}
                    className="mt-1 w-full bg-zinc-800 rounded px-3 py-2"
                  />
                </label>

                <button
                  onClick={runDetection}
                  disabled={!fileRef.current || loading}
                  className="w-full mt-1 px-4 py-2 rounded-xl bg-white text-black font-semibold disabled:opacity-50"
                >
                  {loading ? "Detecting…" : det ? "Re-run on this video" : "Run detection"}
                </button>

                {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
                {!error && loading && (
                  <p className="text-sm text-gray-400 mt-3">
                    Uploading & processing… If this takes too long, try raising{" "}
                    <em>every_n</em> or lowering <em>max_frames</em>.
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-2xl bg-zinc-900 p-4">
                <h2 className="font-semibold mb-3">Live API Status</h2>
                <p className="text-sm text-gray-300">
                  The live API is <b>currently off</b> to conserve GPU resources.
                  You can still preview the demo video on the left.
                </p>
                <p className="text-sm text-gray-300 mt-3">
                  Want a real-time demo? Email{" "}
                  <a className="underline" href="mailto:bjc19@sfu.ca">
                    bjc19@sfu.ca
                  </a>{" "}
                </p>
              </div>
            )}

            <div className="rounded-2xl bg-zinc-900 p-4 text-sm text-gray-400">
              <p>
                {API_ON ? (
                  <>
                    Tip: CloudFront has a ~60s origin timeout. Start with{" "}
                    <b>every_n=15</b> and <b>max_frames=60</b>, then adjust.
                  </>
                ) : (
                  <>
                    This is a demo-only mode. When the API is enabled, you’ll be able to upload a
                    clip, call the model, and see boxes drawn frame-by-frame.
                  </>
                )}
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
