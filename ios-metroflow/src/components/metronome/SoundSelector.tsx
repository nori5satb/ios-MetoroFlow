import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Card, SegmentedControl } from '../ui';
import { SoundType } from '../../services/audio';

interface SoundSelectorProps {
  selectedSound: SoundType;
  onSoundChange: (sound: SoundType) => void;
  disabled?: boolean;
}

const SOUND_OPTIONS: { value: SoundType; label: string }[] = [
  { value: 'wood', label: 'Wood' },
  { value: 'digital', label: 'Digital' },
  { value: 'bell', label: 'Bell' },
  { value: 'tick', label: 'Tick' },
];

export const SoundSelector: React.FC<SoundSelectorProps> = ({
  selectedSound,
  onSoundChange,
  disabled = false,
}) => {
  return (
    <Card style={styles.container}>
      <Text style={styles.label}>Click Sound</Text>
      
      <SegmentedControl
        options={SOUND_OPTIONS}
        selectedValue={selectedSound}
        onSelectionChange={onSoundChange}
        disabled={disabled}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 16,
    textAlign: 'center',
  },
});