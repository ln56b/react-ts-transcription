import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";

function App() {
  return (
    <div className="flex flex-col  max-w-[1000px] mx-auto w-full">
      <section className="flex flex-col min-h-screen">
        <Header />
        <Home />
      </section>
      <h1 className="text-green-400">hello</h1>
      <Footer />
    </div>
  );
}

export default App;
