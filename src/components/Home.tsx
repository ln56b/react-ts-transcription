import { MutableRefObject, useEffect, useRef, useState } from "react";

export enum RecordingStatus {
  Stopped = "stopped",
  Recording = "recording",
}

type HomeProps = {
  setFile: (file: File) => void;
  setAudioStream: (stream: Blob) => void;
};

export default function Home({ setFile, setAudioStream }: HomeProps) {
  const [recordingStatus, setRecordingStatus] = useState(
    RecordingStatus.Stopped
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [duration, setDuration] = useState(0);

  const mediaRecorder: MutableRefObject<null | MediaRecorder> = useRef(null);
  const mimeType = "audio/webm";

  async function startRecording(): Promise<void> {
    let stream = null;

    try {
      const streamData = navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      stream = await streamData;
    } catch (error) {
      console.warn("Error in streamData", error.message);
      return;
    }

    setRecordingStatus(RecordingStatus.Recording);

    const media = new MediaRecorder(stream, { mimeType });
    if (!media) return;
    mediaRecorder.current = media;

    mediaRecorder.current.start();

    const audioChunks: Blob[] = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;

      audioChunks.push(event.data);
      setAudioChunks(audioChunks);
    };
  }

  async function stopRecording(): Promise<void> {
    if (!mediaRecorder.current) return;
    setRecordingStatus(RecordingStatus.Stopped);
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      setAudioStream(audioBlob);
      setAudioChunks([]);
      setDuration(0);
    };
  }

  useEffect(() => {
    if (recordingStatus === RecordingStatus.Stopped) return;
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  });

  return (
    <main className="flex flex-col justify-center flex-1 gap-3 p-4 pb-20 text-center sm:gap-4 ">
      <h1 className="font-semibold text-center text:5xl sm:text-6xl md:text-7xl">
        Discover <span className="text-blue-400 bold">Transcription</span>
      </h1>
      <h3 className="font-medium md:text-lg">
        Record
        <span className="text-blue-400">&rarr;</span> Transcribe
        <span className="text-blue-400">&rarr;</span> Translate
      </h3>
      <button
        onClick={
          recordingStatus === RecordingStatus.Recording
            ? stopRecording
            : startRecording
        }
        className="flex items-center justify-between max-w-full gap-2 p-2 mx-auto my-4 text-base text-blue-400 rounded-md special-button w-72"
      >
        <p>
          {recordingStatus === RecordingStatus.Stopped
            ? "Record"
            : "Stop recording"}
        </p>
        <div className="flex items-center gap-2">
          {!!duration && <p className="text-sm">{duration}s</p>}
          <i
            className={
              "fa-solid fa-microphone duration-200 " +
              (recordingStatus === RecordingStatus.Recording
                ? "text-rose-300"
                : "")
            }
          ></i>
        </div>
      </button>
      <p className="text-base">
        Or{" "}
        <label className="text-blue-400 duration-200 cursor-pointer hover:text-blue-600">
          Upload
          <input
            className="hidden"
            type="file"
            accept=".mp3"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setFile(file);
            }}
          />
        </label>{" "}
        a mp3 file
      </p>
    </main>
  );
}
