import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, BeatIndicator, CircularProgress } from '../ui';
import { PlayButton } from './PlayButton';
import { TimeSignature } from '../../types';
import { getTimeSignatureInfo } from '../../utils/timeSignature';

interface MetronomeDisplayProps {
  isPlaying: boolean;
  currentBeat: number;
  currentBar: number;
  bpm: number;
  timeSignature: TimeSignature;
  onPlayToggle: () => void;
  loading?: boolean;
}

export const MetronomeDisplay: React.FC<MetronomeDisplayProps> = ({
  isPlaying,
  currentBeat,
  currentBar,
  bpm,
  timeSignature,
  onPlayToggle,
  loading = false,
}) => {
  // Get time signature information with beat patterns
  const timeSignatureInfo = getTimeSignatureInfo(timeSignature);
  
  // Calculate progress within current beat cycle
  const beatProgress = currentBeat > 0 ? (currentBeat - 1) / timeSignature.numerator : 0;

  return (
    <Card style={styles.container}>
      {/* Bar Counter */}
      <View style={styles.barCounter}>
        <Text style={styles.barLabel}>Bar</Text>
        <Text style={styles.barValue}>{currentBar}</Text>
      </View>

      {/* Beat Indicator */}
      <View style={styles.beatSection}>
        <BeatIndicator
          totalBeats={timeSignature.numerator}
          currentBeat={currentBeat}
          accentBeats={timeSignatureInfo.strongBeats}
          mediumBeats={timeSignatureInfo.mediumBeats}
          size="large"
          animated={isPlaying}
        />
      </View>

      {/* Play Button with Circular Progress */}
      <View style={styles.playSection}>
        <CircularProgress
          size={140}
          strokeWidth={6}
          progress={beatProgress}
          color={isPlaying ? '#34C759' : '#007AFF'}
        >
          <PlayButton
            isPlaying={isPlaying}
            onPress={onPlayToggle}
            loading={loading}
            size="large"
          />
        </CircularProgress>
      </View>

      {/* BPM Display */}
      <View style={styles.bpmSection}>
        <Text style={styles.bpmLabel}>BPM</Text>
        <Text style={styles.bpmValue}>{bpm}</Text>
      </View>

      {/* Time Signature Display */}
      <View style={styles.timeSignatureSection}>
        <Text style={styles.timeSignatureLabel}>Time</Text>
        <Text style={styles.timeSignatureValue}>
          {timeSignature.numerator}/{timeSignature.denominator}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  barCounter: {
    alignItems: 'center',
    marginBottom: 20,
  },
  barLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  barValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    fontVariant: ['tabular-nums'],
  },
  beatSection: {
    marginBottom: 32,
  },
  playSection: {
    marginBottom: 32,
  },
  bpmSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  bpmLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  bpmValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    fontVariant: ['tabular-nums'],
  },
  timeSignatureSection: {
    alignItems: 'center',
  },
  timeSignatureLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  timeSignatureValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    fontVariant: ['tabular-nums'],
  },
});