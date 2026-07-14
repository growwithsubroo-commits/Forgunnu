import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Heart, Sparkles, Anchor, Music } from 'lucide-react';
import { beachAudio } from './lib/audio';
import { TIME_CONFIGS, TimeOfDay } from './types';
import BeachWaves from './components/BeachWaves';
import TimeOfDaySelector from './components/TimeOfDaySelector';
import BottleMessage from './components/BottleMessage';
import ShellHunt from './components/ShellHunt';
import MemoryPolaroids from './components/MemoryPolaroids';

export default function App() {
  const [isEntered, setIsEntered] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [timeMode, setTimeMode] = useState<TimeOfDay>('sunset'); // Sunset is highly aesthetic by default!
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0, isBirthday: false });
  const [balloons, setBalloons] = useState<{ id: number; x: number; color: string; speed: number; size: number }[]>([]);
  const [activeWishes, setActiveWishes] = useState<string[]>([]);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; delay: number }[]>([]);

  // 1. Calculate Countdown to July 15, 2026
  useEffect(() => {
    const calculateTimeLeft = () => {
      const birthdayDate = new Date('2026-07-15T00:00:00');
      const now = new Date();
      const difference = birthdayDate.getTime() - now.getTime();

      if (difference <= 0) {
        setCountdown({ hours: 0, minutes: 0, seconds: 0, isBirthday: true });
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setCountdown({ hours, minutes, seconds, isBirthday: false });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Handle Entry and Audio triggers
  const handleEnterBeach = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEntered(true);
    try {
      beachAudio.start(timeMode);
      beachAudio.playSparkle();
      setIsAudioPlaying(true);
    } catch (err) {
      console.warn('Audio synthesis failed to initialize:', err);
    }

    triggerFloatingHearts();
  };

  const handleToggleAudio = () => {
    if (isAudioPlaying) {
      beachAudio.stop();
    } else {
      beachAudio.start(timeMode);
      beachAudio.playSparkle();
    }
    setIsAudioPlaying(!isAudioPlaying);
  };

  const handleTimeChange = (mode: TimeOfDay) => {
    setTimeMode(mode);
    if (isAudioPlaying) {
      beachAudio.updateMode(mode);
    }
  };

  const triggerFloatingHearts = () => {
    const hearts = [...Array(10)].map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 80 + 10,
      delay: i * 0.4,
    }));
    setFloatingHearts(hearts);
  };

  const handleWishReleased = (wish: string) => {
    setActiveWishes((prev) => [wish, ...prev]);

    const colors = ['bg-[#E07A5F]/90', 'bg-[#F2CC8F]/90', 'bg-[#8ECAE6]/95', 'bg-[#FAF9F6]/95', 'bg-[#4A4E69]/90'];
    const newBalloons = [...Array(6)].map((_, i) => ({
      id: Date.now() + i,
      x: 15 + Math.random() * 70,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 12 + Math.random() * 8,
      size: 35 + Math.random() * 25,
    }));

    setBalloons((prev) => [...prev, ...newBalloons]);

    setTimeout(() => {
      setBalloons((prev) => prev.filter((b) => !newBalloons.find((nb) => nb.id === b.id)));
    }, 20000);
  };

  const handlePopBalloon = (id: number) => {
    beachAudio.playSparkle();
    setBalloons((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div id="beach-birthday-app" className="min-h-screen relative font-sans bg-[#FAF9F6] text-[#2C2C2C] overflow-x-hidden selection:bg-[#E07A5F] selection:text-white">
      
      {/* Editorial aesthetic glowing blurred spots */}
      <div className="absolute top-0 left-0 w-full h-full opacity-15 pointer-events-none z-10">
        <div className="absolute top-24 left-10 w-96 h-96 rounded-full bg-[#8ECAE6] filter blur-[80px]" />
        <div className="absolute bottom-40 right-20 w-[500px] h-[500px] rounded-full bg-[#FFB703] filter blur-[120px]" />
      </div>

      {/* LANDING GATE (Autoplay & Personalization screen) */}
      <AnimatePresence>
        {!isEntered && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-[#FAF9F6] overflow-hidden pointer-events-auto"
          >
            {/* Elegant editorial spots for landing */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute -top-24 -left-24 w-[400px] h-[400px] rounded-full bg-[#8ECAE6] filter blur-[100px]" />
              <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-[#E07A5F] filter blur-[120px]" />
            </div>

            <nav className="absolute top-0 left-0 w-full flex justify-between items-center px-12 py-8 select-none pointer-events-none hidden md:flex">
              <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-black text-[#4A4E69]">Private Collection — 2026</span>
              <div className="h-[1px] flex-grow mx-8 bg-[#2C2C2C]/10" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-black text-[#4A4E69]">Birthday Edition</span>
            </nav>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="relative max-w-md w-full bg-white/95 border border-[#2C2C2C]/15 rounded-3xl p-10 shadow-sm text-center text-[#2C2C2C] flex flex-col items-center z-10"
            >
              <span className="text-xs uppercase tracking-[0.4em] font-sans text-[#E07A5F] mb-2 font-black">A Summer Invitation</span>
              
              <h1 className="font-serif text-5xl font-light italic text-[#2C2C2C] tracking-tight leading-none mt-2">
                Gunnu's
              </h1>
              <h1 className="font-serif text-5xl font-extrabold text-[#2C2C2C] tracking-tight leading-none">
                Birthday Beach
              </h1>
              
              <div className="w-12 h-[1px] bg-[#2C2C2C] my-6" />

              <p className="text-xs leading-relaxed text-[#4A4E69] font-medium max-w-xs">
                A magical coastal getaway designed with infinite love by your <span className="font-bold text-[#2C2C2C]">Nanu bhaya</span>.
              </p>

              <form onSubmit={handleEnterBeach} className="w-full mt-8 space-y-5">
                <div>
                  <label htmlFor="name-input" className="block text-[9px] font-black tracking-[0.2em] text-[#4A4E69] uppercase text-center mb-2">
                    Enter Your Name
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    required
                    placeholder="Type your name here..."
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className="w-full px-5 py-3.5 bg-[#FAF9F6] rounded-xl border border-[#2C2C2C]/15 text-[#2C2C2C] font-semibold placeholder-[#4A4E69]/50 focus:outline-none focus:border-[#E07A5F] transition-all text-center text-sm"
                  />
                </div>

                <button
                  id="enter-beach-btn"
                  type="submit"
                  className="w-full py-4 px-6 bg-[#2C2C2C] hover:bg-[#E07A5F] text-[#FAF9F6] font-black tracking-widest uppercase text-xs rounded-xl shadow-xs active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Unlock Birthday Beach
                </button>
              </form>

              <div className="mt-6 flex items-center gap-2 text-[9px] font-sans text-[#4A4E69]/60 tracking-[0.15em] uppercase font-black">
                <Music className="w-3 h-3 text-[#E07A5F] animate-spin duration-[6000ms]" />
                Ambient sound synthesized live
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BACKGROUND SCENE CANVAS */}
      <BeachWaves currentMode={timeMode} />

      {/* APP INTERACTIVE CONTENT */}
      {isEntered && (
        <div id="main-beach-experience" className="relative min-h-screen flex flex-col justify-between z-30 pointer-events-none select-none">
          
          {/* EDITORIAL TOP ROW */}
          <nav className="w-full max-w-6xl mx-auto px-12 pt-8 select-none pointer-events-none hidden md:flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-black text-[#4A4E69]">Private Collection — 2026</span>
            <div className="h-[1px] flex-grow mx-8 bg-[#2C2C2C]/10" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-black text-[#4A4E69]">Birthday Edition</span>
          </nav>

          {/* HEADER BAR (Floating controls) */}
          <header className="w-full max-w-6xl mx-auto px-4 md:px-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto">
            {/* Logo area */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2.5"
            >
              <div className="p-2 bg-[#FAF9F6] border border-[#2C2C2C]/15 rounded-xl shadow-xs">
                <span className="text-xl">🌴</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-light italic text-[#2C2C2C]">
                  Gunnu's Birthday Shore
                </span>
                <span className="text-[9px] font-sans uppercase tracking-[0.15em] text-[#E07A5F] font-bold">
                  Designed by Nanu bhaya
                </span>
              </div>
            </motion.div>

            {/* Time selector and Audio controls */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              {/* Dynamic Sound Controls */}
              <button
                id="toggle-audio-btn"
                onClick={handleToggleAudio}
                className={`p-2.5 rounded-full border shadow-xs flex items-center justify-center transition-all duration-300 relative cursor-pointer ${
                  isAudioPlaying
                    ? 'bg-[#2C2C2C] text-[#FAF9F6] border-[#2C2C2C] animate-pulse'
                    : 'bg-[#FAF9F6] text-[#2C2C2C] border-[#2C2C2C]/15 hover:bg-[#2C2C2C]/5'
                }`}
                title={isAudioPlaying ? 'Mute synthesized ocean waves' : 'Play synthesized ocean waves'}
              >
                {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                {isAudioPlaying && (
                  <span className="absolute inset-0 rounded-full border border-[#2C2C2C]/20 animate-ping pointer-events-none scale-105" />
                )}
              </button>

              {/* Time selector */}
              <TimeOfDaySelector currentMode={timeMode} onModeChange={handleTimeChange} />
            </motion.div>
          </header>

          {/* MAIN COLUMN (Countdown / Message Bottle / Hero wishes) */}
          <main className="flex-1 flex flex-col justify-center items-center py-12 px-4 gap-12 max-w-6xl w-full mx-auto">
            
            {/* HERO SECTION: WELCOME & COUNTDOWN BANNER */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-2xl w-full relative"
            >
              {/* Floating cozy tag label */}
              <div className="mb-4">
                <span className="text-[9px] font-sans uppercase tracking-[0.4em] font-black px-4 py-1.5 bg-[#FAF9F6]/90 border border-[#2C2C2C]/15 rounded-full text-[#E07A5F] shadow-xs inline-block select-none">
                  Aloha, {visitorName}! 🌺
                </span>
              </div>

              {/* Main Greeting Typography */}
              <h2 className="font-serif leading-none tracking-tight text-[#2C2C2C] select-none">
                {countdown.isBirthday ? (
                  <div className="flex flex-col items-center">
                    <span className="text-4xl md:text-5xl font-light italic text-[#E07A5F] block mb-1">Happy Birthday</span>
                    <span className="text-7xl md:text-9xl font-black tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-br from-[#2C2C2C] to-[#4A4E69]">
                      Gunnu! 🎉
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-3xl md:text-4xl font-light italic text-[#4A4E69] block mb-1">A Beautiful Day Awaits</span>
                    <span className="text-6xl md:text-[7.5rem] font-black tracking-tighter uppercase leading-none text-[#2C2C2C]">
                      Gunnu
                    </span>
                  </div>
                )}
              </h2>

              <p className="text-xs md:text-sm text-[#4A4E69] font-medium max-w-md mx-auto mt-6 leading-relaxed">
                {countdown.isBirthday
                  ? 'The tides of love are rising high! Today we celebrate you, Gunnu, with all the warm sand and breezy sunshine of this custom tropical paradise.'
                  : `Tomorrow is Gunnu's magical birthday beach getaway! Here is the custom editorial count-tide down to her special sunrise:`}
              </p>

              {/* COUNTDOWN COMPONENT */}
              <div className="mt-8 flex justify-center pointer-events-auto select-none">
                <AnimatePresence mode="wait">
                  {!countdown.isBirthday ? (
                    <motion.div
                      key="countdown-boxes"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="flex gap-4 items-center"
                    >
                      {[
                        { value: countdown.hours, label: 'Hours' },
                        { value: countdown.minutes, label: 'Mins' },
                        { value: countdown.seconds, label: 'Secs' },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="bg-[#FAF9F6]/95 border border-[#2C2C2C]/15 rounded-2xl w-20 h-24 sm:w-24 sm:h-26 flex flex-col items-center justify-center shadow-xs relative group overflow-hidden"
                        >
                          <div className="absolute top-0 inset-x-0 h-[3px] bg-[#2C2C2C]/10 group-hover:bg-[#E07A5F] transition-colors" />
                          <span className="font-sans text-3xl sm:text-4xl font-black text-[#2C2C2C]">
                            {String(item.value).padStart(2, '0')}
                          </span>
                          <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-[#4A4E69] font-black mt-1">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="celebration-boxes"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-[#FAF9F6]/95 backdrop-blur-md rounded-3xl border border-[#2C2C2C]/15 shadow-sm flex flex-col items-center max-w-sm w-full"
                    >
                      <div className="flex gap-2">
                        <span className="text-3xl animate-bounce">🎂</span>
                        <span className="text-3xl animate-bounce duration-[1500ms]">🎁</span>
                        <span className="text-3xl animate-bounce duration-[2000ms]">👑</span>
                      </div>
                      <h4 className="font-serif text-xl font-bold mt-4 text-[#2C2C2C] text-center">
                        Gunnu's Birthday is Here!
                      </h4>
                      <p className="text-[11px] text-[#4A4E69] mt-2 text-center font-medium leading-relaxed">
                        May your birthday beach be filled with sweet shells, glowing lanterns, and magical memories. Tap on floating balloons to pop them!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* FLOATING BOTTLE INTERACTION */}
            <BottleMessage />

          </main>

          {/* POLAROIDS SLIDESHOW */}
          <MemoryPolaroids />

          {/* BEACH SHELL HUNT & SANDBOX BOARD */}
          <ShellHunt currentMode={timeMode} onWishReleased={handleWishReleased} />

          {/* FOOTER: THE SHORE CREDITS */}
          <footer className="w-full text-center py-10 border-t border-[#2C2C2C]/10 mt-12 bg-[#FAF9F6]/90 select-none pointer-events-auto">
            <div className="max-w-6xl mx-auto px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-sans font-bold uppercase tracking-wider text-[#4A4E69]">
              <div className="flex items-center gap-1.5">
                <Anchor className="w-3.5 h-3.5 text-[#E07A5F] animate-pulse" />
                <span>Private Collection &copy; 2026. Made with ocean breezes.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#4A4E69]">With Love from</span>
                <span className="font-cursive text-2xl text-[#E07A5F] tracking-wide lowercase italic font-normal normal-case">
                  Nanu bhaya
                </span>
                <Heart className="w-4 h-4 text-[#E07A5F] fill-[#E07A5F] animate-pulse" />
              </div>
            </div>
          </footer>

          {/* CELEBRATION FLOATING ENTITIES */}
          <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
            {/* 1. Floating Balloons (Spawns on wish release) */}
            {balloons.map((b) => (
              <motion.div
                key={b.id}
                className={`absolute rounded-full shadow-sm ${b.color} cursor-pointer pointer-events-auto`}
                style={{
                  left: `${b.x}%`,
                  width: `${b.size}px`,
                  height: `${b.size * 1.2}px`,
                  bottom: '-150px',
                }}
                animate={{
                  y: [0, -window.innerHeight - 300],
                  x: [0, (Math.random() - 0.5) * 150, 0],
                  rotate: [-15, 15, -15],
                }}
                transition={{
                  duration: b.speed,
                  ease: 'linear',
                }}
                onClick={() => handlePopBalloon(b.id)}
                whileHover={{ scale: 1.15 }}
              >
                {/* Balloon string */}
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-[1px] h-5 bg-[#2C2C2C]/20" />
                {/* Balloon shine highlight */}
                <div className="absolute top-1.5 left-2 w-1.5 h-3 bg-white/40 rounded-full" />
              </motion.div>
            ))}

            {/* 2. Floating Hearts */}
            {floatingHearts.map((h) => (
              <motion.div
                key={h.id}
                className="absolute text-rose-400 text-2xl select-none"
                style={{
                  left: `${h.x}%`,
                  bottom: '10%',
                }}
                initial={{ opacity: 0, scale: 0.2, y: 0 }}
                animate={{
                  opacity: [0, 1, 0.8, 0],
                  scale: [0.2, 1.2, 1, 0.4],
                  y: -500,
                  x: [0, (Math.random() - 0.5) * 100],
                }}
                transition={{
                  duration: 6,
                  delay: h.delay,
                  ease: 'easeOut',
                  repeat: Infinity,
                }}
              >
                ❤️
              </motion.div>
            ))}

            {/* 3. Floating Starry Lanterns (Night mode only) */}
            {timeMode === 'night' && (
              [...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-5 bg-orange-400/80 rounded-t-md rounded-b-xs shadow-[0_0_8px_3px_rgba(251,146,60,0.4)] select-none"
                  style={{
                    left: `${15 + i * 16}%`,
                    bottom: '12%',
                  }}
                  animate={{
                    y: [0, -window.innerHeight - 200],
                    x: [0, Math.sin(i) * 60, Math.cos(i) * 40],
                    opacity: [0, 0.9, 0.7, 0],
                  }}
                  transition={{
                    duration: 15 + i * 2,
                    repeat: Infinity,
                    delay: i * 3,
                    ease: 'easeInOut',
                  }}
                >
                  <div className="absolute inset-0.5 bg-yellow-100 rounded-sm blur-[1px] animate-pulse" />
                </motion.div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
}
