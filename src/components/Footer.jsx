import React from 'react';
import { Camera } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark border-t border-white/5 py-12 px-6 md:px-12 text-center md:text-left">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-3">
          <Camera className="w-5 h-5 text-gold" />
          <span className="font-serif text-lg tracking-widest text-white/80">NATURE UNSCRIPTED.</span>
        </div>

        <div className="text-white/40 text-sm font-light">
          &copy; {currentYear} Neelabja Sinha Roy. All visuals captured in the wild.
        </div>

        <div className="flex items-center justify-center gap-6">
          <a href="#" className="text-white/40 hover:text-white text-sm uppercase tracking-wider transition-colors">Privacy</a>
          <a href="#" className="text-white/40 hover:text-white text-sm uppercase tracking-wider transition-colors">Terms</a>
        </div>
        
      </div>
    </footer>
  );
}
