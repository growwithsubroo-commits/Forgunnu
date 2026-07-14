export class BeachAudioSynth {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentMode: 'morning' | 'afternoon' | 'sunset' | 'night' = 'afternoon';

  // Wave nodes
  private noiseSource: AudioBufferSourceNode | null = null;
  private waveFilter: BiquadFilterNode | null = null;
  private waveGain: GainNode | null = null;
  private waveInterval: any = null;

  // Campfire nodes (Night only)
  private campfireInterval: any = null;
  private campfireGain: GainNode | null = null;

  // Seagulls (Day/Sunset only)
  private seagullInterval: any = null;

  // Master Gain for volume control
  private masterGain: GainNode | null = null;

  constructor() {
    // Audio Context is initialized lazily upon user interaction due to browser autoplay policies
  }

  private initContext() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    this.ctx = new AudioContextClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime); // default comfortable volume
    this.masterGain.connect(this.ctx.destination);
  }

  public setVolume(vol: number) {
    if (!this.ctx || !this.masterGain) return;
    const clamped = Math.max(0, Math.min(1, vol));
    this.masterGain.gain.linearRampToValueAtTime(clamped, this.ctx.currentTime + 0.1);
  }

  public start(mode: 'morning' | 'afternoon' | 'sunset' | 'night' = 'afternoon') {
    this.initContext();
    if (!this.ctx) return;

    if (this.isPlaying) {
      this.stop();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;
    this.currentMode = mode;

    this.startWaves();
    this.startSeagulls();
    this.startCampfire();
  }

  public updateMode(mode: 'morning' | 'afternoon' | 'sunset' | 'night') {
    this.currentMode = mode;
    if (!this.isPlaying) return;

    // Adjust parameters for different times of day
    if (mode === 'night') {
      this.startCampfire();
    } else {
      this.stopCampfire();
    }

    if (mode === 'night' || mode === 'sunset') {
      // Fewer seagulls at sunset/night
      this.startSeagulls();
    } else {
      this.startSeagulls();
    }
  }

  public stop() {
    this.isPlaying = false;
    this.stopWaves();
    this.stopSeagulls();
    this.stopCampfire();

    if (this.ctx && this.ctx.state === 'running') {
      // Just suspend context to be clean
      this.ctx.suspend();
    }
  }

  private createNoiseBuffer(): AudioBuffer {
    if (!this.ctx) throw new Error('AudioContext not initialized');
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = sampleRate * 4; // 4 seconds of noise
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  private startWaves() {
    if (!this.ctx || !this.masterGain) return;

    try {
      // Create white noise source
      const buffer = this.createNoiseBuffer();
      this.noiseSource = this.ctx.createBufferSource();
      this.noiseSource.buffer = buffer;
      this.noiseSource.loop = true;

      // Filter to shape wave sound (rolling lowpass)
      this.waveFilter = this.ctx.createBiquadFilter();
      this.waveFilter.type = 'lowpass';
      this.waveFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);
      this.waveFilter.frequency.setValueAtTime(400, this.ctx.currentTime);

      // Gain to shape wave amplitude (in/out)
      this.waveGain = this.ctx.createGain();
      this.waveGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      // Connect
      this.noiseSource.connect(this.waveFilter);
      this.waveFilter.connect(this.waveGain);
      this.waveGain.connect(this.masterGain);

      this.noiseSource.start();

      // Begin periodic wave cycle simulation (every 8 seconds)
      let waveState = 'out';
      const triggerWaveCycle = () => {
        if (!this.ctx || !this.waveFilter || !this.waveGain || !this.isPlaying) return;

        const now = this.ctx.currentTime;
        const cycleTime = this.currentMode === 'night' ? 9 : 7; // Night waves are slower and deeper

        if (waveState === 'out') {
          // Roll wave IN
          const maxFreq = this.currentMode === 'afternoon' ? 900 : this.currentMode === 'sunset' ? 700 : this.currentMode === 'morning' ? 750 : 550;
          const maxVol = this.currentMode === 'afternoon' ? 0.18 : this.currentMode === 'sunset' ? 0.14 : this.currentMode === 'morning' ? 0.15 : 0.08;

          this.waveFilter.frequency.exponentialRampToValueAtTime(maxFreq, now + cycleTime * 0.4);
          this.waveGain.gain.linearRampToValueAtTime(maxVol, now + cycleTime * 0.4);
          waveState = 'in';
        } else {
          // Roll wave OUT
          const minFreq = this.currentMode === 'night' ? 180 : 250;
          const minVol = 0.015;

          this.waveFilter.frequency.exponentialRampToValueAtTime(minFreq, now + cycleTime * 0.6);
          this.waveGain.gain.linearRampToValueAtTime(minVol, now + cycleTime * 0.6);
          waveState = 'out';
        }
      };

      // Run immediately and setup interval
      triggerWaveCycle();
      this.waveInterval = setInterval(triggerWaveCycle, 4000); // Trigger transition changes every 4s
    } catch (e) {
      console.error('Failed to start wave synthesizer:', e);
    }
  }

  private stopWaves() {
    if (this.waveInterval) {
      clearInterval(this.waveInterval);
      this.waveInterval = null;
    }
    try {
      if (this.noiseSource) {
        this.noiseSource.stop();
        this.noiseSource.disconnect();
        this.noiseSource = null;
      }
    } catch (e) {}
    this.waveFilter = null;
    this.waveGain = null;
  }

  private startCampfire() {
    if (!this.ctx || !this.masterGain || this.currentMode !== 'night') return;
    if (this.campfireInterval) return;

    this.campfireGain = this.ctx.createGain();
    this.campfireGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    this.campfireGain.connect(this.masterGain);

    // Crackle generator: plays micro-pulses at random intervals to simulate crackling sparks
    const playCrackle = () => {
      if (!this.ctx || !this.campfireGain || !this.isPlaying || this.currentMode !== 'night') return;

      const now = this.ctx.currentTime;
      // High frequency snap
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1500 + Math.random() * 2000, now);
      // Sweep down quickly
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.015);

      gain.gain.setValueAtTime(0.1 + Math.random() * 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

      osc.connect(gain);
      gain.connect(this.campfireGain);

      osc.start(now);
      osc.stop(now + 0.02);

      // Schedule next crackle
      const nextDelay = 50 + Math.random() * 350; // crackle randomly
      this.campfireInterval = setTimeout(playCrackle, nextDelay);
    };

    playCrackle();
  }

  private stopCampfire() {
    if (this.campfireInterval) {
      clearTimeout(this.campfireInterval);
      this.campfireInterval = null;
    }
    if (this.campfireGain) {
      this.campfireGain.disconnect();
      this.campfireGain = null;
    }
  }

  private startSeagulls() {
    if (!this.ctx || !this.masterGain) return;
    if (this.seagullInterval) {
      clearInterval(this.seagullInterval);
    }

    const triggerSeagullGroup = () => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      // No seagulls at night! Very rare at sunset.
      if (this.currentMode === 'night') return;
      if (this.currentMode === 'sunset' && Math.random() > 0.3) return; // 30% chance

      // Play 2-3 seagull chirps in sequence
      let chirpCount = 1 + Math.floor(Math.random() * 3);
      let delay = 0;

      const playChirp = () => {
        if (!this.ctx || !this.masterGain || !this.isPlaying) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        // Seagull sound: high pitch sweep down then slight up "ka-waaaah"
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.1);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.25);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        // Simple highpass filter to make it sound slightly distant
        const hp = this.ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.setValueAtTime(600, now);

        osc.connect(hp);
        hp.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.3);
      };

      for (let i = 0; i < chirpCount; i++) {
        setTimeout(playChirp, delay);
        delay += 350 + Math.random() * 150;
      }
    };

    // Seagull sounds trigger every 15-25 seconds during the day
    this.seagullInterval = setInterval(triggerSeagullGroup, 18000);
    // Play one early on startup
    setTimeout(triggerSeagullGroup, 4000);
  }

  private stopSeagulls() {
    if (this.seagullInterval) {
      clearInterval(this.seagullInterval);
      this.seagullInterval = null;
    }
  }

  // Synthesizes a beautiful little sparkle sound when clicking items
  public playSparkle() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.001, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.03, now + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.3);
      });
    } catch (e) {}
  }
}

// Single instance of the audio synth
export const beachAudio = new BeachAudioSynth();
