import { TimeSignature } from '../types';

export const DEFAULT_TIME_SIGNATURE: TimeSignature = {
  numerator: 4,
  denominator: 4,
};

export const COMMON_TIME_SIGNATURES: TimeSignature[] = [
  { numerator: 2, denominator: 4 },
  { numerator: 3, denominator: 4 },
  { numerator: 4, denominator: 4 },
  { numerator: 5, denominator: 4 },
  { numerator: 6, denominator: 8 },
  { numerator: 7, denominator: 8 },
  { numerator: 9, denominator: 8 },
  { numerator: 12, denominator: 8 },
];

export const formatTimeSignature = (timeSignature: TimeSignature): string => {
  return `${timeSignature.numerator}/${timeSignature.denominator}`;
};

export const parseTimeSignature = (str: string): TimeSignature | null => {
  const match = str.match(/^(\d+)\/(\d+)$/);
  if (!match) return null;
  
  const numerator = parseInt(match[1], 10);
  const denominator = parseInt(match[2], 10);
  
  if (numerator < 1 || numerator > 32 || denominator < 1 || denominator > 32) {
    return null;
  }
  
  return { numerator, denominator };
};

export const getStrongBeats = (timeSignature: TimeSignature): number[] => {
  const { numerator, denominator } = timeSignature;
  
  if (numerator === 4 && denominator === 4) {
    return [1, 3];
  } else if (numerator === 3 && denominator === 4) {
    return [1];
  } else if (numerator === 6 && denominator === 8) {
    return [1, 4];
  } else if (numerator === 12 && denominator === 8) {
    return [1, 4, 7, 10];
  }
  
  return [1];
};