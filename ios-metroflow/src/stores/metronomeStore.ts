import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimeSignature } from '../types';

interface MetronomeState {
  // Playback state
  isPlaying: boolean;
  currentBeat: number;
  currentBar: number;
  
  // Settings
  bpm: number;
  timeSignature: TimeSignature;
  volume: number;
  
  // Visual/Audio settings
  clickSound: 'wood' | 'digital' | 'bell' | 'tick';
  accentBeats: number[];
  countIn: boolean;
  countInBars: number;
  
  // Actions
  setBpm: (bpm: number) => void;
  setTimeSignature: (numerator: number, denominator: number) => void;
  setVolume: (volume: number) => void;
  togglePlayback: () => void;
  startPlayback: () => void;
  stopPlayback: () => void;
  setCurrentBeat: (beat: number) => void;
  incrementBeat: () => void;
  setClickSound: (sound: 'wood' | 'digital' | 'bell' | 'tick') => void;
  setAccentBeats: (beats: number[]) => void;
  toggleCountIn: () => void;
  setCountInBars: (bars: number) => void;
  reset: () => void;
}

const defaultState = {
  isPlaying: false,
  currentBeat: 0,
  currentBar: 0,
  bpm: 120,
  timeSignature: { numerator: 4, denominator: 4 },
  volume: 0.7,
  clickSound: 'wood' as const,
  accentBeats: [1],
  countIn: false,
  countInBars: 1,
};

export const useMetronomeStore = create<MetronomeState>()(
  persist(
    (set, get) => ({
      ...defaultState,
      
      setBpm: (bpm) => {
        const validBpm = Math.max(40, Math.min(300, bpm));
        set({ bpm: validBpm });
      },
      
      setTimeSignature: (numerator, denominator) => {
        set({ 
          timeSignature: { numerator, denominator },
          currentBeat: 0,
          currentBar: 0,
          accentBeats: [1], // Reset accent beats when time signature changes
        });
      },
      
      setVolume: (volume) => {
        const validVolume = Math.max(0, Math.min(1, volume));
        set({ volume: validVolume });
      },
      
      togglePlayback: () => {
        const { isPlaying } = get();
        if (isPlaying) {
          set({ isPlaying: false, currentBeat: 0, currentBar: 0 });
        } else {
          set({ isPlaying: true });
        }
      },
      
      startPlayback: () => {
        set({ isPlaying: true });
      },
      
      stopPlayback: () => {
        set({ isPlaying: false, currentBeat: 0, currentBar: 0 });
      },
      
      setCurrentBeat: (beat) => {
        set({ currentBeat: beat });
      },
      
      incrementBeat: () => {
        const { currentBeat, timeSignature, currentBar } = get();
        const nextBeat = currentBeat + 1;
        
        if (nextBeat > timeSignature.numerator) {
          set({ currentBeat: 1, currentBar: currentBar + 1 });
        } else {
          set({ currentBeat: nextBeat });
        }
      },
      
      setClickSound: (sound) => {
        set({ clickSound: sound });
      },
      
      setAccentBeats: (beats) => {
        set({ accentBeats: beats });
      },
      
      toggleCountIn: () => {
        set((state) => ({ countIn: !state.countIn }));
      },
      
      setCountInBars: (bars) => {
        const validBars = Math.max(1, Math.min(4, bars));
        set({ countInBars: validBars });
      },
      
      reset: () => {
        set(defaultState);
      },
    }),
    {
      name: 'metronome-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist user settings, not playback state
        bpm: state.bpm,
        timeSignature: state.timeSignature,
        volume: state.volume,
        clickSound: state.clickSound,
        accentBeats: state.accentBeats,
        countIn: state.countIn,
        countInBars: state.countInBars,
      }),
    }
  )
);