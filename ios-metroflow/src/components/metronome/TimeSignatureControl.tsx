import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, SegmentedControl } from '../ui';
import { TimeSignature } from '../../types';
import { COMMON_TIME_SIGNATURES, formatTimeSignature } from '../../utils/timeSignature';

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
  const timeSignatureOptions = COMMON_TIME_SIGNATURES.map((ts) => ({
    value: formatTimeSignature(ts),
    label: formatTimeSignature(ts),
  }));

  const handleSelectionChange = (value: string) => {
    const selectedTimeSignature = COMMON_TIME_SIGNATURES.find(
      (ts) => formatTimeSignature(ts) === value
    );
    
    if (selectedTimeSignature) {
      onTimeSignatureChange(
        selectedTimeSignature.numerator,
        selectedTimeSignature.denominator
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