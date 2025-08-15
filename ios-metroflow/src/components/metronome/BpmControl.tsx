import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Card, Slider } from '../ui';
import { MIN_BPM, MAX_BPM, formatBpm } from '../../utils/tempo';

interface BpmControlProps {
  bpm: number;
  onBpmChange: (bpm: number) => void;
  onSlidingComplete?: (bpm: number) => void;
  disabled?: boolean;
}

export const BpmControl: React.FC<BpmControlProps> = ({
  bpm,
  onBpmChange,
  onSlidingComplete,
  disabled = false,
}) => {
  return (
    <Card style={styles.container}>
      <Text style={styles.label}>BPM</Text>
      <Text style={styles.value}>{formatBpm(bpm)}</Text>
      
      <Slider
        value={bpm}
        minimumValue={MIN_BPM}
        maximumValue={MAX_BPM}
        onValueChange={onBpmChange}
        onSlidingComplete={onSlidingComplete}
        step={1}
        disabled={disabled}
        formatValue={formatBpm}
        showValue={false}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
  },
  value: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 20,
    fontVariant: ['tabular-nums'],
  },
});