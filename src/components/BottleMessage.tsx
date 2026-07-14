import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Sparkles, Navigation } from 'lucide-react';
import { beachAudio } from '../lib/audio';

interface BottleMessageProps {
  onOpenMessage?: () => void;
}

export default function BottleMessage({ onOpenMessage }: BottleMessageProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    beachAudio.playSparkle();
    if (onOpenMessage) onOpenMessage();
  };

  const handleClose = () => {
    setIsOpen(false);
    beachAudio.playSparkle();
  };

  return (
    <>
      {/* FLOATING BOTTLE */}
      <div id="floating-bottle-container" className="absolute bottom-24 right-[20%] sm:right-[30%] z-25 pointer-events-auto">
        <motion.div
          animate={{
            y: [0, -12, 0],
            rotate: [-6, 6, -6],
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: 'easeInOut',
          }}
          whileHover={{ scale: 1.15, cursor: 'pointer' }}
          onClick={handleOpen}
          className="relative group"
        >
          {/* Sparkle indicators around bottle */}
          <div className="absolute -top-4 -left-4 w-4 h-4 text-amber-300 opacity-0 group-hover:opacity-100 animate-spin transition-opacity duration-300">
            <Sparkles className="w-4 h-4 fill-amber-300" />
          </div>
          <div className="absolute -bottom-2 -right-4 w-4 h-4 text-cyan-200 opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-300">
            <Sparkles className="w-4 h-4" />
          </div>

          {/* Interactive Bottle Graphic */}
          <div className="relative">
            {/* Liquid / Message inside the bottle */}
            <div className="absolute inset-y-4 inset-x-3 bg-amber-100/40 rounded-full blur-[2px] border-t-2 border-amber-200/50 rotate-6" />
            <div className="absolute top-6 left-5 right-5 bottom-4 bg-amber-50 rounded-lg shadow-sm rotate-[-8deg] flex items-center justify-center border border-amber-200/40 opacity-90">
              <span className="text-[7px] text-amber-800 font-mono tracking-tighter uppercase font-bold opacity-80">
                Gunnu 💌
              </span>
            </div>

            {/* Glass Bottle Body */}
            <svg
              viewBox="0 0 100 150"
              className="w-16 h-24 drop-shadow-[0_8px_16px_rgba(13,148,136,0.3)] filter contrast-125"
            >
              {/* Bottle Neck & Cork */}
              <path d="M43,15 L57,15 L57,25 L43,25 Z" fill="rgba(217, 119, 6, 0.9)" /> {/* cork */}
              <path d="M40,25 L60,25 L58,45 L42,45 Z" fill="rgba(204, 251, 241, 0.5)" stroke="rgba(20, 184, 166, 0.4)" strokeWidth="2" />
              {/* Bottle Body */}
              <path d="M42,45 Q20,60 20,95 Q20,135 50,135 Q80,135 80,95 Q80,60 58,45 Z" fill="rgba(204, 251, 241, 0.4)" stroke="rgba(20, 184, 166, 0.5)" strokeWidth="2.5" />
              {/* Highlights on Glass */}
              <path d="M28,80 Q25,100 35,120" fill="none" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="2" strokeLinecap="round" />
              <path d="M72,75 Q75,90 73,110" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Floating Ripple effect under bottle */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-14 h-3 bg-white/20 rounded-full blur-[2px] animate-pulse pointer-events-none" />

          {/* Text indicator */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-teal-950/85 text-amber-200 text-[10px] font-medium py-1 px-2.5 rounded-full whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-teal-800 flex items-center gap-1">
            <Navigation className="w-3 h-3 rotate-45 text-amber-300" />
            Click to Open Message!
          </div>
        </motion.div>
      </div>

      {/* FULLSCREEN PARCHMENT SCROLL MODAL */}
      <AnimatePresence>
        {isOpen && (
          <div id="parchment-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm pointer-events-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 140 }}
              className="relative w-full max-w-lg bg-[#FAF6E9] text-[#4A3B2C] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-[12px] border-[#D1BFA7] p-8 md:p-10 max-h-[90vh] overflow-y-auto"
              style={{
                backgroundImage: 'radial-gradient(#E8D8C1 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            >
              {/* Close Button */}
              <button
                id="close-parchment-btn"
                onClick={handleClose}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-[#E5D5C0] hover:bg-[#D4C3AC] text-[#5C4D3C] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Decorative Corner Ornaments */}
              <div className="absolute top-2 left-2 text-[#C0AE94] text-xl">⚓</div>
              <div className="absolute top-2 right-12 text-[#C0AE94] text-xl">🐚</div>
              <div className="absolute bottom-2 left-2 text-[#C0AE94] text-xl">🌸</div>
              <div className="absolute bottom-2 right-2 text-[#C0AE94] text-xl">⭐</div>

              {/* Scroll Content */}
              <div className="flex flex-col items-center text-center">
                <span className="text-3xl">✉️</span>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-2 text-center"
                >
                  <h2 className="font-serif text-3xl font-extrabold tracking-tight text-[#5C452D] border-b-2 border-[#DCD0C0] pb-2 px-6">
                    Happy Birthday Gunnu!
                  </h2>
                </motion.div>

                {/* Letter Body */}
                <div className="mt-6 font-cursive text-2xl leading-relaxed text-left text-[#5C4A37] font-semibold space-y-4 px-2 max-w-md">
                  <p className="indent-4">Dearest Gunnu,</p>

                  <p>
                    Tomorrow is your special day, and I wanted to send you the warmest beach breeze, the softest golden waves, and the brightest stars in the night sky!
                  </p>

                  <p>
                    You have always been such a joyful, sparkling light in our lives. May your days ahead be filled with happiness as vast and endless as the ocean, wishes as beautiful as the sea shells on the sand, and life journeys as glorious as a tropical sunset.
                  </p>

                  <p>
                    Nanu bhaya is incredibly proud of you, loves you tons, and is always, always cheering you on in everything you do!
                  </p>

                  {/* Sign off */}
                  <div className="pt-4 text-right pr-6">
                    <p className="text-lg font-sans not-italic text-[#7C6A57] uppercase tracking-wider text-xs font-bold">
                      With all my love & blessings,
                    </p>
                    <p className="text-3xl text-[#5C452D] font-bold mt-1 font-cursive">
                      Nanu bhaya ❤️
                    </p>
                  </div>
                </div>

                {/* Animated Heart Button */}
                <motion.button
                  id="love-scroll-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    beachAudio.playSparkle();
                    // Sparkle animation triggers
                  }}
                  className="mt-8 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-full shadow-md flex items-center gap-2 text-sm transition-all cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-current animate-pulse" />
                  Send Love to Nanu Bhaya!
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
