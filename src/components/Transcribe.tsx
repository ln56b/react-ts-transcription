type TranscribeProps = {
  downloading: boolean;
};

export default function Transcribe({ downloading }: TranscribeProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-10 pb-24 text-center md:gap-14">
      <div className="flex flex-col gap-2 sm:gap-4">
        <h1 className="font-medium">
          Your <span className="text-blue-400 bold"> </span>
          <span className="text-blue-400 bold"> Trancription </span>
        </h1>
        <p>
          {!downloading
            ? "Your download has not started yet"
            : "Currently downloading your audio file"}
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:gap-4 max-w-[400px] mx-auto w-full">
        {[0, 1, 2].map((num) => {
          return (
            <div
              key={num}
              className={
                "rounded-full h-2 sm:h-3 bg-slate-400 downloading " +
                `downloading${num}`
              }
            ></div>
          );
        })}
      </div>
    </div>
  );
}
