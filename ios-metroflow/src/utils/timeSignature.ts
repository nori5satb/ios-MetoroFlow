import { TimeSignature } from '../types';

export const DEFAULT_TIME_SIGNATURE: TimeSignature = {
  numerator: 4,
  denominator: 4,
};

export interface TimeSignaturePreset {
  timeSignature: TimeSignature;
  name: string;
  description: string;
  category: 'simple' | 'compound' | 'complex';
}

export const TIME_SIGNATURE_PRESETS: TimeSignaturePreset[] = [
  {
    timeSignature: { numerator: 4, denominator: 4 },
    name: 'Common Time',
    description: 'Most common time signature',
    category: 'simple',
  },
  {
    timeSignature: { numerator: 3, denominator: 4 },
    name: 'Waltz Time',
    description: 'Traditional waltz rhythm',
    category: 'simple',
  },
  {
    timeSignature: { numerator: 2, denominator: 4 },
    name: 'March Time',
    description: 'Military march rhythm',
    category: 'simple',
  },
  {
    timeSignature: { numerator: 6, denominator: 8 },
    name: 'Compound Duple',
    description: 'Two groups of three',
    category: 'compound',
  },
  {
    timeSignature: { numerator: 9, denominator: 8 },
    name: 'Compound Triple',
    description: 'Three groups of three',
    category: 'compound',
  },
  {
    timeSignature: { numerator: 12, denominator: 8 },
    name: 'Compound Quadruple',
    description: 'Four groups of three',
    category: 'compound',
  },
  {
    timeSignature: { numerator: 5, denominator: 4 },
    name: 'Quintuple',
    description: 'Five beats per measure',
    category: 'complex',
  },
  {
    timeSignature: { numerator: 7, denominator: 8 },
    name: 'Septuple',
    description: 'Seven eighth notes',
    category: 'complex',
  },
];

export const VALID_DENOMINATORS = [2, 4, 8, 16];
export const MAX_NUMERATOR = 12;
export const MIN_NUMERATOR = 1;

export const formatTimeSignature = (timeSignature: TimeSignature): string => {
  return `${timeSignature.numerator}/${timeSignature.denominator}`;
};

export const parseTimeSignature = (str: string): TimeSignature | null => {
  const match = str.match(/^(\d+)\/(\d+)$/);
  if (!match) return null;
  
  const numerator = parseInt(match[1], 10);
  const denominator = parseInt(match[2], 10);
  
  if (numerator < MIN_NUMERATOR || numerator > MAX_NUMERATOR) {
    return null;
  }
  
  if (!VALID_DENOMINATORS.includes(denominator)) {
    return null;
  }
  
  return { numerator, denominator };
};

export const validateTimeSignature = (
  numerator: number,
  denominator: number
): boolean => {
  return (
    Number.isInteger(numerator) &&
    Number.isInteger(denominator) &&
    numerator >= MIN_NUMERATOR &&
    numerator <= MAX_NUMERATOR &&
    VALID_DENOMINATORS.includes(denominator)
  );
};

export const getStrongBeats = (timeSignature: TimeSignature): number[] => {
  const { numerator, denominator } = timeSignature;
  
  // Simple time signatures
  if (denominator === 4) {
    switch (numerator) {
      case 2:
        return [1]; // Strong on 1
      case 3:
        return [1]; // Strong on 1
      case 4:
        return [1, 3]; // Strong on 1, medium on 3
      case 5:
        return [1, 4]; // Strong on 1, medium on 4 (2+3 or 3+2)
      default:
        return [1]; // Default to downbeat only
    }
  }
  
  // Compound time signatures (eighth note based)
  if (denominator === 8) {
    switch (numerator) {
      case 6:
        return [1, 4]; // Two groups of 3: 1-2-3, 4-5-6
      case 9:
        return [1, 4, 7]; // Three groups of 3: 1-2-3, 4-5-6, 7-8-9
      case 12:
        return [1, 4, 7, 10]; // Four groups of 3
      case 7:
        return [1, 3, 6]; // 3+2+2 or 2+3+2 grouping
      default:
        return [1];
    }
  }
  
  // Cut time (2/2) and other denominators
  if (denominator === 2) {
    return [1, 2]; // Both beats are strong in cut time
  }
  
  if (denominator === 16) {
    return [1]; // Complex time, just emphasize downbeat
  }
  
  // Default: emphasize downbeat only
  return [1];
};

export const getMediumBeats = (timeSignature: TimeSignature): number[] => {
  const { numerator, denominator } = timeSignature;
  
  // Return beats that should have medium emphasis (not strong, not weak)
  if (numerator === 4 && denominator === 4) {
    return [3]; // Beat 3 is medium strong in 4/4
  }
  
  if (numerator === 6 && denominator === 8) {
    return [4]; // Second group in 6/8
  }
  
  if (numerator === 9 && denominator === 8) {
    return [4, 7]; // Second and third groups
  }
  
  if (numerator === 12 && denominator === 8) {
    return [4, 7, 10]; // Groups 2, 3, 4
  }
  
  return [];
};

export const getTimeSignatureInfo = (
  timeSignature: TimeSignature
): {
  preset: TimeSignaturePreset | null;
  strongBeats: number[];
  mediumBeats: number[];
  isCompound: boolean;
} => {
  const preset = TIME_SIGNATURE_PRESETS.find(p => 
    p.timeSignature.numerator === timeSignature.numerator &&
    p.timeSignature.denominator === timeSignature.denominator
  ) || null;
  
  const strongBeats = getStrongBeats(timeSignature);
  const mediumBeats = getMediumBeats(timeSignature);
  const isCompound = timeSignature.denominator === 8 && 
                     timeSignature.numerator % 3 === 0 &&
                     timeSignature.numerator >= 6;
  
  return {
    preset,
    strongBeats,
    mediumBeats,
    isCompound,
  };
};