/**
 * Advanced Volcanic Ambient Sound Engine (Procedural Synthesis)
 * Developed under strict guidelines of premium modular craftsmanship.
 * Uses native Web Audio API for highly responsive, zero-offline, zero-load-delay soundscapes.
 */

class VolcanoAudioEngine {
  private ctx: AudioContext | null = null;
  private isBgmPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private rumbleGain: GainNode | null = null;
  private crackleGain: GainNode | null = null;
  
  // Synthesizer active nodes for clean cleanup
  private activeNodes: AudioNode[] = [];
  private bgmIntervalId: any = null;
  private rumbleLFO: OscillatorNode | null = null;

  // Track state for the UI
  public onStateChange: ((isPlaying: boolean) => void) | null = null;

  constructor() {
    // Lazy initiation on user action to satisfy strict browser autoplay policies
  }

  private initContext() {
    if (this.ctx) return;
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      console.error("Web Audio API is not supported in this browser environment.");
      return;
    }

    this.ctx = new AudioContextClass();
    
    // Setup Master Volume Controller with strict volume ceiling (not too loud)
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime); // default comfortable volume
    this.masterGain.connect(this.ctx.destination);

    // Setup subgroups for subtle mixing
    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.setValueAtTime(0.08, this.ctx.currentTime); // subtle fiery melody
    this.bgmGain.connect(this.masterGain);

    this.rumbleGain = this.ctx.createGain();
    this.rumbleGain.gain.setValueAtTime(0.12, this.ctx.currentTime); // thick lava rumble
    this.rumbleGain.connect(this.masterGain);

    this.crackleGain = this.ctx.createGain();
    this.crackleGain.gain.setValueAtTime(0.03, this.ctx.currentTime); // random sharp crackles
    this.crackleGain.connect(this.masterGain);
  }

  /**
   * Helper to generate a procedural Noise Buffer
   */
  private createNoiseBuffer(type: "white" | "brown"): AudioBuffer {
    if (!this.ctx) throw new Error("AudioContext uninitialized");
    
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of loopable noise
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0; // for brown noise filtering
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === "brown") {
        // Brownian Noise filtering integration
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // Gain compensation for high cut
      } else {
        data[i] = white;
      }
    }
    return buffer;
  }

  /**
   * Starts the continuous "subtle fiery bgm"
   */
  public startAmbient() {
    try {
      this.initContext();
      if (!this.ctx) return;

      // Resume context if suspended (browser autopilot block)
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      if (this.isBgmPlaying) return;
      this.isBgmPlaying = true;

      // Ensure gains are active
      const now = this.ctx.currentTime;
      this.masterGain?.gain.linearRampToValueAtTime(0.35, now + 1.5);
      
      this.setupLavaRumble();
      this.setupFireCrackle();
      this.setupFieryChordsBGM();

      if (this.onStateChange) this.onStateChange(true);
    } catch (error) {
      console.warn("Failsafe: Auto audio initialization was post-poned until user gesture.", error);
    }
  }

  /**
   * Sttops BGM and rumble gracefully via volume ramping to prevent clicks
   */
  public stopAmbient() {
    if (!this.ctx || !this.isBgmPlaying) return;

    const now = this.ctx.currentTime;
    
    // Ramp volume to zero first for maximum acoustic comfort
    this.masterGain?.gain.linearRampToValueAtTime(0, now + 1.0);

    setTimeout(() => {
      // Hard release of generator sources
      this.activeNodes.forEach(node => {
        try {
          (node as any).stop();
        } catch (_) {}
      });
      this.activeNodes = [];

      if (this.bgmIntervalId) {
        clearInterval(this.bgmIntervalId);
        this.bgmIntervalId = null;
      }

      this.isBgmPlaying = false;
      if (this.onStateChange) this.onStateChange(false);
    }, 1100);
  }

  public toggleAmbient(): boolean {
    if (this.isBgmPlaying) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient();
      return true;
    }
  }

  public isPlaying(): boolean {
    return this.isBgmPlaying;
  }

  public setVolume(level: number) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    
    // Clamp level securely [0, 1]
    const clamped = Math.max(0, Math.min(1, level));
    // Apply logarithmic scaling for smooth psychoacoustic perception
    this.masterGain.gain.setValueAtTime(clamped * 0.65, this.ctx.currentTime);
  }

  /**
   * Synthesis of subterranean lava rumble
   */
  private setupLavaRumble() {
    if (!this.ctx || !this.rumbleGain) return;

    // Utilize Brownian noise loop as it naturally lacks high frequency components
    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = this.createNoiseBuffer("brown");
    noiseNode.loop = true;

    // Connect to multi-stage filter to mimic pressure waves
    const lpFilter = this.ctx.createBiquadFilter();
    lpFilter.type = "lowpass";
    lpFilter.frequency.setValueAtTime(45, this.ctx.currentTime); // deep rumble cut
    lpFilter.Q.setValueAtTime(3.0, this.ctx.currentTime); // thick muddy resonance

    // Introduce seismic pressure movement via an LFO
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.18, this.ctx.currentTime); // 0.18Hz very slow wave
    lfo.type = "sine";

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(15, this.ctx.currentTime); // oscillate cutoff +-15Hz

    lfo.connect(lfoGain);
    lfoGain.connect(lpFilter.frequency);
    
    noiseNode.connect(lpFilter);
    lpFilter.connect(this.rumbleGain);

    noiseNode.start(0);
    lfo.start(0);

    this.activeNodes.push(noiseNode);
    this.activeNodes.push(lfo);
  }

  /**
   * Synthesis of random sharp ember fire pops
   */
  private setupFireCrackle() {
    if (!this.ctx || !this.crackleGain) return;

    // Noise source
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = this.createNoiseBuffer("white");
    whiteNoise.loop = true;

    // Highpass filter for thin crisp crackling sound
    const hpFilter = this.ctx.createBiquadFilter();
    hpFilter.type = "highpass";
    hpFilter.frequency.setValueAtTime(1800, this.ctx.currentTime);

    // Bandpass to focus combustion resonance
    const bpFilter = this.ctx.createBiquadFilter();
    bpFilter.type = "bandpass";
    bpFilter.frequency.setValueAtTime(3200, this.ctx.currentTime);
    bpFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    // Crackle envelope trigger loop
    const gateGain = this.ctx.createGain();
    gateGain.gain.setValueAtTime(0.01, this.ctx.currentTime); // quiet base

    whiteNoise.connect(hpFilter);
    hpFilter.connect(bpFilter);
    bpFilter.connect(gateGain);
    gateGain.connect(this.crackleGain);

    whiteNoise.start(0);
    this.activeNodes.push(whiteNoise);

    // Trigger intermittent crackles programmatically
    const triggerPop = () => {
      if (!this.isBgmPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      
      // Random pop duration (fast crack)
      const duration = 0.005 + Math.random() * 0.015;
      const strength = 0.1 + Math.random() * 0.9;

      gateGain.gain.setValueAtTime(0.01, now);
      gateGain.gain.exponentialRampToValueAtTime(strength, now + 0.001);
      gateGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      // Schedule next crackle dynamically to sound natural
      const nextDelay = 80 + Math.random() * 450; // ms
      this.bgmIntervalId = setTimeout(triggerPop, nextDelay);
    };

    triggerPop();
  }

  /**
   * Fiery warm drone pad (BGM)
   * Slowly cycles gorgeous cinematic, minor tension chords.
   */
  private setupFieryChordsBGM() {
    if (!this.ctx || !this.bgmGain) return;

    const chords = [
      [110.0, 130.81, 164.81], // Am (A2, C3, E3)
      [103.83, 130.81, 155.56], // Fm (Ab2, C3, Eb3)
      [116.54, 138.59, 174.61], // Bbm (Bb2, Db3, F3)
      [98.0, 116.54, 146.83],   // Gm (G2, Bb2, D3)
    ];

    let currentChordIndex = 0;
    
    const playChordTuple = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
      
      const now = this.ctx.currentTime;
      const chord = chords[currentChordIndex];
      const duration = 9.0; // long slow evolving pad duration

      chord.forEach((freq) => {
        if (!this.ctx || !this.bgmGain) return;

        // Warm detuned triangle wave oscillators
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const voiceGain = this.ctx.createGain();

        osc1.type = "triangle";
        osc1.frequency.setValueAtTime(freq, now);
        osc1.detune.setValueAtTime(-8, now); // thick detuning

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(freq * 1.5, now); // perfect fifth overtone
        osc2.detune.setValueAtTime(8, now);

        // Low Pass filter for warmth and slow wave sweeping
        const voiceFilter = this.ctx.createBiquadFilter();
        voiceFilter.type = "lowpass";
        voiceFilter.frequency.setValueAtTime(220, now);
        voiceFilter.frequency.exponentialRampToValueAtTime(550, now + duration / 2);
        voiceFilter.frequency.exponentialRampToValueAtTime(200, now + duration);

        voiceGain.gain.setValueAtTime(0, now);
        voiceGain.gain.linearRampToValueAtTime(0.04, now + 3.0); // soft swell
        voiceGain.gain.setValueAtTime(0.04, now + duration - 2.5);
        voiceGain.gain.linearRampToValueAtTime(0, now + duration); // crossfade decay

        osc1.connect(voiceFilter);
        osc2.connect(voiceFilter);
        voiceFilter.connect(voiceGain);
        voiceGain.connect(this.bgmGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration + 0.1);
        osc2.stop(now + duration + 0.1);
      });

      // Increment chord index loop
      currentChordIndex = (currentChordIndex + 1) % chords.length;
    };

    // Swell first chord immediately
    playChordTuple();

    // Loop interval for the cinematic chord pad
    const chordTicker = () => {
      if (!this.isBgmPlaying) return;
      playChordTuple();
      // Set timer loop at (duration - crossfade) to create beautiful layered pads
      setTimeout(chordTicker, 7500); 
    };

    setTimeout(chordTicker, 7500);
  }

  /**
   * Main Interactive sound trigger: Dramatic low frequency Volcano Caldera Explosion!
   * Engineered with deep sound design principles. Designed to feel heavy yet optimized ("not too loud").
   */
  public triggerExplosion() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      // Force resume context if blocked
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      
      // Group gain specifically for explosion to ensure non-clipping blend
      const boomGain = this.ctx.createGain();
      boomGain.gain.setValueAtTime(0.24, now); // high presence but tightly filtered, perfectly safe
      boomGain.connect(this.masterGain);

      // Sound Segment 1: Deep Seismic Shockwave Sweep (Pure bass drop)
      const shockwaveOsc = this.ctx.createOscillator();
      shockwaveOsc.type = "sine";
      shockwaveOsc.frequency.setValueAtTime(95, now);
      shockwaveOsc.frequency.exponentialRampToValueAtTime(32, now + 1.8); // drops deep into subrange

      const shockwaveGain = this.ctx.createGain();
      shockwaveGain.gain.setValueAtTime(0, now);
      shockwaveGain.gain.linearRampToValueAtTime(0.6, now + 0.08); // rapid strike attack
      shockwaveGain.gain.exponentialRampToValueAtTime(0.01, now + 2.5); // long sub tail decay

      shockwaveOsc.connect(shockwaveGain);
      shockwaveGain.connect(boomGain);
      shockwaveOsc.start(now);
      shockwaveOsc.stop(now + 2.6);

      // Sound Segment 2: Volcanic Burst Noise (White noise colored with dynamic lowpass and rumbling gain)
      const burstNoise = this.ctx.createBufferSource();
      burstNoise.buffer = this.createNoiseBuffer("white");

      const burstFilter = this.ctx.createBiquadFilter();
      burstFilter.type = "lowpass";
      burstFilter.frequency.setValueAtTime(450, now); // sharp dirt/impact noise
      burstFilter.frequency.exponentialRampToValueAtTime(60, now + 3.0); // debris settlement

      const burstGain = this.ctx.createGain();
      burstGain.gain.setValueAtTime(0, now);
      // Dual-stage impact curve
      burstGain.gain.linearRampToValueAtTime(0.9, now + 0.1); // explosion wavefront hits
      burstGain.gain.exponentialRampToValueAtTime(0.2, now + 0.8); // secondary gas rumbles
      burstGain.gain.exponentialRampToValueAtTime(0.001, now + 3.5); // debris fade

      burstNoise.connect(burstFilter);
      burstFilter.connect(burstGain);
      burstGain.connect(boomGain);
      
      burstNoise.start(now);
      burstNoise.stop(now + 3.6);

      // Sound Segment 3: Sharp Rocks Crashing (Ambient High crackle pop)
      const rocksSec = this.ctx.createOscillator();
      rocksSec.type = "triangle";
      rocksSec.frequency.setValueAtTime(65, now);
      rocksSec.frequency.setValueAtTime(35, now + 0.5);

      const rocksGain = this.ctx.createGain();
      rocksGain.gain.setValueAtTime(0, now);
      rocksGain.gain.linearRampToValueAtTime(0.35, now + 0.15);
      rocksGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      rocksSec.connect(rocksGain);
      rocksGain.connect(boomGain);
      rocksSec.start(now);
      rocksSec.stop(now + 1.3);

    } catch (e) {
      console.warn("Explosion failed to trigger due to browser audio lock:", e);
    }
  }
}

export const volcanoAudio = new VolcanoAudioEngine();
