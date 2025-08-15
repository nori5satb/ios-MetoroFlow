import { audioEngine } from './AudioEngine';
import { useMetronomeStore } from '../../stores/metronomeStore';
import { useAppSettingsStore } from '../../stores/appSettingsStore';
import { getTimeSignatureInfo } from '../../utils/timeSignature';

export interface MetronomeEngineOptions {
  onBeat?: (beat: number, bar: number) => void;
  onStop?: () => void;
  onStart?: () => void;
}

class MetronomeEngine {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private nextBeatTime = 0;
  private schedulerIntervalMs = 25; // How often to check for beats to schedule
  private scheduleAheadTime = 0.1; // How far ahead to schedule beats (in seconds)
  private startTime = 0;
  private currentBeat = 0;
  private currentBar = 0;
  private isCountingIn = false;
  private countInBeatsRemaining = 0;
  private options: MetronomeEngineOptions = {};
  private isPaused = false;
  private pausedAt = 0;
  private pausedBeatPosition = 0;

  /**
   * Initialize the metronome engine
   */
  async initialize(): Promise<void> {
    await audioEngine.initialize();
  }

  /**
   * Start the metronome
   */
  async start(options: MetronomeEngineOptions = {}): Promise<void> {
    this.options = options;
    
    // Stop if already running
    if (this.intervalId) {
      this.stop();
    }

    const state = useMetronomeStore.getState();
    const settings = useAppSettingsStore.getState();

    // Initialize timing
    this.startTime = Date.now() / 1000;
    this.nextBeatTime = this.startTime;
    this.currentBeat = 0;
    this.currentBar = 0;

    // Handle count-in if enabled
    if (state.countIn) {
      this.isCountingIn = true;
      this.countInBeatsRemaining = state.countInBars * state.timeSignature.numerator;
    } else {
      this.isCountingIn = false;
      this.countInBeatsRemaining = 0;
    }

    // Apply audio latency compensation
    const latencyCompensation = settings.audioLatencyCompensation / 1000;
    this.nextBeatTime -= latencyCompensation;

    // Load the selected sound type
    await audioEngine.loadSoundSet(state.clickSound);
    
    // Set volume
    await audioEngine.setVolume(state.volume);

    // Start the scheduler
    this.intervalId = setInterval(() => {
      this.scheduler();
    }, this.schedulerIntervalMs);

    // Update store state
    useMetronomeStore.getState().startPlayback();
    
    // Trigger callback
    this.options.onStart?.();
  }

