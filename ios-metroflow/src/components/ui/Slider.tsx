import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SliderComponent from '@react-native-community/slider';

interface SliderProps {
  label?: string;
  value: number;
  minimumValue: number;
  maximumValue: number;
  onValueChange: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
  step?: number;
  disabled?: boolean;
  formatValue?: (value: number) => string;
  showValue?: boolean;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  minimumValue,
  maximumValue,
  onValueChange,
  onSlidingComplete,
  step = 1,
  disabled = false,
  formatValue = (val) => val.toString(),
  showValue = true,
  minimumTrackTintColor = '#007AFF',
  maximumTrackTintColor = '#C7C7CC',
  thumbTintColor = '#007AFF',
}) => {
  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.header}>
          <Text style={styles.label}>{label}</Text>
          {showValue && (
            <Text style={styles.value}>{formatValue(value)}</Text>
          )}
        </View>
      )}
      
      <SliderComponent
        style={styles.slider}
        value={value}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        onValueChange={onValueChange}
        onSlidingComplete={onSlidingComplete}
        step={step}
        disabled={disabled}
        minimumTrackTintColor={minimumTrackTintColor}
        maximumTrackTintColor={maximumTrackTintColor}
        thumbTintColor={thumbTintColor}
      />
      
      <View style={styles.limits}>
        <Text style={styles.limitText}>{formatValue(minimumValue)}</Text>
        <Text style={styles.limitText}>{formatValue(maximumValue)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  limits: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  limitText: {
    fontSize: 12,
    color: '#8E8E93',
  },
});