import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Slider } from '../ui';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  onSlidingComplete?: (volume: number) => void;
  disabled?: boolean;
  muted?: boolean;
  onMuteToggle?: () => void;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  onVolumeChange,
  onSlidingComplete,
  disabled = false,
  muted = false,
  onMuteToggle,
}) => {
  const getVolumeIcon = () => {
    if (muted || volume === 0) return 'volume-mute';
    if (volume < 0.3) return 'volume-low';
    if (volume < 0.7) return 'volume-medium';
    return 'volume-high';
  };

  const formatPercentage = (value: number) => `${Math.round(value * 100)}%`;

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        {onMuteToggle && (
          <Ionicons
            name={getVolumeIcon()}
            size={24}
            color={muted ? '#FF3B30' : '#007AFF'}
            onPress={onMuteToggle}
            style={styles.muteButton}
          />
        )}
      </View>
      
      <Slider
        label="Volume"
        value={muted ? 0 : volume}
        minimumValue={0}
        maximumValue={1}
        onValueChange={onVolumeChange}
        onSlidingComplete={onSlidingComplete}
        step={0.01}
        disabled={disabled}
        formatValue={formatPercentage}
        showValue={true}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  muteButton: {
    padding: 8,
  },
});