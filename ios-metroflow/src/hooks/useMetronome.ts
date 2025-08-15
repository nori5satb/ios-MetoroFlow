import { useState, useCallback, useRef, useEffect } from 'react';
import { MetronomeState, TimeSignature } from '../types';
import { DEFAULT_BPM } from '../utils/tempo';
import { DEFAULT_TIME_SIGNATURE } from '../utils/timeSignature';

const initialState: MetronomeState = {
  isPlaying: false,
  currentBeat: 0,
  currentBar: 0,
  currentSection: 0,
  bpm: DEFAULT_BPM,
  timeSignature: DEFAULT_TIME_SIGNATURE,
  volume: 0.8,
  countIn: false,
  countInBars: 1,
  accentBeats: [1],
  clickSound: 'wood',
};

export const useMetronome = () => {
  const [state, setState] = useState<MetronomeState>(initialState);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: true }));
  }, []);

  const stop = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isPlaying: false,
      currentBeat: 0,
      currentBar: 0,
    }));
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const setBpm = useCallback((bpm: number) => {
    setState((prev) => ({ ...prev, bpm }));
  }, []);

  const setTimeSignature = useCallback((timeSignature: TimeSignature) => {
    setState((prev) => ({ ...prev, timeSignature }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    setState((prev) => ({ ...prev, volume }));
  }, []);

  const toggleCountIn = useCallback(() => {
    setState((prev) => ({ ...prev, countIn: !prev.countIn }));
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    state,
    start,
    stop,
    setBpm,
    setTimeSignature,
    setVolume,
    toggleCountIn,
  };
};