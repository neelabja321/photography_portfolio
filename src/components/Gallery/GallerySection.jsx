import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePhotos } from '../../hooks/usePhotos';
import Lightbox from './Lightbox';

export default function GallerySection() {
  const { photos, isLoading, error } = usePhotos();
  const [selectedIndex, setSelectedIndex] = useState(null);

  if (error) {
    return (
      <div className="py-24 text-center text-red-500 font-mono">
        Error loading gallery: {error}
      </div>
    );
  }

  return (
    <section id="gallery" className="py-24 px-4 md:px-12 bg-dark">
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <h2 className="font-serif text-4xl md:text-6xl font-bold mb-4">
          The <span className="text-gold italic">Collection</span>
        </h2>
        <p className="text-white/50 lowercase tracking-[0.2em] font-light">
          A visual journey through native habitats
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[250px] animate-pulse max-w-7xl mx-auto">
          {[1,2,3,4,5,6].map(n => (
            <div key={n} className="bg-dark-card rounded-md w-full h-full" />
          ))}
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 max-w-7xl mx-auto space-y-6">
          {photos.length === 0 ? (
            <div className="col-span-full text-center py-20 text-white/30 border border-white/5 rounded-xl">
              <p>No photos found in /public/photos directory.</p>
              <p className="text-sm mt-2">Add some images to see the magic happen.</p>
            </div>
          ) : (
            photos.map((photo, idx) => (
              <motion.div
                key={photo}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "50px" }}
                transition={{ duration: 0.6, delay: (idx % 3) * 0.1 }}
                className="relative overflow-hidden group cursor-pointer rounded-sm breakdown-inside-avoid"
                onClick={() => setSelectedIndex(idx)}
              >
                <div className="absolute inset-0 bg-dark/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img 
                  src={photo} 
                  alt={`Wildlife capture ${idx}`} 
                  loading="lazy"
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 will-change-transform"
                />
                
                {/* Hover overlay hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <div className="bg-dark/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-sm tracking-widest uppercase transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    View
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Fullscreen Lightbox Portal */}
      <Lightbox 
        photos={photos} 
        currentIndex={selectedIndex} 
        onClose={() => setSelectedIndex(null)} 
        onChangeIndex={setSelectedIndex}
      />
    </section>
  );
}
