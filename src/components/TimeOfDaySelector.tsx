import React from 'react';
import { TIME_CONFIGS, TimeOfDay, TimeConfig } from '../types';
import { beachAudio } from '../lib/audio';

interface TimeOfDaySelectorProps {
  currentMode: TimeOfDay;
  onModeChange: (mode: TimeOfDay) => void;
}

export default function TimeOfDaySelector({ currentMode, onModeChange }: TimeOfDaySelectorProps) {
  const modes = Object.values(TIME_CONFIGS);

  const handleModeSelect = (mode: TimeConfig) => {
    onModeChange(mode.id);
    beachAudio.playSparkle();
    beachAudio.updateMode(mode.id);
  };

  return (
    <div id="time-of-day-selector" className="bg-[#FAF9F6]/90 border border-[#2C2C2C]/15 rounded-full px-4 py-1.5 flex items-center gap-2.5 shadow-xs backdrop-blur-md transition-all duration-500 hover:border-[#2C2C2C]/30">
      <span className="text-[10px] font-sans font-black tracking-[0.15em] uppercase text-[#4A4E69] pl-1 hidden md:inline select-none">
        Beach Mood
      </span>
      <div className="h-3 w-[1px] bg-[#2C2C2C]/15 hidden md:block" />
      <div className="flex items-center gap-1">
        {modes.map((mode) => {
          const isActive = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              id={`btn-mode-${mode.id}`}
              onClick={() => handleModeSelect(mode)}
              className={`relative px-3 py-1 rounded-full text-xs font-bold font-sans tracking-wide transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-[#2C2C2C] text-[#FAF9F6] shadow-xs scale-102'
                  : 'text-[#2C2C2C]/75 hover:text-[#2C2C2C] hover:bg-[#2C2C2C]/5'
              }`}
              title={`Switch to ${mode.label}`}
            >
              <span className="text-sm">{mode.icon}</span>
              <span className={`transition-all duration-300 ${isActive ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0 overflow-hidden sm:max-w-[100px] sm:opacity-80'}`}>
                {mode.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
