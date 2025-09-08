export default function RequirementsPage() {
  return (
    <main className="min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold">Video Requirements</h1>
          <p className="text-gray-400 mt-2">
            To get the best detections, please follow these guidelines. The model is tuned for
            broadcast hockey footage (NHL highlights).
          </p>
        </header>

        {/* Quick checklist */}
        <section className="rounded-2xl bg-zinc-900 p-5 mb-6">
          <h2 className="text-xl font-semibold mb-3">Quick checklist</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• <b>Aspect ratio:</b> Landscape <b>16:9</b> (recommended). Avoid vertical/portrait video.</li>
            <li>• <b>Resolution:</b> <b>1920×1080</b> (Full HD) or <b>1280×720</b> (HD) works best.</li>
            <li>• <b>Length:</b> Short clips, ideally <b>5–20 seconds</b>. Keep under ~<b>30s</b> for faster processing.</li>
            <li>• <b>FPS:</b> 25–60 fps (30/60 preferred). Lower frame rates reduce tracking quality.</li>
            <li>• <b>Format:</b> <b>MP4 (H.264)</b> strongly recommended. MOV and WEBM are usually fine. Audio is ignored.</li>
            <li>• <b>File size:</b> Smaller uploads are faster. Try to keep clips under ~<b>100 MB</b>.</li>
          </ul>
        </section>

        {/* Best source */}
        <section className="rounded-2xl bg-zinc-900 p-5 mb-6">
          <h2 className="text-xl font-semibold mb-2">Best source footage</h2>
          <p className="text-sm text-gray-300">
            For optimal results, take your clips from <b>NHL highlight reels</b> (league or team
            channels). These use a consistent broadcast side camera, clear rink view, and stable
            framing—all of which the model expects.
          </p>
          <ul className="mt-3 space-y-2 text-sm text-gray-300">
            <li>• Use plays where the main broadcast camera is visible (side/neutral zone view).</li>
            <li>• Avoid heavy zooms, crowd shots, bench cams, intermission cuts, or replays with overlays.</li>
            <li>• Minimize motion blur and compression artifacts if possible.</li>
          </ul>
        </section>

        {/* Length & performance tips */}
        <section className="rounded-2xl bg-zinc-900 p-5 mb-6">
          <h2 className="text-xl font-semibold mb-2">Clip length & performance</h2>
          <p className="text-sm text-gray-300">
            Shorter clips process faster and avoid timeouts. If you upload longer videos, consider:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-gray-300">
            <li>• Trimming to the key play (5–20s is a sweet spot).</li>
            <li>• Increasing the “<b>every_n</b>” sampling parameter to skip frames (e.g., 10–20).</li>
            <li>• Reducing “<b>max_frames</b>” if you only need the first part of the clip.</li>
          </ul>
          <p className="text-xs text-gray-500 mt-3">
            Note: Our edge/CDN and API are tuned for snappy responses. Very long clips can hit time limits.
          </p>
        </section>

        {/* Aspect & formatting guidance */}
        <section className="rounded-2xl bg-zinc-900 p-5">
          <h2 className="text-xl font-semibold mb-2">Aspect & formatting</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• If your source is vertical (9:16), letterbox it to 16:9 for better results.</li>
            <li>• Keep the rink fully in frame whenever possible; avoid tight crops on players only.</li>
            <li>• Keep overlays (score bugs, watermarks) minimal—some are fine, but large overlays can occlude players.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
