import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Heart, ZoomIn } from 'lucide-react';
import { POLAROID_MEMORIES, PolaroidMemory } from '../types';
import { beachAudio } from '../lib/audio';

// Map image keys to their actual generated file paths
const IMAGE_PATHS = {
  beach_sunset: '/src/assets/images/beach_sunset_1784050778074.jpg',
  beach_campfire: '/src/assets/images/beach_campfire_1784050791396.jpg',
  beach_hammock: '/src/assets/images/beach_hammock_1784050805660.jpg',
};

export default function MemoryPolaroids() {
  const [selectedPhoto, setSelectedPhoto] = useState<PolaroidMemory | null>(null);

  const handlePhotoClick = (photo: PolaroidMemory) => {
    setSelectedPhoto(photo);
    beachAudio.playSparkle();
  };

  const handleClose = () => {
    setSelectedPhoto(null);
    beachAudio.playSparkle();
  };

  return (
    <div id="polaroid-gallery-section" className="w-full max-w-6xl mx-auto px-4 py-12 pointer-events-auto z-30 relative select-none">
      <div className="text-center mb-10 max-w-xl mx-auto bg-[#FAF9F6]/95 border border-[#2C2C2C]/15 rounded-3xl p-6 shadow-sm backdrop-blur-md">
        <div className="flex justify-center items-center gap-2 mb-2">
          <div className="h-[1px] w-6 bg-[#2C2C2C]/20" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-black text-[#E07A5F]">Visual Journal</span>
          <div className="h-[1px] w-6 bg-[#2C2C2C]/20" />
        </div>
        <h3 className="font-serif text-3xl font-light italic text-[#2C2C2C]">
          ✨ Polaroid Memories for Gunnu
        </h3>
        <p className="text-xs text-[#4A4E69] mt-2 leading-relaxed">
          Beautiful snapshots from Nanu bhaya, celebrating your life, spirit, and happiness. Hover to peek, or click to enlarge!
        </p>
      </div>

      {/* Grid containing Polaroids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center mt-6">
        {POLAROID_MEMORIES.map((photo, index) => {
          // Give each polaroid a different initial rotation for a messy, beautiful tabletop look
          const rotations = ['-rotate-3', 'rotate-2', '-rotate-1'];
          const delayMultiplier = index * 0.15;

          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 30, rotate: index % 2 === 0 ? -6 : 6 }}
              whileInView={{ opacity: 1, y: 0, rotate: index === 0 ? -3 : index === 1 ? 2 : -1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: delayMultiplier }}
              whileHover={{
                scale: 1.05,
                rotate: 0,
                y: -10,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                zIndex: 40,
              }}
              onClick={() => handlePhotoClick(photo)}
              className="bg-white p-4 pb-6 rounded-sm shadow-xl border border-slate-100 max-w-[280px] w-full cursor-pointer transition-all duration-300"
            >
              {/* Polaroid Photo Frame */}
              <div className="relative aspect-square overflow-hidden bg-slate-900 rounded-xs group">
                <img
                  src={IMAGE_PATHS[photo.imageKey]}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {/* Light glow on top of image */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-70" />
                {/* Expand icon on hover */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="p-2 bg-white/95 rounded-full text-slate-800 shadow-md">
                    <ZoomIn className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Polaroid Handwritten Text Area */}
              <div className="mt-4 flex flex-col items-start px-1 select-none">
                <span className="font-cursive text-2xl font-bold text-slate-800 leading-tight">
                  {photo.title}
                </span>
                <div className="flex justify-between items-center w-full mt-1">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5 text-slate-400" />
                    {photo.date}, 2026
                  </span>
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-400 animate-pulse" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* PHOTO LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedPhoto && (
          <div id="photo-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md pointer-events-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white p-5 pb-8 rounded-md shadow-2xl max-w-lg w-full"
            >
              {/* Close button */}
              <button
                id="close-photo-btn"
                onClick={handleClose}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer z-50"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Image Frame */}
              <div className="relative aspect-square overflow-hidden bg-slate-950 rounded-sm">
                <img
                  src={IMAGE_PATHS[selectedPhoto.imageKey]}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-3 left-3 bg-slate-900/70 text-white text-[9px] px-2 py-1 rounded-md uppercase font-mono tracking-widest backdrop-blur-xs">
                  Snapshot Memory
                </div>
              </div>

              {/* Expanded Caption */}
              <div className="mt-5 text-left px-2">
                <h4 className="font-serif text-xl font-bold text-slate-900">
                  {selectedPhoto.title}
                </h4>
                <div className="flex items-center gap-1.5 mt-1 text-slate-400 font-mono text-[10px] uppercase">
                  <Calendar className="w-3 h-3" />
                  <span>Captured on {selectedPhoto.date}, 2026</span>
                </div>
                
                <p className="mt-4 font-cursive text-2xl font-semibold leading-relaxed text-slate-700 border-l-4 border-teal-500 pl-4 bg-teal-50/50 py-3 rounded-r-lg">
                  {selectedPhoto.caption}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
