import { useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { metronomeEngine } from '../services/audio';
import { useMetronome, useAppSettings } from '../stores';

export interface UseMetronomeEngineOptions {
  onBeat?: (beat: number, bar: number) => void;
  onStart?: () => void;
  onStop?: () => void;
}

/**
 * Custom hook that integrates the metronome engine with React components
 */
export const useMetronomeEngine = (options: UseMetronomeEngineOptions = {}) => {
  const metronome = useMetronome();
  const settings = useAppSettings();
  const appStateRef = useRef(AppState.currentState);
  const optionsRef = useRef(options);

  // Update options ref when they change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Initialize audio engine on mount
  useEffect(() => {
    metronomeEngine.initialize().catch(console.error);

    return () => {
      metronomeEngine.cleanup().catch(console.error);
    };
  }, []);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App has come to the foreground
        if (!settings.backgroundPlayback && metronome.isPlaying) {
          // Resume playback if it was playing before going to background
          metronomeEngine.start(optionsRef.current).catch(console.error);
        }
      } else if (
        appStateRef.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        // App is going to the background
        if (!settings.backgroundPlayback && metronome.isPlaying) {
          // Pause playback when going to background if background playback is disabled
          metronomeEngine.stop();
        }
      }

      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [settings.backgroundPlayback, metronome.isPlaying]);

  // Control functions
  const start = useCallback(async () => {
    try {
      await metronomeEngine.start({
        onBeat: optionsRef.current.onBeat,
        onStart: optionsRef.current.onStart,
        onStop: optionsRef.current.onStop,
      });
    } catch (error) {
      console.error('Failed to start metronome:', error);
    }
  }, []);

  const stop = useCallback(() => {
    metronomeEngine.stop();
  }, []);

  const toggle = useCallback(async () => {
    try {
      await metronomeEngine.toggle({
        onBeat: optionsRef.current.onBeat,
        onStart: optionsRef.current.onStart,
        onStop: optionsRef.current.onStop,
      });
    } catch (error) {
      console.error('Failed to toggle metronome:', error);
    }
  }, []);

  const updateBpm = useCallback(async (bpm: number) => {
    try {
      await metronomeEngine.updateBpm(bpm);
    } catch (error) {
      console.error('Failed to update BPM:', error);
    }
  }, []);

  const updateVolume = useCallback(async (volume: number) => {
    try {
      await metronomeEngine.updateVolume(volume);
    } catch (error) {
      console.error('Failed to update volume:', error);
    }
  }, []);

  const updateTimeSignature = useCallback(
    async (numerator: number, denominator: number) => {
      try {
        await metronomeEngine.updateTimeSignature(numerator, denominator);
      } catch (error) {
        console.error('Failed to update time signature:', error);
      }
    },
    []
  );

  return {
    // State from store
    isPlaying: metronome.isPlaying,
    bpm: metronome.bpm,
    timeSignature: metronome.timeSignature,
    volume: metronome.volume,
    currentBeat: metronome.currentBeat,
    currentBar: metronome.currentBar,
    
    // Control functions
    start,
    stop,
    toggle,
    updateBpm,
    updateVolume,
    updateTimeSignature,
    
    // Settings
    setBpm: metronome.setBpm,
    setVolume: metronome.setVolume,
    setTimeSignature: metronome.setTimeSignature,
    setClickSound: metronome.setClickSound,
    toggleCountIn: metronome.toggleCountIn,
  };
};