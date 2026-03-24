import React, { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import GallerySection from './components/Gallery/GallerySection';
import Featured from './components/Featured';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-dark min-h-screen text-white selection:bg-gold selection:text-dark">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Featured />
        <GallerySection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
