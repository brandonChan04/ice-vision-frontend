"use client";

import { useState } from "react";
import { predictVideoFromBlob } from "@/lib/api";

export default function CallSample() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);
      // Fetch the local video from /public/samples/sample.mp4
      const resp = await fetch("/samples/sample.mp4");
      const blob = await resp.blob();

      const json = await predictVideoFromBlob(blob, {
        conf: 0.25,
        every_n: 5,
        max_frames: 60,
      });

      console.log("IceVision /predict_video response:", json);
      alert("Check the console for the API response ✅");
    } catch (err) {
      console.error(err);
      alert("API call failed (see console)");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-5 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 disabled:opacity-50"
    >
      {loading ? "Calling API..." : "Call API with local video"}
    </button>
  );
}
