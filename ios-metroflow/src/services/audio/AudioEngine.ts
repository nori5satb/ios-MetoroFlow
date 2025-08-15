import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';

export type SoundType = 'wood' | 'digital' | 'bell' | 'tick';
export type BeatType = 'high' | 'low';

interface LoadedSound {
  high: Sound | null;
  low: Sound | null;
}

class AudioEngine {
  private sounds: Map<SoundType, LoadedSound> = new Map();
  private isInitialized = false;
  private currentVolume = 0.7;
  private audioMode = {
    playsInSilentModeIOS: true,
    staysActiveInBackground: true,
    shouldDuckAndroid: false,
  };

  /**
   * Initialize the audio engine and configure audio session
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Configure audio mode for iOS
      await Audio.setAudioModeAsync({
        ...this.audioMode,
        allowsRecordingIOS: false,
        interruptionModeIOS: 1, // InterruptionModeIOS.DoNotMix
        interruptionModeAndroid: 1, // InterruptionModeAndroid.DoNotMix
      });

      // Preload default sounds
      await this.loadSoundSet('wood');
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio engine:', error);
      throw error;
    }
  }

  /**
   * Load a set of sounds for a specific sound type
   */
  async loadSoundSet(soundType: SoundType): Promise<void> {
    try {
      const soundSet: LoadedSound = { high: null, low: null };

      // For now, using placeholder paths - will be replaced with actual sound files
      // In production, these would load actual audio files
      // const soundPaths = this.getSoundPaths(soundType);

      // Load high sound (placeholder for now)
      // In production, this would load actual sound files
      // if (soundPaths.high) {
      //   const { sound: highSound } = await Audio.Sound.createAsync(
      //     soundPaths.high,
      //     { shouldPlay: false, volume: this.currentVolume }
      //   );
      //   soundSet.high = highSound;
      // }

      // Load low sound (placeholder for now)
      // In production, this would load actual sound files
      // if (soundPaths.low) {
      //   const { sound: lowSound } = await Audio.Sound.createAsync(
      //     soundPaths.low,
      //     { shouldPlay: false, volume: this.currentVolume }
      //   );
      //   soundSet.low = lowSound;
      // }

      // Unload previous sounds if they exist
      const existingSounds = this.sounds.get(soundType);
      if (existingSounds) {
        await this.unloadSoundSet(existingSounds);
      }

      this.sounds.set(soundType, soundSet);
    } catch (error) {
      console.error(`Failed to load sound set ${soundType}:`, error);
      // Continue without throwing - app should work even without sounds
    }
  }

  /**
   * Get sound file paths for a sound type
   * In production, these would return actual require() statements for sound files
   */
  private getSoundPaths(_soundType: SoundType): { high: unknown; low: unknown } {
    // Placeholder - will be replaced with actual sound file imports
    // Example: require('../../../assets/sounds/wood_high.wav')
    return {
      high: null, // Will be replaced with actual sound file
      low: null,  // Will be replaced with actual sound file
    };
  }

  /**
   * Unload a sound set to free memory
   */
  private async unloadSoundSet(soundSet: LoadedSound): Promise<void> {
    try {
      if (soundSet.high) {
        await soundSet.high.unloadAsync();
      }
      if (soundSet.low) {
        await soundSet.low.unloadAsync();
      }
    } catch (error) {
      console.error('Failed to unload sounds:', error);
    }
  }

  /**
   * Play a beat sound
   */
  async playBeat(
    soundType: SoundType,
    beatType: BeatType,
    volume?: number
  ): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const soundSet = this.sounds.get(soundType);
    if (!soundSet) {
      await this.loadSoundSet(soundType);
      return this.playBeat(soundType, beatType, volume);
    }

    const sound = beatType === 'high' ? soundSet.high : soundSet.low;
    if (!sound) {
      // No sound loaded - fail silently
      return;
    }

    try {
      // Set volume if specified
      if (volume !== undefined) {
        await sound.setVolumeAsync(volume);
      }

      // Replay from start
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch (error) {
      console.error('Failed to play beat:', error);
    }
  }

  /**
   * Set the global volume for all sounds
   */
  async setVolume(volume: number): Promise<void> {
    this.currentVolume = Math.max(0, Math.min(1, volume));

    // Update volume for all loaded sounds
    for (const soundSet of this.sounds.values()) {
      if (soundSet.high) {
        await soundSet.high.setVolumeAsync(this.currentVolume);
      }
      if (soundSet.low) {
        await soundSet.low.setVolumeAsync(this.currentVolume);
      }
    }
  }

  /**
   * Preload all sound types
   */
  async preloadAllSounds(): Promise<void> {
    const soundTypes: SoundType[] = ['wood', 'digital', 'bell', 'tick'];
    
    for (const soundType of soundTypes) {
      await this.loadSoundSet(soundType);
    }
  }

  /**
   * Clean up and release all audio resources
   */
  async cleanup(): Promise<void> {
    for (const soundSet of this.sounds.values()) {
      await this.unloadSoundSet(soundSet);
    }
    this.sounds.clear();
    this.isInitialized = false;
  }

  /**
   * Handle audio interruptions (e.g., phone calls)
   */
  async handleAudioInterruption(interrupted: boolean): Promise<void> {
    if (!interrupted) {
      // Resume audio session after interruption
      await Audio.setAudioModeAsync(this.audioMode);
    }
  }
}

// Export singleton instance
export const audioEngine = new AudioEngine();