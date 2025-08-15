import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PlayButtonProps {
  isPlaying: boolean;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const PlayButton: React.FC<PlayButtonProps> = ({
  isPlaying,
  onPress,
  loading = false,
  disabled = false,
  size = 'large',
}) => {
  const buttonSize = size === 'small' ? 60 : size === 'medium' ? 80 : 120;
  const iconSize = size === 'small' ? 24 : size === 'medium' ? 32 : 48;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
        },
        isPlaying ? styles.stopButton : styles.playButton,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="large" />
      ) : (
        <Ionicons
          name={isPlaying ? 'stop' : 'play'}
          size={iconSize}
          color="#FFFFFF"
          style={!isPlaying && styles.playIcon}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  playButton: {
    backgroundColor: '#34C759',
  },
  stopButton: {
    backgroundColor: '#FF3B30',
  },
  disabled: {
    opacity: 0.5,
  },
  playIcon: {
    marginLeft: 4, // Slight offset to center the play icon visually
  },
});