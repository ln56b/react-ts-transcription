import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import FileDisplay from "./components/FileDisplay";

function App() {
  const [audioStream, setAudioStream] = useState<Blob | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const hasAudio = file || audioStream;

  function handleAudioReset(): void {
    setFile(null);
    setAudioStream(null);
  }

  useEffect(() => {
    console.log("audioStream", audioStream);
  });

  return (
    <div className="flex flex-col  max-w-[1000px] mx-auto w-full">
      <section className="flex flex-col min-h-screen">
        <Header />
        {hasAudio ? (
          <FileDisplay
            file={file}
            audioStream={audioStream}
            handleAudioReset={handleAudioReset}
          />
        ) : (
          <Home setFile={setFile} setAudioStream={setAudioStream} />
        )}
      </section>
      <h1 className="text-green-400">hello</h1>
      <Footer />
    </div>
  );
}

export default App;
