import { metronomeEngine } from './MetronomeEngine';

export { audioEngine, type SoundType, type BeatType } from './AudioEngine';
export { metronomeEngine, type MetronomeEngineOptions } from './MetronomeEngine';

// Convenience functions for common operations
export const startMetronome = async () => {
  await metronomeEngine.start();
};

export const stopMetronome = () => {
  metronomeEngine.stop();
};

export const toggleMetronome = async () => {
  await metronomeEngine.toggle();
};

export const setMetronomeBpm = async (bpm: number) => {
  await metronomeEngine.updateBpm(bpm);
};

export const setMetronomeVolume = async (volume: number) => {
  await metronomeEngine.updateVolume(volume);
};

export const setMetronomeTimeSignature = async (numerator: number, denominator: number) => {
  await metronomeEngine.updateTimeSignature(numerator, denominator);
};