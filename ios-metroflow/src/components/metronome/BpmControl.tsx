import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { MIN_BPM, MAX_BPM, formatBpm } from '../../utils/tempo';

interface BpmControlProps {
  bpm: number;
  onBpmChange: (bpm: number) => void;
  disabled?: boolean;
}

export const BpmControl: React.FC<BpmControlProps> = ({
  bpm,
  onBpmChange,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>BPM</Text>
      <Text style={styles.value}>{formatBpm(bpm)}</Text>
      <Slider
        style={styles.slider}
        minimumValue={MIN_BPM}
        maximumValue={MAX_BPM}
        value={bpm}
        onValueChange={onBpmChange}
        disabled={disabled}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor="#C7C7CC"
        thumbTintColor="#007AFF"
      />
      <View style={styles.limits}>
        <Text style={styles.limitText}>{MIN_BPM}</Text>
        <Text style={styles.limitText}>{MAX_BPM}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  value: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  limits: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  limitText: {
    fontSize: 12,
    color: '#999',
  },
});