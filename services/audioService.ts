class AudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  public init() {
    // Resume context if suspended (browser policy)
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  public playLeverPull() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  public playSpinLoop() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    
    // Modulate frequency to sound like spinning
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 15; // Speed of spin sound
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 50;
    
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    lfo.start();

    return {
      stop: () => {
        const stopTime = ctx.currentTime + 0.5;
        gain.gain.exponentialRampToValueAtTime(0.001, stopTime);
        osc.stop(stopTime);
        lfo.stop(stopTime);
      }
    };
  }

  public playWin() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    
    const now = ctx.currentTime;
    [0, 0.1, 0.2, 0.4].forEach((offset, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440 + (i * 110), now + offset); // A major chord ish
      
      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.3, now + offset + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.6);
    });
  }

  public playTick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }
}

export const audioService = new AudioService();
