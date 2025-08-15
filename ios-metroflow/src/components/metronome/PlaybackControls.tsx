import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Switch } from '../ui';
import { PlayButton } from './PlayButton';
import { useMetronome } from '../../stores';
import { metronomeEngine } from '../../services/audio/MetronomeEngine';

interface PlaybackControlsProps {
  onPlaybackStateChange?: (isPlaying: boolean) => void;
  disabled?: boolean;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  onPlaybackStateChange,
  disabled = false,
}) => {
  const {
    isPlaying,
    currentBeat,
    currentBar,
    bpm,
    timeSignature,
    countIn,
    countInBars,
    toggleCountIn,
    setCountInBars,
    reset,
  } = useMetronome();

  const [isLoading, setIsLoading] = useState(false);
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdownBeats, setCountdownBeats] = useState(0);


  const performCountdown = useCallback(async (): Promise<void> => {
    return new Promise((resolve) => {
      let remaining = countInBars * timeSignature.numerator;
      setCountdownBeats(remaining);
      
      const beatInterval = (60 / bpm) * 1000; // Convert to milliseconds
      
      const countdownTimer = setInterval(() => {
        remaining--;
        setCountdownBeats(remaining);
        
        if (remaining <= 0) {
          clearInterval(countdownTimer);
          resolve();
        }
      }, beatInterval);
    });
  }, [countInBars, timeSignature, bpm]);

  const handlePlayToggle = useCallback(async () => {
    if (disabled) return;

    setIsLoading(true);
    
    try {
      if (isPlaying) {
        // Stop playback
        metronomeEngine.stop();
        onPlaybackStateChange?.(false);
      } else {
        // Start playback with optional count-in
        if (countIn) {
          setCountdownActive(true);
          setCountdownBeats(countInBars * timeSignature.numerator);
          
          // Visual countdown
          await performCountdown();
        }
        
        await metronomeEngine.start({
          onBeat: (_beat, _bar) => {
            // Real-time beat updates will be handled by the engine
          },
          onStart: () => {
            setCountdownActive(false);
            onPlaybackStateChange?.(true);
          },
          onStop: () => {
            setCountdownActive(false);
            onPlaybackStateChange?.(false);
          },
        });
      }
    } catch (error) {
      Alert.alert(
        'Playback Error',
        'Failed to start metronome. Please check your audio settings.',
        [{ text: 'OK' }]
      );
      console.error('Playback error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isPlaying, countIn, countInBars, timeSignature, disabled, onPlaybackStateChange, performCountdown]);

  // Handle keyboard shortcuts (Web only)
  useEffect(() => {
    // Only add listener on web platforms
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.addEventListener) {
      const handleKeyPress = (event: KeyboardEvent) => {
        if (event.code === 'Space') {
          event.preventDefault();
          handlePlayToggle();
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [handlePlayToggle]);

  const handleReset = useCallback(() => {
    if (isPlaying) {
      metronomeEngine.stop();
    }
    reset();
    onPlaybackStateChange?.(false);
  }, [isPlaying, reset, onPlaybackStateChange]);

  const handleCountInBarsChange = useCallback((increment: number) => {
    const newBars = Math.max(1, Math.min(4, countInBars + increment));
    setCountInBars(newBars);
  }, [countInBars, setCountInBars]);

  const getPlaybackStatusText = () => {
    if (countdownActive) {
      return `Count-in: ${countdownBeats}`;
    }
    if (isPlaying) {
      return `Bar ${currentBar + 1}, Beat ${currentBeat}`;
    }
    return 'Ready to play';
  };

  const getPlaybackStatusColor = () => {
    if (countdownActive) return '#FF9500';
    if (isPlaying) return '#34C759';
    return '#8E8E93';
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Playback Controls</Text>
      
      {/* Status Display */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusIndicator, { backgroundColor: getPlaybackStatusColor() }]} />
        <Text style={[styles.statusText, { color: getPlaybackStatusColor() }]}>
          {getPlaybackStatusText()}
        </Text>
      </View>

      {/* Main Controls */}
      <View style={styles.mainControls}>
        <TouchableOpacity
          style={[styles.controlButton, disabled && styles.controlButtonDisabled]}
          onPress={handleReset}
          disabled={disabled}
        >
          <Ionicons name="refresh" size={24} color={disabled ? '#C7C7CC' : '#007AFF'} />
          <Text style={[styles.controlButtonText, disabled && styles.controlButtonTextDisabled]}>
            Reset
          </Text>
        </TouchableOpacity>

        <PlayButton
          isPlaying={isPlaying || countdownActive}
          onPress={handlePlayToggle}
          loading={isLoading}
          disabled={disabled}
          size="large"
        />

        <TouchableOpacity
          style={[styles.controlButton, disabled && styles.controlButtonDisabled]}
          onPress={() => handlePlayToggle()}
          disabled={disabled}
        >
          <Ionicons 
            name={isPlaying ? "pause" : "play-skip-forward"} 
            size={24} 
            color={disabled ? '#C7C7CC' : '#007AFF'} 
          />
          <Text style={[styles.controlButtonText, disabled && styles.controlButtonTextDisabled]}>
            {isPlaying ? 'Pause' : 'Start'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Count-in Settings */}
      <View style={styles.countInSection}>
        <View style={styles.countInHeader}>
          <Text style={styles.sectionTitle}>Count-in</Text>
          <Switch
            value={countIn}
            onValueChange={toggleCountIn}
            disabled={disabled || isPlaying}
          />
        </View>
        
        {countIn && (
          <View style={styles.countInControls}>
            <Text style={styles.countInLabel}>Count-in bars:</Text>
            <View style={styles.countInAdjuster}>
              <TouchableOpacity
                style={[styles.adjusterButton, countInBars <= 1 && styles.adjusterButtonDisabled]}
                onPress={() => handleCountInBarsChange(-1)}
                disabled={countInBars <= 1 || disabled || isPlaying}
              >
                <Ionicons name="remove" size={20} color="#007AFF" />
              </TouchableOpacity>
              
              <Text style={styles.countInValue}>{countInBars}</Text>
              
              <TouchableOpacity
                style={[styles.adjusterButton, countInBars >= 4 && styles.adjusterButtonDisabled]}
                onPress={() => handleCountInBarsChange(1)}
                disabled={countInBars >= 4 || disabled || isPlaying}
              >
                <Ionicons name="add" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Keyboard Shortcut Hint (Web only) */}
      {Platform.OS === 'web' && (
        <View style={styles.shortcutHint}>
          <Ionicons name="keypad" size={16} color="#8E8E93" />
          <Text style={styles.shortcutText}>Press Space to play/stop</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  controlButton: {
    alignItems: 'center',
    gap: 4,
    padding: 8,
    minWidth: 60,
  },
  controlButtonDisabled: {
    opacity: 0.5,
  },
  controlButtonText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  controlButtonTextDisabled: {
    color: '#C7C7CC',
  },
  countInSection: {
    width: '100%',
    gap: 12,
  },
  countInHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  countInControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countInLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  countInAdjuster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adjusterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjusterButtonDisabled: {
    opacity: 0.3,
  },
  countInValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    minWidth: 20,
    textAlign: 'center',
  },
  shortcutHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    opacity: 0.7,
  },
  shortcutText: {
    fontSize: 12,
    color: '#8E8E93',
  },
});