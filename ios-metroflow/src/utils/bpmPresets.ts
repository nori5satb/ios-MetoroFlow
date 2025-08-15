export interface BpmPreset {
  name: string;
  bpm: number;
  range: { min: number; max: number };
  description: string;
}

export const BPM_PRESETS: BpmPreset[] = [
  {
    name: 'Largo',
    bpm: 50,
    range: { min: 40, max: 60 },
    description: 'Very slow, broad',
  },
  {
    name: 'Adagio',
    bpm: 70,
    range: { min: 66, max: 76 },
    description: 'Slow and stately',
  },
  {
    name: 'Andante',
    bpm: 90,
    range: { min: 76, max: 108 },
    description: 'Walking pace',
  },
  {
    name: 'Moderato',
    bpm: 114,
    range: { min: 108, max: 120 },
    description: 'Moderate speed',
  },
  {
    name: 'Allegro',
    bpm: 144,
    range: { min: 120, max: 168 },
    description: 'Fast, lively',
  },
  {
    name: 'Presto',
    bpm: 184,
    range: { min: 168, max: 200 },
    description: 'Very fast',
  },
];

export const findPresetForBpm = (bpm: number): BpmPreset | null => {
  return BPM_PRESETS.find(preset => 
    bpm >= preset.range.min && bpm <= preset.range.max
  ) || null;
};

export const getPresetNames = (): string[] => {
  return BPM_PRESETS.map(preset => preset.name);
};

export const getPresetByName = (name: string): BpmPreset | null => {
  return BPM_PRESETS.find(preset => preset.name === name) || null;
};