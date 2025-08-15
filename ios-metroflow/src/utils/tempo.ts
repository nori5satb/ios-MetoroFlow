export const MIN_BPM = 40;
export const MAX_BPM = 300;
export const DEFAULT_BPM = 120;

export const bpmToInterval = (bpm: number): number => {
  return 60000 / bpm;
};

export const intervalToBpm = (interval: number): number => {
  return 60000 / interval;
};

export const validateBpm = (bpm: number): number => {
  return Math.max(MIN_BPM, Math.min(MAX_BPM, bpm));
};

export const calculateBarDuration = (
  bpm: number,
  timeSignatureNumerator: number
): number => {
  const beatDuration = bpmToInterval(bpm);
  return beatDuration * timeSignatureNumerator;
};

export const formatBpm = (bpm: number): string => {
  return Math.round(bpm).toString();
};