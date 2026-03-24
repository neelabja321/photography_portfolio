import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function Featured() {
  const features = [
    {
      title: "The Silent Hunter",
      location: "Masai Mara, Kenya",
      desc: "A three-week tracking expedition culminating in this rare glimpse of a leopard at dusk.",
      image: "https://images.unsplash.com/photo-1541818784-db7977464d27?q=80&w=1500&auto=format&fit=crop"
    },
    {
      title: "Monarch of the Mist",
      location: "Ranthambore, India",
      desc: "Early morning fog unveils the undisputed king of the sanctuary wandering his territory.",
      image: "https://images.unsplash.com/photo-1560965373-c64ef5ec2f6b?q=80&w=1500&auto=format&fit=crop"
    }
  ];

  return (
    <section id="featured" className="py-32 px-6 md:px-12 bg-dark">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Featured <span className="text-gold italic">Expeditions</span>
            </h2>
            <p className="text-white/50 max-w-md font-light leading-relaxed">
              Selected stories from the field, where patience meets the perfect light.
            </p>
          </div>
          <a href="#gallery" className="text-sm uppercase tracking-[0.2em] hover:text-gold transition-colors pb-2 border-b border-white/20 hover:border-gold">
            View full gallery
          </a>
        </div>

        <div className="flex flex-col gap-12">
          {features.map((feature, idx) => (
            <motion.div 
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`group relative h-[60vh] min-h-[500px] w-full rounded-2xl overflow-hidden flex flex-col justify-end p-8 md:p-16 ${idx % 2 !== 0 ? 'md:items-end md:text-right' : ''}`}
            >
              {/* Image Background */}
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent z-10 mix-blend-multiply opacity-80" />
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[10s] ease-out will-change-transform"
                />
              </div>

              {/* Content overlay */}
              <div className="relative z-20 max-w-xl">
                <div className="mb-4">
                  <span className="text-xs font-mono tracking-widest text-gold bg-dark/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-gold/30">
                    {feature.location}
                  </span>
                </div>
                <h3 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6">
                  {feature.title}
                </h3>
                <p className="text-lg text-white/70 font-light mb-8">
                  {feature.desc}
                </p>
                <button className="flex items-center gap-2 group/btn border border-white/20 hover:border-white px-6 py-3 rounded-full transition-all duration-300">
                  <span className="text-sm tracking-widest uppercase">Read Story</span>
                  <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
