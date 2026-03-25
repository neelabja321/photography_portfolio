import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePhotos } from '../../hooks/usePhotos';
import Lightbox from './Lightbox';

const GalleryItem = ({ item, setSelectedIndex }) => (
  <motion.div
    initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
    whileInView={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
    viewport={{ once: true, margin: "100px" }}
    transition={{ duration: 1, ease: "easeOut" }}
    className="relative overflow-hidden group cursor-pointer rounded-sm breakdown-inside-avoid aspect-square"
    onClick={() => setSelectedIndex(item.originalIndex)}
  >
    <div className="absolute inset-0 bg-dark/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
    <img 
      src={item.photo} 
      alt={`Wildlife capture ${item.originalIndex}`} 
      loading="lazy"
      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 will-change-transform select-none"
      style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
    />
    
    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
      <div className="bg-dark/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-sm tracking-widest uppercase transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 drop-shadow-lg">
        View
      </div>
    </div>
  </motion.div>
);

export default function GallerySection() {
  const { photos, isLoading, error } = usePhotos();
  const [selectedIndex, setSelectedIndex] = useState(null);
  
  // Responsive Columns State
  const [colsCount, setColsCount] = useState(3);
  
  useEffect(() => {
    const updateCols = () => {
      if (window.innerWidth < 640) setColsCount(1);
      else if (window.innerWidth < 1024) setColsCount(2);
      else setColsCount(3);
    };
    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);

  // Parallax configuration
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Different scroll speeds for each column
  // Col 1 moves up slightly faster
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  // Col 2 floats down slightly (moves slower relative to screen)
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  // Col 3 moves up slightly faster
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  const yTransforms = [y1, y2, y3];

  if (error) {
    return (
      <div className="py-24 text-center text-red-500 font-mono">
        Error loading gallery: {error}
      </div>
    );
  }

  // Distribute photos into columns dynamically
  const columns = Array.from({ length: colsCount }, () => []);
  photos.forEach((photo, idx) => {
    columns[idx % colsCount].push({ photo, originalIndex: idx });
  });

  return (
    <section id="gallery" ref={containerRef} className="py-24 px-4 md:px-12 bg-dark overflow-hidden">
      <div className="max-w-7xl mx-auto mb-20 text-center relative z-20">
        <h2 className="font-serif text-4xl md:text-6xl font-bold mb-4">
          The <span className="text-gold italic">Collection</span>
        </h2>
        <p className="text-white/50 lowercase tracking-[0.2em] font-light">
          A visual journey through native habitats
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px] animate-pulse max-w-7xl mx-auto">
          {[1,2,3,4,5,6].map(n => (
            <div key={n} className="bg-dark-card rounded-md w-full h-full" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="col-span-full text-center py-20 text-white/30 border border-white/5 rounded-xl max-w-7xl mx-auto">
          <p>No photos found in /public/photos directory.</p>
          <p className="text-sm mt-2">Add some images to see the magic happen.</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-6 max-w-7xl mx-auto relative z-10 w-full">
          {columns.map((colPhotos, colIndex) => (
            <motion.div 
              key={colIndex} 
              className="flex-1 flex flex-col gap-6"
              style={{ y: colsCount > 1 ? yTransforms[colIndex] : 0 }}
            >
              {colPhotos.map((item) => (
                <GalleryItem 
                  key={item.photo + item.originalIndex} 
                  item={item} 
                  setSelectedIndex={setSelectedIndex} 
                />
              ))}
            </motion.div>
          ))}
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
