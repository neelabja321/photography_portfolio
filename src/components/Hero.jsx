import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePhotos } from '../hooks/usePhotos';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const { photos, isLoading } = usePhotos();
  const [bgImage, setBgImage] = useState(null);

  useEffect(() => {
    if (photos && photos.length > 0) {
      // Pick a random image from the gallery for the hero, or fallback to the first one
      const randomIndex = Math.floor(Math.random() * photos.length);
      setBgImage(photos[randomIndex]);
    }
  }, [photos]);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-dark" id="hero">
      {/* Dynamic Background Image with Parallax */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        {/* We use scale-105 to allow for a slow pan/zoom effect */}
        {bgImage ? (
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            src={bgImage} 
            alt="Hero Wildlife" 
            className="w-full h-full object-cover origin-center opacity-70"
          />
        ) : (
          <div className="w-full h-full bg-dark-card animate-pulse" />
        )}
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-hero-gradient mix-blend-multiply" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-dark via-transparent to-transparent opacity-90" />

      {/* Hero Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-20 text-center px-6 mt-20"
      >
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-gold font-sans tracking-[0.3em] uppercase text-sm md:text-base mb-4"
        >
          Capturing The Untamed
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 drop-shadow-2xl"
        >
          Neelabja<br/>Sinha Roy
        </motion.h1>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.6, duration: 0.8 }}
        >
          <a 
            href="#gallery"
            className="inline-flex items-center gap-2 border border-white/30 hover:border-gold hover:text-gold px-8 py-3 rounded-full transition-all duration-300 font-medium tracking-wide"
          >
            Explore Gallery
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/50"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}
