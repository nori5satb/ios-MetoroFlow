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
          interruptionModeIOS: 1, // InterruptionModeIOS.DoNotMix
          interruptionModeAndroid: 1, // InterruptionModeAndroid.DoNotMix
        });

        // Request audio permissions for iOS
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Audio permissions not granted, some features may not work');
        }
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
   * Play beep using expo-av generated tone (mobile platforms)
   */
  private async playMobileBeep(tone: BeepTone, volume: number, duration: number): Promise<void> {
    try {
      const frequency = tone === 'high' ? 800 : 400;
      
      if (__DEV__) {
        console.warn(`🎵 Generating ${tone} beep: ${frequency}Hz, ${duration}ms, vol:${volume}`);
      }
      
      // Generate sine wave data URI for expo-av
      const beepUri = this.generateBeepDataUri(frequency, duration, volume);
      
      if (__DEV__) {
        console.warn(`🎵 Generated beep URI: ${beepUri.substring(0, 50)}...`);
      }
      
      // Create and play sound using expo-av
      const { sound } = await Audio.Sound.createAsync(
        { uri: beepUri },
        { 
          shouldPlay: true, 
          volume: volume,
          isLooping: false 
        }
      );

      if (__DEV__) {
        console.warn('🎵 Sound created and playing...');
      }

      // Clean up after playing
      setTimeout(async () => {
        try {
          await sound.unloadAsync();
        } catch (cleanupError) {
          console.error('Failed to cleanup beep sound:', cleanupError);
        }
      }, duration + 100);

    } catch (error) {
      console.error('Failed to play mobile beep:', error);
      
      // Fallback: Visual feedback in console for development
      if (__DEV__) {
        const frequency = tone === 'high' ? 800 : 400;
        console.warn(`🔊 ${tone === 'high' ? '♪' : '♫'} ${frequency}Hz beep (${duration}ms) - Audio failed`);
      }
    }
  }

  /**
   * Generate a data URI with sine wave audio for mobile playback
   */
  private generateBeepDataUri(frequency: number, duration: number, volume: number): string {
    const sampleRate = 22050; // Lower sample rate for smaller file size
    const samples = Math.floor(sampleRate * (duration / 1000));
    
    // Generate 16-bit PCM sine wave
    const audioData = new Int16Array(samples);
    const amplitude = Math.floor(32767 * volume);
    
    for (let i = 0; i < samples; i++) {
      const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate);
      // Apply envelope to avoid clicks
      const envelope = this.getEnvelope(i, samples);
      audioData[i] = Math.floor(sample * amplitude * envelope);
    }

    // Convert to WAV format
    const wavBuffer = this.createWavBuffer(audioData, sampleRate);
    
    // Convert to base64 data URI
    const base64 = this.arrayBufferToBase64(wavBuffer);
    return `data:audio/wav;base64,${base64}`;
  }

  /**
   * Create envelope to prevent audio clicks
   */
  private getEnvelope(sample: number, totalSamples: number): number {
    const fadeLength = Math.min(441, totalSamples / 10); // 10ms fade or 10% of duration
    
    if (sample < fadeLength) {
      // Fade in
      return sample / fadeLength;
    } else if (sample > totalSamples - fadeLength) {
      // Fade out
      return (totalSamples - sample) / fadeLength;
    }
    return 1; // Full volume
  }

  /**
   * Create WAV file buffer from PCM data
   */
  private createWavBuffer(audioData: Int16Array, sampleRate: number): ArrayBuffer {
    const length = audioData.length;
    const buffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(buffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);

    // PCM data
    for (let i = 0; i < length; i++) {
      view.setInt16(44 + i * 2, audioData[i], true);
    }

    return buffer;
  }

  /**
   * Convert ArrayBuffer to base64 string
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    
    // Use btoa if available (web), otherwise manual base64 encoding
    if (typeof btoa !== 'undefined') {
      return btoa(binary);
    } else {
      return this.manualBase64Encode(binary);
    }
  }

  /**
   * Manual base64 encoding for environments without btoa
   */
  private manualBase64Encode(str: string): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    let i = 0;

    while (i < str.length) {
      const a = str.charCodeAt(i++);
      const b = i < str.length ? str.charCodeAt(i++) : 0;
      const c = i < str.length ? str.charCodeAt(i++) : 0;

      const bitmap = (a << 16) | (b << 8) | c;

      result += chars.charAt((bitmap >> 18) & 63);
      result += chars.charAt((bitmap >> 12) & 63);
      result += chars.charAt((bitmap >> 6) & 63);
      result += chars.charAt(bitmap & 63);
    }

    const paddingLength = (3 - ((str.length % 3) || 3)) % 3;
    return result.slice(0, result.length - paddingLength) + '='.repeat(paddingLength);
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