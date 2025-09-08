export default function ExamplesPage() {
  return (
    <main className="min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold">Examples</h1>
          <p className="text-gray-400 mt-2">
            Here’s a preloaded example showing the original video and the model’s output with
            detections overlaid.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr,auto,1fr] items-start">
          {/* Input card */}
          <div className="rounded-2xl bg-zinc-900 p-4 shadow-lg shadow-black/30">
            <h2 className="text-lg font-semibold mb-3">Input</h2>
            <div className="rounded-xl overflow-hidden border border-zinc-800">
              <video
                src="/samples/sample.mp4"
                controls
                playsInline
                preload="metadata"
                className="w-full h-auto"
              />
            </div>
            {/* <p className="text-sm text-gray-400 mt-2">
              /samples/sample.mp4
            </p> */}
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            {/* Right arrow on desktop */}
            <svg
              className="hidden lg:block w-12 h-12 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14"></path>
              <path d="M13 5l7 7-7 7"></path>
            </svg>

            {/* Down arrow on mobile/tablet */}
            <svg
              className="lg:hidden w-10 h-10 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14"></path>
              <path d="M5 13l7 7 7-7"></path>
            </svg>
          </div>

          {/* Output card */}
          <div className="rounded-2xl bg-zinc-900 p-4 shadow-lg shadow-black/30">
            <h2 className="text-lg font-semibold mb-3">Output</h2>
            <div className="rounded-xl overflow-hidden border border-zinc-800">
              <video
                src="/samples/sampleOutput.mp4"
                controls
                playsInline
                preload="metadata"
                className="w-full h-auto"
              />
            </div>
            {/* <p className="text-sm text-gray-400 mt-2">
              /samples/sample.mp4
            </p> */}
          </div>
        </section>
      </div>
    </main>
  );
}
