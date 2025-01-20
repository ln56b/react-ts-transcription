export default function Header() {
  return (
    <header className="flex items-center justify-between gap-4 p-4">
      <a href="/">
        <h1 className="font-medium">
          Try out the <span className="text-blue-400 bold">Transcript </span>{" "}
          and
          <span className="text-blue-400 bold"> Translate </span> tools!
        </h1>
      </a>
      <a
        href="/"
        className="flex items-center gap-2 p-2 text-blue-400 rounded-lg special-button"
      >
        <p>New</p>
        <i className="fa-solid fa-plus"></i>
      </a>
    </header>
  );
}
