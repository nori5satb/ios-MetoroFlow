import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppSettingsState {
  // UI Settings
  theme: 'light' | 'dark' | 'auto';
  keepScreenOn: boolean;
  
  // Feedback Settings
  vibrateOnBeat: boolean;
  flashOnBeat: boolean;
  visualBeatIndicator: boolean;
  
  // Audio Settings
  audioLatencyCompensation: number; // in milliseconds
  backgroundPlayback: boolean;
  
  // Default Values
  defaultBpm: number;
  defaultTimeSignature: { numerator: number; denominator: number };
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setKeepScreenOn: (value: boolean) => void;
  setVibrateOnBeat: (value: boolean) => void;
  setFlashOnBeat: (value: boolean) => void;
  setVisualBeatIndicator: (value: boolean) => void;
  setAudioLatencyCompensation: (ms: number) => void;
  setBackgroundPlayback: (value: boolean) => void;
  setDefaultBpm: (bpm: number) => void;
  setDefaultTimeSignature: (numerator: number, denominator: number) => void;
  resetSettings: () => void;
}

const defaultSettings = {
  theme: 'auto' as const,
  keepScreenOn: true,
  vibrateOnBeat: false,
  flashOnBeat: false,
  visualBeatIndicator: true,
  audioLatencyCompensation: 0,
  backgroundPlayback: false,
  defaultBpm: 120,
  defaultTimeSignature: { numerator: 4, denominator: 4 },
};

export const useAppSettingsStore = create<AppSettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      
      setTheme: (theme) => set({ theme }),
      
      setKeepScreenOn: (value) => set({ keepScreenOn: value }),
      
      setVibrateOnBeat: (value) => set({ vibrateOnBeat: value }),
      
      setFlashOnBeat: (value) => set({ flashOnBeat: value }),
      
      setVisualBeatIndicator: (value) => set({ visualBeatIndicator: value }),
      
      setAudioLatencyCompensation: (ms) => {
        const validMs = Math.max(-100, Math.min(100, ms));
        set({ audioLatencyCompensation: validMs });
      },
      
      setBackgroundPlayback: (value) => set({ backgroundPlayback: value }),
      
      setDefaultBpm: (bpm) => {
        const validBpm = Math.max(40, Math.min(300, bpm));
        set({ defaultBpm: validBpm });
      },
      
      setDefaultTimeSignature: (numerator, denominator) => {
        set({ defaultTimeSignature: { numerator, denominator } });
      },
      
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'app-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);