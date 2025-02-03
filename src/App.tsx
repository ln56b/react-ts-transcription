import { useEffect, useRef, useState } from "react";
import FileDisplay from "./components/FileDisplay";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import Information from "./components/Information";
import Transcribe from "./components/Transcribe";
import { MessageTypes } from "./utils/presets";

function App() {
  const [audioStream, setAudioStream] = useState<Blob | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  const hasAudio = file || audioStream;

  const messageTypes = MessageTypes;

  function handleAudioReset(): void {
    setFile(null);
    setAudioStream(null);
  }

  const worker = useRef<Worker | null>(null);

  useEffect(() => {
    if (!worker?.current) {
      worker.current = new Worker(
        new URL("./utils/whisper.worker.ts", import.meta.url),
        {
          type: "module",
        }
      );
    }

    const onNewMessage = async (e: MessageEvent) => {
      switch (e.data.type) {
        case "LOADING":
        default:
          setLoading(true);
          break;
        case "DOWNLOADING":
          setDownloading(true);
          break;
        case "RESULT":
          setOutput(e.data.results);
          break;
        case "DONE":
          setCompleted(true);
          break;
      }
    };

    worker.current.addEventListener("message", onNewMessage);

    return () => worker.current!.removeEventListener("message", onNewMessage);
  }, []);

  async function readAudioFrom(
    file: File
  ): Promise<Float32Array<ArrayBufferLike>> {
    const samplingRate = 16000;
    const audioContext = new AudioContext({ sampleRate: samplingRate });
    const res = await file.arrayBuffer();
    const decodedAudio = await audioContext.decodeAudioData(res);
    const audio = decodedAudio.getChannelData(0);
    return audio;
  }

  async function handleSubmit(): Promise<void> {
    if (!file && !audioStream) return;

    const audio = await readAudioFrom(file ? file : (audioStream as File));
    const model_name = "openai/whisper-tiny.en";

    worker.current?.postMessage({
      type: messageTypes.REQUEST,
      audio,
      model_name,
    });
  }

  return (
    <div className="flex flex-col max-w-[1000px] mx-auto w-full">
      <section className="flex flex-col min-h-screen">
        <Header />
        {output ? (
          <Information output={output} />
        ) : loading ? (
          <Transcribe loading={loading} />
        ) : hasAudio ? (
          <FileDisplay
            file={file}
            audioStream={audioStream}
            handleSubmit={handleSubmit}
            handleAudioReset={handleAudioReset}
          />
        ) : (
          <Home setFile={setFile} setAudioStream={setAudioStream} />
        )}
      </section>
      <Footer />
    </div>
  );
}

export default App;
