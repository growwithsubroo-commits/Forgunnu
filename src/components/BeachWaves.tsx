import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TIME_CONFIGS, TimeOfDay } from '../types';

interface BeachWavesProps {
  currentMode: TimeOfDay;
}

export default function BeachWaves({ currentMode }: BeachWavesProps) {
  const config = TIME_CONFIGS[currentMode];
  const [shootingStars, setShootingStars] = useState<{ id: number; top: number; left: number; delay: number }[]>([]);

  // Periodic shooting stars at night
  useEffect(() => {
    if (currentMode !== 'night') {
      setShootingStars([]);
      return;
    }

    const interval = setInterval(() => {
      const newStar = {
        id: Date.now(),
        top: Math.random() * 40,
        left: Math.random() * 70 + 10,
        delay: Math.random() * 2,
      };
      setShootingStars((prev) => [...prev.slice(-3), newStar]); // Keep last 4 max
    }, 6000);

    return () => clearInterval(interval);
  }, [currentMode]);

  return (
    <div id="beach-canvas" className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* 1. SKY GRADIENT BACKDROP */}
      <div className={`absolute inset-0 bg-gradient-to-b ${config.skyGradient} transition-all duration-1000 ease-in-out h-[65%]`} />

      {/* 2. STARS AND CONSTELLATIONS (NIGHT ONLY) */}
      <AnimatePresence>
        {currentMode === 'night' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 h-[55%] overflow-hidden"
          >
            {/* Random glowing stars */}
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_4px_1px_rgba(255,255,255,0.8)]"
                style={{
                  top: `${Math.random() * 80}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${1.5 + Math.random() * 3.5}s`,
                  transform: `scale(${0.3 + Math.random() * 0.8})`,
                }}
              />
            ))}

            {/* Shooting stars */}
            {shootingStars.map((star) => (
              <motion.div
                key={star.id}
                initial={{ x: -100, y: -100, opacity: 0, scale: 1 }}
                animate={{
                  x: 350,
                  y: 180,
                  opacity: [0, 1, 1, 0],
                  scale: [1, 1.2, 0.5, 0],
                }}
                transition={{
                  duration: 1.2,
                  delay: star.delay,
                  ease: 'easeOut',
                }}
                className="absolute w-28 h-[1px] bg-gradient-to-r from-white via-cyan-200 to-transparent rotate-[30deg] origin-left shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                style={{
                  top: `${star.top}%`,
                  left: `${star.left}%`,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. DRIFTING SUNNY CLOUDS (DAYTIME ONLY) */}
      <AnimatePresence>
        {currentMode !== 'night' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 h-[45%] overflow-hidden pointer-events-none"
          >
            {[
              { top: '15%', scale: 0.8, delay: 0, duration: 80, opacity: 0.65 },
              { top: '8%', scale: 1.3, delay: 15, duration: 60, opacity: 0.4 },
              { top: '22%', scale: 1.0, delay: 35, duration: 70, opacity: 0.5 },
            ].map((cloud, index) => (
              <div
                key={index}
                className="absolute bg-white/40 blur-[1px] rounded-full p-4 w-44 h-12 shadow-[0_4px_12px_rgba(255,255,255,0.1)] animate-drift-slow"
                style={{
                  top: cloud.top,
                  transform: `scale(${cloud.scale})`,
                  animationDelay: `-${cloud.delay}s`,
                  animationDuration: `${cloud.duration}s`,
                  opacity: cloud.opacity,
                }}
              >
                <div className="absolute -top-6 left-6 w-16 h-16 bg-white/40 rounded-full" />
                <div className="absolute -top-4 right-10 w-12 h-12 bg-white/40 rounded-full" />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. CELESTIAL ORB (SUN / MOON) */}
      <div className={`absolute rounded-full transition-all duration-[2000ms] ease-in-out ${config.celestialClass}`} />

      {/* 5. PARALLAX DISTANT MOUNTAINS / HORIZON ISLAND */}
      <div className="absolute bottom-[35%] left-0 right-0 h-16 flex justify-center items-end opacity-40">
        <svg viewBox="0 0 1440 100" className="w-full h-12 fill-teal-900/10 transition-colors duration-1000">
          <path d="M0,80 Q250,20 500,75 T1000,45 T1440,90 L1440,100 L0,100 Z" />
        </svg>
      </div>

      {/* 6. OCEAN WAVES CONTAINER */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%] flex flex-col justify-end">
        {/* WAVE 1 (Back deep wave) */}
        <div className="absolute bottom-16 left-0 right-0 h-28 pointer-events-none">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className={`w-full h-full fill-gradient animate-wave-slow transition-all duration-1000 ease-in-out`}
            style={{ fill: currentMode === 'night' ? 'rgb(15, 23, 42)' : currentMode === 'sunset' ? 'rgb(147, 51, 234)' : currentMode === 'morning' ? 'rgb(14, 116, 144)' : 'rgb(13, 148, 136)' }}
          >
            <path d="M0,60 C320,100 480,20 800,70 C1120,120 1280,30 1440,60 L1440,120 L0,120 Z" opacity="0.6" />
          </svg>
        </div>

        {/* WAVE 2 (Middle rolling wave) */}
        <div className="absolute bottom-10 left-0 right-0 h-24 pointer-events-none">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="w-full h-full animate-wave-medium transition-all duration-1000 ease-in-out"
            style={{ fill: currentMode === 'night' ? 'rgb(30, 41, 59)' : currentMode === 'sunset' ? 'rgb(219, 39, 119)' : currentMode === 'morning' ? 'rgb(20, 184, 166)' : 'rgb(20, 184, 166)' }}
          >
            <path d="M0,50 C240,10 480,90 720,50 C960,10 1200,90 1440,50 L1440,120 L0,120 Z" opacity="0.8" />
          </svg>
        </div>

        {/* WAVE 3 (Front shore wave with white foam) */}
        <div className="absolute bottom-2 left-0 right-0 h-20 pointer-events-none z-10">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="w-full h-full animate-wave-fast transition-all duration-1000 ease-in-out"
            style={{ fill: currentMode === 'night' ? 'rgb(13, 148, 136, 0.4)' : currentMode === 'sunset' ? 'rgb(251, 146, 60, 0.5)' : currentMode === 'morning' ? 'rgb(254, 243, 199, 0.4)' : 'rgb(204, 251, 241, 0.5)' }}
          >
            <path d="M0,40 C360,90 720,10 1080,70 C1260,100 1380,40 1440,30 L1440,120 L0,120 Z" opacity="0.9" />
          </svg>
        </div>
      </div>

      {/* 7. WARM SAND BED AT SHORE */}
      <div className={`absolute bottom-0 left-0 right-0 h-[22%] bg-gradient-to-b ${config.sandGradient} transition-all duration-1000 ease-in-out shadow-[inset_0_15px_30px_rgba(0,0,0,0.04)] custom-sand-texture z-20`}>
        {/* Wet sand reflection gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/20 mix-blend-overlay pointer-events-none" />

        {/* Night Campfire (renders only in Night mode) */}
        <AnimatePresence>
          {currentMode === 'night' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 50 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute bottom-8 left-[25%] -translate-x-1/2 z-30 flex flex-col items-center pointer-events-auto"
            >
              {/* Campfire logs */}
              <div className="relative w-16 h-8 bg-amber-950 rounded-md rotate-[12deg] shadow-lg flex justify-center items-center">
                <div className="absolute w-16 h-8 bg-amber-900 rounded-md rotate-[-24deg] border border-amber-950/20" />
                <div className="absolute w-4 h-4 bg-amber-950 rounded-full blur-[1px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>

              {/* Glowing charcoal base */}
              <div className="absolute bottom-1 w-12 h-4 bg-orange-600 rounded-full blur-[3px] animate-pulse" />

              {/* Animated Flames */}
              <div className="absolute bottom-3 w-10 h-16 flex justify-center items-end overflow-visible">
                {/* Flame 1 - Main Center */}
                <motion.div
                  animate={{
                    scaleY: [1, 1.3, 0.9, 1.2, 1],
                    scaleX: [1, 0.8, 1.1, 0.9, 1],
                    rotate: [-1, 2, -2, 1, 0],
                    borderRadius: ['40% 40% 20% 20%', '50% 30% 30% 20%', '30% 50% 20% 35%', '40% 40% 20% 20%'],
                  }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  className="absolute w-8 h-12 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-300 origin-bottom blur-[1px] shadow-[0_-5px_15px_rgba(249,115,22,0.8)]"
                />

                {/* Flame 2 - Right side */}
                <motion.div
                  animate={{
                    scaleY: [1, 1.4, 0.8, 1.1, 1],
                    scaleX: [1, 0.7, 1.2, 0.8, 1],
                    rotate: [2, -3, 3, -1, 2],
                  }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: 0.2, ease: 'easeInOut' }}
                  className="absolute w-5 h-8 bg-gradient-to-t from-red-500 via-orange-400 to-yellow-200 origin-bottom right-1 blur-[1px] opacity-90"
                />

                {/* Flame 3 - Left side */}
                <motion.div
                  animate={{
                    scaleY: [1, 1.2, 0.9, 1.3, 1],
                    scaleX: [1, 1.1, 0.8, 1.0, 1],
                    rotate: [-3, 1, -2, 2, -3],
                  }}
                  transition={{ repeat: Infinity, duration: 1.8, delay: 0.4, ease: 'easeInOut' }}
                  className="absolute w-5 h-9 bg-gradient-to-t from-red-500 via-orange-400 to-yellow-200 origin-bottom left-1 blur-[1px] opacity-90"
                />

                {/* Flame Sparkles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -35 - Math.random() * 40],
                      x: [0, (Math.random() - 0.5) * 30],
                      opacity: [0, 1, 0],
                      scale: [1.2, 0.8, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1 + Math.random() * 1.5,
                      delay: i * 0.3,
                      ease: 'easeOut',
                    }}
                    className="absolute bottom-4 w-1.5 h-1.5 bg-yellow-300 rounded-full shadow-[0_0_8px_#f59e0b]"
                  />
                ))}
              </div>

              {/* Light glow surrounding campfire */}
              <div className="absolute bottom-0 w-44 h-24 bg-orange-500/20 rounded-full blur-2xl pointer-events-none -translate-y-4" />
              <span className="text-[10px] font-mono tracking-widest text-orange-400/80 uppercase mt-4 animate-pulse">
                Warm campfire
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
