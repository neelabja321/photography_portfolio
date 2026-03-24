import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  const stats = [
    { label: "Years Experience", value: "10+" },
    { label: "Species Captured", value: "450+" },
    { label: "Locations Explored", value: "25" },
  ];

  return (
    <section id="about" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto relative z-20 bg-dark">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left: Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Revealing the hidden <span className="text-gold italic">stories</span> of the wild.
          </h2>
          <div className="space-y-6 text-gray-400 text-lg leading-relaxed font-light">
            <p>
              Hey, I'm Neelabja. My journey into wildlife photography began not with a camera, but with a profound silence in the heart of the jungle. I strive to capture those fleeting, intimate moments that bridge the gap between human observers and untamed spirits.
            </p>
            <p>
              Every photograph is a testament to patience, respect, and a deep-seated passion for conservation. Through my lens, I hope to inspire a deeper appreciation for the fragile ecosystems we share.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="text-3xl md:text-4xl text-white font-serif mb-2">{stat.value}</div>
                <div className="text-xs uppercase tracking-widest text-gold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Abstract/Decorative Image Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative h-[600px] rounded-xl overflow-hidden group"
        >
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-forest/40 to-dark/80 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-700" />
          
          <img 
            src="https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=2000&auto=format&fit=crop" 
            alt="Neelabja working in the field" 
            className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-105"
          />
          
          {/* Decorative frame */}
          <div className="absolute inset-4 border border-white/20 z-20 pointer-events-none rounded-lg" />
        </motion.div>
      </div>
    </section>
  );
}
