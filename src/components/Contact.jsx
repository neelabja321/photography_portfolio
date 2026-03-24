import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin } from 'lucide-react';

const InstagramIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const WhatsAppIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export default function Contact() {
  const [formState, setFormState] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState('submitting');
    
    try {
      const response = await fetch("https://formsubmit.co/ajax/neelabjasinharoy@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: e.target.name.value,
          email: e.target.email.value,
          message: e.target.message.value
        })
      });
      
      if (response.ok) {
        setFormState('success');
        e.target.reset();
        setTimeout(() => setFormState('idle'), 3000);
      } else {
        setFormState('idle');
        alert("Sorry, there was an issue sending your message.");
      }
    } catch (err) {
      console.error(err);
      setFormState('idle');
      alert("Network error occurred.");
    }
  };

  return (
    <section id="contact" className="py-32 px-6 md:px-12 bg-dark-surface border-t border-white/5 relative overflow-hidden">
      {/* Decorative BG element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-radial from-forest/5 to-transparent opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
        
        {/* Left: Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6">
            Let's <span className="text-gold italic">Connect</span>.
          </h2>
          <p className="text-white/60 text-lg font-light mb-12 max-w-md leading-relaxed">
            Interested in a print, an assignment, or just want to talk about wildlife? My inbox is always open.
          </p>

          <div className="space-y-8 flex flex-col">
            <a href="mailto:neelabjasinharoy@gmail.com" className="flex items-center gap-6 group">
              <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold group-hover:bg-gold/5 transition-colors">
                <Mail className="w-5 h-5 text-white/50 group-hover:text-gold transition-colors" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-white/40 mb-1">Email</div>
                <div className="text-lg font-light group-hover:text-white transition-colors">neelabjasinharoy@gmail.com</div>
              </div>
            </a>
            
            <a href="#" className="flex items-center gap-6 group">
              <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold group-hover:bg-gold/5 transition-colors">
                <InstagramIcon className="w-5 h-5 text-white/50 group-hover:text-gold transition-colors" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-white/40 mb-1">Instagram</div>
                <div className="text-lg font-light group-hover:text-white transition-colors">@mr_sinharoy</div>
              </div>
            </a>

            <a href="https://wa.me/917044144581" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 group">
              <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#25D366] group-hover:bg-[#25D366]/5 transition-colors">
                <WhatsAppIcon className="w-5 h-5 text-white/50 group-hover:text-[#25D366] transition-colors" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-white/40 mb-1">WhatsApp</div>
                <div className="text-lg font-light group-hover:text-white transition-colors">7044144581</div>
              </div>
            </a>

            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold group-hover:bg-gold/5 transition-colors">
                <MapPin className="w-5 h-5 text-white/50 group-hover:text-gold transition-colors" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-white/40 mb-1">Base</div>
                <div className="text-lg font-light group-hover:text-white transition-colors">Earth</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="bg-dark/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl">
            <div className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-3">Name</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  className="w-full bg-transparent border-b border-white/20 placeholder-white/20 pb-3 focus:outline-none focus:border-gold transition-colors text-white font-light"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-3">Email</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  className="w-full bg-transparent border-b border-white/20 placeholder-white/20 pb-3 focus:outline-none focus:border-gold transition-colors text-white font-light"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-3">Message</label>
                <textarea 
                  name="message"
                  required
                  rows="4"
                  className="w-full bg-transparent border-b border-white/20 placeholder-white/20 pb-3 focus:outline-none focus:border-gold transition-colors text-white font-light resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>
              
              <button 
                type="submit"
                disabled={formState !== 'idle'}
                className="w-full py-4 mt-4 relative overflow-hidden group bg-white text-dark rounded-sm uppercase tracking-widest text-sm font-semibold hover:bg-gold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {formState === 'idle' && "Send Message"}
                {formState === 'submitting' && "Sending..."}
                {formState === 'success' && "Message Sent!"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
