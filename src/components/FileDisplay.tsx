import React from "react";

type FileDisplayProps = {
  file: File | null;
  audioStream: MediaStream | null;
  handleAudioReset: () => void;
};

export default function FileDisplay({
  file,
  audioStream,
  handleAudioReset,
}: FileDisplayProps) {
  return (
    <main className="flex flex-col justify-center flex-1 max-w-full gap-3 p-4 pb-20 mx-auto text-center sm:gap-4 md:gap-5 w-fit">
      <h1 className="font-semibold text-center text:4xl sm:text-5xl md:text-6xl">
        Your <span className="text-blue-400 bold">File</span>
      </h1>
      <div className="flex flex-col mx-auto my-4 text-left">
        <h3 className="semi-bold">Name </h3>
        <p>{file?.name}</p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <button
          className="duration-200 text-slate-400 hover:text-blue-600"
          onClick={handleAudioReset}
        >
          Reset
        </button>
        <button className="flex items-center gap-2 p-2 font-medium text-blue-400 rounded-lg special-button">
          <p>Transcribe</p>
          <i className="fa-solid fa-pen"></i>
        </button>
      </div>
    </main>
  );
}
