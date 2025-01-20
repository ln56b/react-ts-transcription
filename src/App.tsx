import { useState } from "react";
import FileDisplay from "./components/FileDisplay";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import Information from "./components/Information";
import Transcribe from "./components/Transcribe";

function App() {
  const [audioStream, setAudioStream] = useState<Blob | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<boolean>(false);

  const hasAudio = file || audioStream;

  function handleAudioReset(): void {
    setFile(null);
    setAudioStream(null);
  }

  return (
    <div className="flex flex-col max-w-[1000px] mx-auto w-full">
      <section className="flex flex-col min-h-screen">
        <Header />
        {output ? (
          <Information output={output} />
        ) : downloading ? (
          <Transcribe downloading={downloading} />
        ) : hasAudio ? (
          <FileDisplay
            file={file}
            audioStream={audioStream}
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
