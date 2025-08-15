import { useCallback } from 'react';
import { useMetronome } from '../stores';
import { useMetronomeEngine } from './useMetronomeEngine';
import { useDebouncedCallback } from './useDebounce';
import { validateBpm } from '../utils/tempo';

interface UseMetronomeBpmOptions {
  /**
   * Debounce delay in milliseconds for BPM updates
   * Helps prevent too many updates during rapid changes
   */
  debounceMs?: number;
  
  /**
   * Whether to update the metronome engine when BPM changes
   * Set to false if you want to handle engine updates manually
   */
  updateEngine?: boolean;
}

/**
 * Hook for managing BPM changes in the metronome
 * Handles validation, debouncing, and engine updates
 */
export const useMetronomeBpm = ({
  debounceMs = 100,
  updateEngine = true,
}: UseMetronomeBpmOptions = {}) => {
  const { bpm, setBpm } = useMetronome();
  const metronomeEngine = useMetronomeEngine();

  // Debounced BPM update for the engine
  const debouncedEngineUpdate = useDebouncedCallback(
    async (newBpm: number) => {
      if (updateEngine) {
        await metronomeEngine.updateBpm(newBpm);
      }
    },
    debounceMs
  );

  // Immediate BPM update for the store (for UI responsiveness)
  const handleBpmChange = useCallback(
    (newBpm: number) => {
      const validatedBpm = validateBpm(newBpm);
      
      // Update store immediately for UI responsiveness
      setBpm(validatedBpm);
      
      // Update engine with debouncing to avoid performance issues
      debouncedEngineUpdate(validatedBpm);
    },
    [setBpm, debouncedEngineUpdate]
  );

  // Handle final BPM changes (e.g., when slider is released)
  const handleBpmSlidingComplete = useCallback(
    async (finalBpm: number) => {
      const validatedBpm = validateBpm(finalBpm);
      
      // Ensure store is updated to final value
      setBpm(validatedBpm);
      
      // Update engine immediately for final value
      if (updateEngine) {
        await metronomeEngine.updateBpm(validatedBpm);
      }
    },
    [setBpm, metronomeEngine, updateEngine]
  );

  // Increment BPM by a specific amount
  const incrementBpm = useCallback(
    (increment: number) => {
      handleBpmChange(bpm + increment);
    },
    [bpm, handleBpmChange]
  );

  // Set BPM to a specific value (with validation)
  const setBpmValue = useCallback(
    (newBpm: number) => {
      handleBpmChange(newBpm);
    },
    [handleBpmChange]
  );

  return {
    bpm,
    setBpm: setBpmValue,
    incrementBpm,
    handleBpmChange,
    handleBpmSlidingComplete,
    isPlaying: metronomeEngine.isPlaying,
    // Expose metronome engine methods for advanced control
    metronome: metronomeEngine,
  };
};