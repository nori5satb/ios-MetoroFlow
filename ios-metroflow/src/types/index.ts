export interface Project {
  id: string;
  name: string;
  description?: string;
  bpm: number;
  timeSignature: TimeSignature;
  sections: Section[];
  tracks: Track[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeSignature {
  numerator: number;
  denominator: number;
}

export interface Section {
  id: string;
  name: string;
  bars: number;
  bpm: number;
  timeSignature: TimeSignature;
  repeatCount: number;
}

export interface Track {
  id: string;
  name: string;
  instrument: Instrument;
  pattern: Pattern;
  volume: number;
  pan: number;
  muted: boolean;
  solo: boolean;
}

export interface Instrument {
  id: string;
  name: string;
  type: 'basic' | 'synthesizer' | 'sample';
  settings: Record<string, unknown>;
}

export interface Pattern {
  id: string;
  name: string;
  beats: Beat[];
  length: number;
}

export interface Beat {
  position: number;
  velocity: number;
  duration: number;
  pitch?: number;
}

export interface MetronomeState {
  isPlaying: boolean;
  currentBeat: number;
  currentBar: number;
  currentSection: number;
  bpm: number;
  timeSignature: TimeSignature;
  volume: number;
  countIn: boolean;
  countInBars: number;
  accentBeats: number[];
  clickSound: 'wood' | 'digital' | 'bell' | 'tick';
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  keepScreenOn: boolean;
  vibrateOnBeat: boolean;
  flashOnBeat: boolean;
  defaultBpm: number;
  defaultTimeSignature: TimeSignature;
  audioLatencyCompensation: number;
}