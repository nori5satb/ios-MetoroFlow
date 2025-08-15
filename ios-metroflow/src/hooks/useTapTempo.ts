import { useState, useRef, useCallback } from 'react';

interface UseTapTempoOptions {
  minTaps?: number;
  maxTaps?: number;
  timeoutMs?: number;
  onBpmChange?: (bpm: number) => void;
}

export const useTapTempo = ({
  minTaps = 2,
  maxTaps = 8,
  timeoutMs = 3000,
  onBpmChange,
}: UseTapTempoOptions = {}) => {
  const [tapCount, setTapCount] = useState(0);
  const [currentBpm, setCurrentBpm] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  
  const tapTimestamps = useRef<number[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    tapTimestamps.current = [];
    setTapCount(0);
    setCurrentBpm(null);
    setIsActive(false);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const calculateBpm = useCallback((timestamps: number[]): number => {
    if (timestamps.length < minTaps) return 0;

    // Calculate intervals between taps
    const intervals: number[] = [];
    for (let i = 1; i < timestamps.length; i++) {
      intervals.push(timestamps[i] - timestamps[i - 1]);
    }

    // Use weighted average - give more weight to recent intervals
    let weightedSum = 0;
    let totalWeight = 0;
    
    intervals.forEach((interval, index) => {
      const weight = index + 1; // Later intervals get more weight
      weightedSum += interval * weight;
      totalWeight += weight;
    });

    const averageInterval = weightedSum / totalWeight;
    
    // Convert milliseconds to BPM (60000ms = 1 minute)
    const bpm = Math.round(60000 / averageInterval);
    
    // Clamp to valid BPM range
    return Math.max(40, Math.min(300, bpm));
  }, [minTaps]);

  const tap = useCallback(() => {
    const now = Date.now();
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Add current timestamp
    tapTimestamps.current = [...tapTimestamps.current, now].slice(-maxTaps);
    const newTapCount = tapTimestamps.current.length;
    
    setTapCount(newTapCount);
    setIsActive(true);
    
    // Calculate BPM if we have enough taps
    if (newTapCount >= minTaps) {
      const bpm = calculateBpm(tapTimestamps.current);
      setCurrentBpm(bpm);
      onBpmChange?.(bpm);
    }
    
    // Set timeout to reset if no more taps
    timeoutRef.current = setTimeout(reset, timeoutMs);
  }, [calculateBpm, maxTaps, minTaps, onBpmChange, reset, timeoutMs]);

  return {
    tap,
    reset,
    tapCount,
    currentBpm,
    isActive,
    canCalculate: tapCount >= minTaps,
  };
};