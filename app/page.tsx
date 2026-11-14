import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CommandPalette from "./components/CommandPalette";
import Fun from "./components/Fun";

export default function Home() {
  return (
    <>
      <Nav />
      <CommandPalette />
      <Fun />
      <div
        aria-hidden
        className="bg-grid pointer-events-none fixed inset-0 -z-10"
      />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
