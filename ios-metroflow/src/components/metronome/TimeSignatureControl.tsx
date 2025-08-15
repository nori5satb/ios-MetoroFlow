import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, SegmentedControl } from '../ui';
import { TimeSignature } from '../../types';
import { TIME_SIGNATURE_PRESETS, formatTimeSignature } from '../../utils/timeSignature';

interface TimeSignatureControlProps {
  timeSignature: TimeSignature;
  onTimeSignatureChange: (numerator: number, denominator: number) => void;
  disabled?: boolean;
}

export const TimeSignatureControl: React.FC<TimeSignatureControlProps> = ({
  timeSignature,
  onTimeSignatureChange,
  disabled = false,
}) => {
  const timeSignatureOptions = TIME_SIGNATURE_PRESETS.map((preset) => ({
    value: formatTimeSignature(preset.timeSignature),
    label: formatTimeSignature(preset.timeSignature),
  }));

  const handleSelectionChange = (value: string) => {
    const selectedPreset = TIME_SIGNATURE_PRESETS.find(
      (preset) => formatTimeSignature(preset.timeSignature) === value
    );
    
    if (selectedPreset) {
      onTimeSignatureChange(
        selectedPreset.timeSignature.numerator,
        selectedPreset.timeSignature.denominator
      );
    }
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.label}>Time Signature</Text>
      
      <View style={styles.currentValue}>
        <Text style={styles.value}>{formatTimeSignature(timeSignature)}</Text>
      </View>
      
      <SegmentedControl
        options={timeSignatureOptions}
        selectedValue={formatTimeSignature(timeSignature)}
        onSelectionChange={handleSelectionChange}
        disabled={disabled}
        style={styles.segmentedControl}
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
    marginBottom: 12,
  },
  currentValue: {
    marginBottom: 20,
  },
  value: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1C1C1E',
    fontVariant: ['tabular-nums'],
  },
  segmentedControl: {
    width: '100%',
  },
});