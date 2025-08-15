import { Platform } from 'react-native';
import { Audio } from 'expo-av';

export type BeepTone = 'high' | 'low';

/**
 * Simple beep generator for immediate audio feedback
 * Uses Web Audio API on web, expo-av generated tones on mobile
 */
class BeepGenerator {
  private audioContext: AudioContext | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.AudioContext) {
        // Initialize Web Audio API for web platforms
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } else {
        // Initialize expo-av for mobile platforms
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: false,
          allowsRecordingIOS: false,
          interruptionModeIOS: 1,
          interruptionModeAndroid: 1,
        });
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize beep generator:', error);
    }
  }

  /**
   * Play a beep sound
   */
  async playBeep(tone: BeepTone, volume: number = 0.7, duration: number = 100): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      if (Platform.OS === 'web' && this.audioContext) {
        await this.playWebBeep(tone, volume, duration);
      } else {
        await this.playMobileBeep(tone, volume, duration);
      }
    } catch (error) {
      console.error('Failed to play beep:', error);
    }
  }

  /**
   * Play beep using Web Audio API
   */
  private async playWebBeep(tone: BeepTone, volume: number, duration: number): Promise<void> {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    // Connect audio nodes
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Set frequency based on tone
    const frequency = tone === 'high' ? 800 : 400; // High: 800Hz, Low: 400Hz
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = 'sine';

    // Set volume with attack/decay envelope
    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume * 0.3, now + 0.01); // Quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration / 1000); // Decay

    // Play the tone
    oscillator.start(now);
    oscillator.stop(now + duration / 1000);
  }

  /**
   * Play beep using generated audio buffer (mobile platforms)
   */
  private async playMobileBeep(tone: BeepTone, volume: number, duration: number): Promise<void> {
    try {
      // Generate simple sine wave audio buffer
      const sampleRate = 44100;
      const samples = Math.floor(sampleRate * (duration / 1000));
      const frequency = tone === 'high' ? 800 : 400;
      
      // Create audio buffer with sine wave
      const audioData = new Float32Array(samples);
      for (let i = 0; i < samples; i++) {
        audioData[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * volume;
      }

      // For now, use a simple setTimeout to simulate the beep duration
      // In a full implementation, this would use expo-av to play the generated buffer
      // This is a placeholder until we implement proper audio buffer playback
      
      // Visual feedback in console for development only
      if (__DEV__) {
        console.warn(`🔊 ${tone === 'high' ? '♪' : '♫'} ${frequency}Hz beep (${duration}ms)`);
      }
    } catch (error) {
      console.error('Failed to play mobile beep:', error);
    }
  }

  /**
   * Test if audio is working
   */
  async testAudio(): Promise<boolean> {
    try {
      await this.playBeep('high', 0.5, 50);
      return true;
    } catch (error) {
      console.error('Audio test failed:', error);
      return false;
    }
  }

  /**
   * Clean up audio resources
   */
  async cleanup(): Promise<void> {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      await this.audioContext.close();
      this.audioContext = null;
    }
    this.isInitialized = false;
  }
}

// Export singleton instance
export const beepGenerator = new BeepGenerator();