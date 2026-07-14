import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, BookOpen } from 'lucide-react';
import { SHELL_MESSAGES, ShellMessage, TimeOfDay } from '../types';
import { beachAudio } from '../lib/audio';

interface ShellHuntProps {
  currentMode: TimeOfDay;
  onWishReleased: (wish: string) => void;
}

export default function ShellHunt({ currentMode, onWishReleased }: ShellHuntProps) {
  const [selectedShell, setSelectedShell] = useState<ShellMessage | null>(null);
  const [wishText, setWishText] = useState('');
  const [isWashing, setIsWashing] = useState(false);
  const [releasedWishes, setReleasedWishes] = useState<string[]>([]);
  const [showWishSuccess, setShowWishSuccess] = useState(false);

  const handleShellClick = (shell: ShellMessage) => {
    setSelectedShell(shell);
    beachAudio.playSparkle();
  };

  const handleReleaseWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;

    // Play waves sound or sparkle
    beachAudio.playSparkle();
    setIsWashing(true);

    // Trigger wave sweeping transition
    setTimeout(() => {
      onWishReleased(wishText);
      setReleasedWishes((prev) => [wishText, ...prev]);
      setWishText('');
      setIsWashing(false);
      setShowWishSuccess(true);

      // Hide success message after 4 seconds
      setTimeout(() => setShowWishSuccess(false), 4000);
    }, 2000); // Wave sweeps and cleans in 2 seconds
  };

  return (
    <div id="shell-hunt-activities" className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-6xl mx-auto px-4 py-8 pointer-events-auto z-30 relative select-none">
      
      {/* LEFT SECTION: SHELL HUNTING */}
      <div className="lg:col-span-7 flex flex-col justify-between bg-[#FAF9F6]/95 border border-[#2C2C2C]/15 rounded-3xl p-6 shadow-sm backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.25em] font-sans font-bold text-[#E07A5F]">Tidal Gifts</span>
            <div className="h-[1px] flex-grow bg-[#2C2C2C]/10" />
          </div>
          <h3 className="font-serif text-3xl font-light italic text-[#2C2C2C] mt-2 flex items-center gap-2">
            <span>🐚</span> Hunt for Scattered Shells
          </h3>
          <p className="text-xs text-[#4A4E69] mt-1.5 leading-relaxed">
            Nanu bhaya has hidden cute treasures on the shore. Tap on each seashell to uncover sweet memories and personal blessings!
          </p>
        </div>

        {/* Scattered shell elements in sand */}
        <div className="grid grid-cols-4 gap-4 mt-6 p-4 rounded-2xl bg-[#FAF9F6]/50 border border-[#2C2C2C]/5">
          {SHELL_MESSAGES.map((shell, index) => {
            const rotations = ['rotate-[12deg]', 'rotate-[-18deg]', 'rotate-[45deg]', 'rotate-[-30deg]'];
            const hoverScales = [1.1, 1.15, 1.12, 1.18];

            return (
              <motion.button
                key={shell.id}
                id={`shell-btn-${shell.id}`}
                onClick={() => handleShellClick(shell)}
                className={`relative flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer transition-all duration-300 ${rotations[index]} hover:bg-[#2C2C2C]/5 border border-transparent hover:border-[#2C2C2C]/10`}
                whileHover={{ scale: hoverScales[index], y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                {shell.rarity === 'Legendary' && (
                  <span className="absolute inset-0 bg-[#E07A5F]/10 rounded-full animate-ping pointer-events-none scale-110" />
                )}

                <span className="text-4xl drop-shadow-sm mb-2 select-none">
                  {shell.icon}
                </span>

                <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold font-sans ${
                  shell.rarity === 'Legendary'
                    ? 'bg-[#E07A5F]/20 text-[#E07A5F] border border-[#E07A5F]/30'
                    : shell.rarity === 'Rare'
                    ? 'bg-[#F2CC8F]/30 text-[#b58742] border border-[#F2CC8F]/50'
                    : 'bg-[#2C2C2C]/10 text-[#2C2C2C]/80'
                }`}>
                  {shell.rarity}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Display selected shell content */}
        <div className="h-44 mt-6 relative">
          <AnimatePresence mode="wait">
            {selectedShell ? (
              <motion.div
                key={selectedShell.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-5 rounded-2xl border border-[#2C2C2C]/10 bg-[#FAF9F6] shadow-sm flex gap-4 items-start"
              >
                <span className="text-4xl p-2 bg-[#2C2C2C]/5 rounded-xl select-none">
                  {selectedShell.icon}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-serif text-lg font-bold text-[#2C2C2C] tracking-tight">
                      {selectedShell.title}
                    </h4>
                    <span className="text-[9px] font-sans tracking-widest uppercase font-black text-[#E07A5F]">
                      {selectedShell.rarity} Treasure
                    </span>
                  </div>
                  <p className="text-xs md:text-sm mt-2 leading-relaxed font-sans font-medium text-[#4A4E69]">
                    {selectedShell.message}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty-shell"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                className="h-full flex flex-col items-center justify-center text-center border border-dashed border-[#2C2C2C]/20 rounded-2xl p-6 bg-[#2C2C2C]/5"
              >
                <span className="text-2xl opacity-60">🐚</span>
                <p className="text-xs text-[#4A4E69] font-sans font-bold uppercase tracking-wider mt-2">
                  No Shell Selected
                </p>
                <p className="text-[11px] text-[#4A4E69]/70 mt-1 max-w-xs">
                  Tap on a beach shell to read Nanu bhaya's hidden message and blessing.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT SECTION: SAND WRITING BOARD */}
      <div className="lg:col-span-5">
        <div className="bg-[#FAF9F6]/95 border border-[#2C2C2C]/15 backdrop-blur-md rounded-3xl p-6 shadow-sm relative overflow-hidden">
          
          {/* Wave sweeping effect overlay */}
          <AnimatePresence>
            {isWashing && (
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                exit={{ x: '100%' }}
                transition={{ duration: 2, ease: 'easeInOut' }}
                className="absolute inset-y-0 w-[40%] bg-gradient-to-r from-transparent via-[#8ECAE6]/30 to-[#FAF9F6] blur-md z-40 flex items-center justify-end pr-8"
              >
                <div className="text-[#2C2C2C] font-bold uppercase tracking-widest text-xs flex items-center gap-1.5 rotate-90 origin-right">
                  🌊 Ocean Wave washing...
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.25em] font-sans font-bold text-[#E07A5F]">Beach Canvas</span>
            <div className="h-[1px] flex-grow bg-[#2C2C2C]/10" />
          </div>

          <h3 className="font-serif text-3xl font-light italic text-[#2C2C2C] mt-2 flex items-center gap-2">
            ✏️ Carve Your Wish
          </h3>
          <p className="text-xs text-[#4A4E69] mt-1.5 leading-relaxed">
            Write down a birthday wish, dream, or goal for this year. Submit it to let the soft ocean wave sweep it out into the infinite sea!
          </p>

          <form onSubmit={handleReleaseWish} className="mt-4 space-y-4">
            <div className="relative">
              <textarea
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                disabled={isWashing}
                placeholder="Type your wish here..."
                rows={4}
                maxLength={180}
                className="w-full bg-[#EBD2B4]/40 text-[#5C452D] placeholder-[#8A7057] border border-[#D1B595]/60 rounded-2xl p-4 text-lg font-cursive font-bold focus:outline-none focus:border-[#C0A17D] shadow-[inset_0_2px_8px_rgba(92,69,45,0.08)] transition-all resize-none"
                style={{
                  textShadow: '1px 1px 1px rgba(255,255,255,0.3)',
                }}
              />
              <span className="absolute bottom-2 right-3 text-[10px] font-mono text-[#5C452D]/80">
                {180 - wishText.length} left
              </span>
            </div>

            <button
              type="submit"
              disabled={isWashing || !wishText.trim()}
              className={`w-full py-3.5 px-5 rounded-full text-[#FAF9F6] font-sans tracking-widest uppercase font-black shadow-xs transition-all flex items-center justify-center gap-2 text-xs cursor-pointer ${
                isWashing
                  ? 'bg-[#2C2C2C]/50 cursor-not-allowed'
                  : 'bg-[#2C2C2C] hover:bg-[#E07A5F] active:scale-[0.98]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isWashing ? 'Sweeping away...' : 'Release into the Sea! 🌊'}
            </button>
          </form>

          {/* Sparkly success notice */}
          <AnimatePresence>
            {showWishSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-3 bg-[#FAF9F6] text-[#E07A5F] rounded-xl text-xs flex items-center gap-2 border border-[#E07A5F]/20 font-semibold shadow-xs"
              >
                <Check className="w-4 h-4 bg-[#E07A5F]/15 rounded-full p-0.5 text-[#E07A5F] shrink-0" />
                <span>
                  Your wish has been washed away into the ocean. May the tides carry it to reality! ✨
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wishes log gallery */}
          {releasedWishes.length > 0 && (
            <div className="mt-5 pt-4 border-t border-[#2C2C2C]/10">
              <span className="text-[10px] font-sans tracking-[0.2em] text-[#4A4E69] uppercase font-bold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Swept Wishes ({releasedWishes.length})
              </span>
              <div className="mt-2.5 max-h-32 overflow-y-auto space-y-2 pr-1.5">
                {releasedWishes.map((wish, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-[#2C2C2C]/5 border border-[#2C2C2C]/5 text-xs text-[#2C2C2C] font-cursive text-base italic"
                  >
                    “ {wish} ”
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
