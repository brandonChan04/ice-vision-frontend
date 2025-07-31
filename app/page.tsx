"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      setVideoURL(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      setVideoURL(URL.createObjectURL(file));
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-start mt-40 px-6">
      <h1 className="text-6xl font-extrabold mb-6 text-center text-white">Ice Vision</h1>
      <p className="text-gray-400 text-xl mb-16 text-center">
        Upload a hockey video for position detection
      </p>

      <label
        htmlFor="video-upload"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={handleClick}
        className="w-full max-w-3xl h-[360px] border-2 border-dashed border-gray-500 rounded-2xl flex items-center justify-center text-gray-400 hover:border-white transition-colors cursor-pointer text-lg sm:text-xl text-center px-4 relative overflow-hidden"
      >
        {videoFile && videoURL ? (
          <video
            src={videoURL}
            controls
            className="object-contain w-full h-full rounded-2xl"
          />
        ) : (
          <>
            Drag & drop a video here (or click to upload)
          </>
        )}
        <input
          id="video-upload"
          type="file"
          accept="video/*"
          className="hidden"
          ref={inputRef}
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}