  /**
   * Stop the metronome
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.currentBeat = 0;
    this.currentBar = 0;
    this.isCountingIn = false;
    this.countInBeatsRemaining = 0;
    this.isPaused = false;
    this.pausedAt = 0;
    this.pausedBeatPosition = 0;

    // Update store state
    useMetronomeStore.getState().stopPlayback();
    
    // Trigger callback
    this.options.onStop?.();
  }

  /**
   * Pause the metronome (preserves position)
   */
  pause(): void {
    if (this.intervalId && !this.isPaused) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.isPaused = true;
      this.pausedAt = Date.now() / 1000;
      this.pausedBeatPosition = this.currentBeat;
      
      // Update store state
      useMetronomeStore.getState().stopPlayback();
      
      // Trigger callback
      this.options.onStop?.();
    }
  }

  /**
   * Resume the metronome from paused position
   */
  async resume(): Promise<void> {
    if (this.isPaused) {
      const pauseDuration = (Date.now() / 1000) - this.pausedAt;
      this.nextBeatTime += pauseDuration;
      this.startTime += pauseDuration;
      this.isPaused = false;
      
      // Restart the scheduler
      this.intervalId = setInterval(() => {
        this.scheduler();
      }, this.schedulerIntervalMs);

      // Update store state
      useMetronomeStore.getState().startPlayback();
      
      // Trigger callback
      this.options.onStart?.();
    }
  }

  /**
   * Toggle play/pause/stop
   */
  async toggle(options: MetronomeEngineOptions = {}): Promise<void> {
    if (this.intervalId) {
      this.pause();
    } else if (this.isPaused) {
      await this.resume();
    } else {
      await this.start(options);
    }
  }

  /**
   * Main scheduler function - checks if beats need to be played
   */
  private scheduler(): void {
    const state = useMetronomeStore.getState();
    const currentTime = Date.now() / 1000;
    
    // Schedule beats that fall within the look-ahead window
    while (this.nextBeatTime < currentTime + this.scheduleAheadTime) {
      this.scheduleBeat();
      this.advanceToNextBeat(state.bpm, state.timeSignature.numerator);
    }
  }

  /**
   * Schedule a single beat to be played
   */
  private scheduleBeat(): void {
    const state = useMetronomeStore.getState();
    const delay = Math.max(0, this.nextBeatTime - Date.now() / 1000) * 1000;

    // Get musical beat emphasis based on time signature
    const timeSignatureInfo = getTimeSignatureInfo(state.timeSignature);
    const beatNumber = (this.currentBeat % state.timeSignature.numerator) + 1;
    
    // Determine beat emphasis level
    const isStrongBeat = timeSignatureInfo.strongBeats.includes(beatNumber);
    const isMediumBeat = timeSignatureInfo.mediumBeats.includes(beatNumber);
    const isAccent = isStrongBeat || (isMediumBeat && beatNumber !== 1);
    
    // Play the beat after the calculated delay
    setTimeout(() => {
      this.playBeat(isAccent, isStrongBeat ? 'strong' : isMediumBeat ? 'medium' : 'weak');
    }, delay);
  }

  /**
   * Play a single beat
   */
  private async playBeat(isAccent: boolean, _emphasis: 'strong' | 'medium' | 'weak' = 'weak'): Promise<void> {
    const state = useMetronomeStore.getState();
    const settings = useAppSettingsStore.getState();

    // Play sound
    await audioEngine.playBeat(
      state.clickSound,
      isAccent ? 'high' : 'low',
      state.volume
    );

    // Update current beat in store
    const beatNumber = (this.currentBeat % state.timeSignature.numerator) + 1;
    useMetronomeStore.getState().setCurrentBeat(beatNumber);

    // Trigger beat callback
    this.options.onBeat?.(beatNumber, this.currentBar + 1);

    // Handle vibration if enabled
    if (settings.vibrateOnBeat && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(isAccent ? 50 : 30);
    }

    // Handle count-in
    if (this.isCountingIn) {
      this.countInBeatsRemaining--;
      if (this.countInBeatsRemaining <= 0) {
        this.isCountingIn = false;
        this.currentBeat = -1; // Will be incremented to 0 in next advance
        this.currentBar = 0;
      }
    }
  }

  /**
   * Calculate the time for the next beat
   */
  private advanceToNextBeat(bpm: number, beatsPerBar: number): void {
    const beatDuration = 60.0 / bpm;
    this.nextBeatTime += beatDuration;
    
    this.currentBeat++;
    
    // Check if we've completed a bar
    if (!this.isCountingIn && this.currentBeat >= beatsPerBar) {
      this.currentBeat = 0;
      this.currentBar++;
    }
  }

  /**
   * Update BPM while playing
   */
  async updateBpm(bpm: number): Promise<void> {
    const wasPlaying = this.intervalId !== null;
    
    if (wasPlaying) {
      this.stop();
      useMetronomeStore.getState().setBpm(bpm);
      await this.start(this.options);
    } else {
      useMetronomeStore.getState().setBpm(bpm);
    }
  }

  /**
   * Update volume while playing
   */
  async updateVolume(volume: number): Promise<void> {
    await audioEngine.setVolume(volume);
    useMetronomeStore.getState().setVolume(volume);
  }

  /**
   * Update time signature
   */
  async updateTimeSignature(numerator: number, denominator: number): Promise<void> {
    const wasPlaying = this.intervalId !== null;
    
    if (wasPlaying) {
      this.stop();
      useMetronomeStore.getState().setTimeSignature(numerator, denominator);
      await this.start(this.options);
    } else {
      useMetronomeStore.getState().setTimeSignature(numerator, denominator);
    }
  }

  /**
   * Check if the metronome is currently playing
   */
  isPlaying(): boolean {
    return this.intervalId !== null;
  }

  /**
   * Check if the metronome is paused
   */
  isPausedState(): boolean {
    return this.isPaused;
  }

  /**
   * Get current playback state
   */
  getPlaybackState(): {
    isPlaying: boolean;
    isPaused: boolean;
    currentBeat: number;
    currentBar: number;
    isCountingIn: boolean;
  } {
    return {
      isPlaying: this.intervalId !== null,
      isPaused: this.isPaused,
      currentBeat: this.currentBeat,
      currentBar: this.currentBar,
      isCountingIn: this.isCountingIn,
    };
  }

  /**
   * Clean up resources
   */
  async cleanup(): Promise<void> {
    this.stop();
    await audioEngine.cleanup();
  }
}

// Export singleton instance
export const metronomeEngine = new MetronomeEngine();