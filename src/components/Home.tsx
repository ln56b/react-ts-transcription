export default function Home() {
  return (
    <main className="flex flex-col justify-center flex-1 gap-3 p-4 pb-20 text-center sm:gap-4 md:gap-5">
      <h1 className="font-semibold text-center text:5xl sm:text-6xl md:text-7xl">
        Discover <span className="text-blue-400 bold">Transcription</span>
      </h1>
      <h3 className="font-medium text-white bg-blue-400 g md:text-lg">
        Record
        <span className="text-blue-400">&rarr;</span> Transcribe
        <span className="text-blue-400">&rarr;</span> Translate
      </h3>
      <button className="flex items-center justify-between max-w-full gap-2 p-2 px-4 py-2 mx-auto my-4 text-base text-blue-400 rounded-md special-button w-72">
        <p>Record</p>
        <i className="fa-solid fa-microphone"></i>
      </button>
      <p className="text-base">
        Or{" "}
        <label className="text-blue-400 duration-200 cursor-pointer hover:text-blue-600">
          Upload
          <input className="hidden" type="file" accept=".mp3" />
        </label>{" "}
        a mp3 file
      </p>
    </main>
  );
}
