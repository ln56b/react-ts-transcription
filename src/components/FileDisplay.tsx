type FileDisplayProps = {
  file: File | null;
  audioStream: Blob | null;
  handleSubmit: () => void;
  handleAudioReset: () => void;
};

export default function FileDisplay({
  file,
  audioStream,
  handleSubmit,
  handleAudioReset,
}: FileDisplayProps) {
  return (
    <main className="flex flex-col justify-center flex-1 max-w-full gap-3 p-4 pb-20 mx-auto text-center sm:gap-4 w-72 sm:w-96 md:w-96">
      <h1 className="font-semibold text-center text:4xl sm:text-5xl md:text-6xl">
        Your <span className="text-blue-400 bold">File</span>
      </h1>
      <div className="flex flex-col mx-auto my-4 text-left">
        <h3 className="font-semibold">Name </h3>
        <p>{file ? file.name : "Custom audio"}</p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <button
          className="duration-200 text-slate-400 hover:text-blue-600"
          onClick={handleAudioReset}
        >
          Reset
        </button>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 p-2 font-medium text-blue-400 rounded-lg special-button"
        >
          <p>Transcribe</p>
          <i className="fa-solid fa-pen"></i>
        </button>
      </div>
    </main>
  );
}
