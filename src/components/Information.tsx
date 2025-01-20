import { useState } from "react";
import Transcription from "./Transcription";
import Translation from "./Translation";

type InformationProps = {
  output: string;
};

export default function Information({ output }: InformationProps) {
  const [tab, setTab] = useState<"transcription" | "translation">(
    "transcription"
  );

  return (
    <main className="flex flex-col justify-center flex-1 w-full gap-3 p-4 pb-20 mx-auto text-center sm:gap-4 max-w-prose">
      <h1 className="font-semibold text-center text:4xl sm:text-5xl md:text-6xl whitespace-nowrap">
        Your <span className="text-blue-400 bold">Transcription</span>
      </h1>

      <div className="grid grid-cols-2 mx-auto overflow-hidden bg-white border-blue-300 border-solid rounded-full shadow border-1">
        <button
          onClick={() => setTab("transcription")}
          className={
            "px-4 duration-200 py-2 font-medium " +
            (tab === "transcription"
              ? "bg-blue-400 text-white"
              : "text-blue-400 hover:text-blue-600")
          }
        >
          Transcription
        </button>
        <button
          onClick={() => setTab("translation")}
          className={
            "px-4 duration-200 py-2 font-medium " +
            (tab === "translation"
              ? "bg-blue-400 text-white"
              : "text-blue-400 hover:text-blue-600")
          }
        >
          Translation
        </button>
      </div>
      {tab === "transcription" ? <Transcription /> : <Translation />}
    </main>
  );
}
