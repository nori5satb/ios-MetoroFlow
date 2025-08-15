import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Card, Slider, SegmentedControl } from '../ui';
import { useTapTempo } from '../../hooks/useTapTempo';
import { MIN_BPM, MAX_BPM, formatBpm, validateBpm } from '../../utils/tempo';
import { BPM_PRESETS, findPresetForBpm } from '../../utils/bpmPresets';

interface AdvancedBpmControlProps {
  bpm: number;
  onBpmChange: (bpm: number) => void;
  onSlidingComplete?: (bpm: number) => void;
  disabled?: boolean;
}

type InputMode = 'slider' | 'tap' | 'manual' | 'presets';

export const AdvancedBpmControl: React.FC<AdvancedBpmControlProps> = ({
  bpm,
  onBpmChange,
  onSlidingComplete,
  disabled = false,
}) => {
  const [inputMode, setInputMode] = useState<InputMode>('slider');
  const [manualInput, setManualInput] = useState(bpm.toString());
  // const [showPresets, setShowPresets] = useState(false);

  const handleBpmChange = useCallback(
    (newBpm: number) => {
      const validatedBpm = validateBpm(newBpm);
      onBpmChange(validatedBpm);
      
      // Haptic feedback on iOS
      if (typeof Haptics !== 'undefined') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
    },
    [onBpmChange]
  );

  const { tap, reset, tapCount, currentBpm, isActive, canCalculate } = useTapTempo({
    minTaps: 2,
    maxTaps: 8,
    timeoutMs: 3000,
    onBpmChange: handleBpmChange,
  });

  const handleIncrement = useCallback(() => {
    handleBpmChange(bpm + 1);
  }, [bpm, handleBpmChange]);

  const handleDecrement = useCallback(() => {
    handleBpmChange(bpm - 1);
  }, [bpm, handleBpmChange]);

  const handleLargeIncrement = useCallback(() => {
    handleBpmChange(bpm + 10);
  }, [bpm, handleBpmChange]);

  const handleLargeDecrement = useCallback(() => {
    handleBpmChange(bpm - 10);
  }, [bpm, handleBpmChange]);

  const handleManualSubmit = useCallback(() => {
    const newBpm = parseInt(manualInput, 10);
    if (isNaN(newBpm)) {
      Alert.alert('Invalid BPM', 'Please enter a valid number.');
      setManualInput(bpm.toString());
      return;
    }
    
    if (newBpm < MIN_BPM || newBpm > MAX_BPM) {
      Alert.alert(
        'Invalid BPM',
        `BPM must be between ${MIN_BPM} and ${MAX_BPM}.`
      );
      setManualInput(bpm.toString());
      return;
    }
    
    handleBpmChange(newBpm);
  }, [manualInput, bpm, handleBpmChange]);

  const handlePresetSelect = useCallback(
    (presetName: string) => {
      const preset = BPM_PRESETS.find((p) => p.name === presetName);
      if (preset) {
        handleBpmChange(preset.bpm);
      }
    },
    [handleBpmChange]
  );

  const currentPreset = findPresetForBpm(bpm);

  const inputModeOptions = [
    { value: 'slider' as const, label: 'Slider' },
    { value: 'tap' as const, label: 'Tap' },
    { value: 'manual' as const, label: 'Manual' },
    { value: 'presets' as const, label: 'Presets' },
  ];

  const renderInputControls = () => {
    switch (inputMode) {
      case 'slider':
        return (
          <View style={styles.sliderContainer}>
            <Slider
              value={bpm}
              minimumValue={MIN_BPM}
              maximumValue={MAX_BPM}
              onValueChange={handleBpmChange}
              onSlidingComplete={onSlidingComplete}
              step={1}
              disabled={disabled}
              formatValue={formatBpm}
              showValue={false}
            />
            
            <View style={styles.incrementButtons}>
              <TouchableOpacity
                style={styles.incrementButton}
                onPress={handleLargeDecrement}
                disabled={disabled}
              >
                <Text style={styles.incrementButtonText}>-10</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.incrementButton}
                onPress={handleDecrement}
                disabled={disabled}
              >
                <Ionicons name="remove" size={20} color="#007AFF" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.incrementButton}
                onPress={handleIncrement}
                disabled={disabled}
              >
                <Ionicons name="add" size={20} color="#007AFF" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.incrementButton}
                onPress={handleLargeIncrement}
                disabled={disabled}
              >
                <Text style={styles.incrementButtonText}>+10</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'tap':
        return (
          <View style={styles.tapContainer}>
            <TouchableOpacity
              style={[styles.tapButton, isActive && styles.tapButtonActive]}
              onPress={tap}
              disabled={disabled}
            >
              <Ionicons
                name="musical-note"
                size={48}
                color={isActive ? "#34C759" : "#007AFF"}
              />
              <Text style={[styles.tapButtonText, isActive && styles.tapButtonActiveText]}>
                TAP TEMPO
              </Text>
              <Text style={styles.tapCount}>
                {tapCount > 0 ? `${tapCount} taps` : 'Tap to start'}
              </Text>
            </TouchableOpacity>
            
            {canCalculate && currentBpm && (
              <View style={styles.tapResult}>
                <Text style={styles.tapResultText}>
                  Detected: {currentBpm} BPM
                </Text>
              </View>
            )}
            
            <TouchableOpacity style={styles.resetButton} onPress={reset}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        );

      case 'manual':
        return (
          <View style={styles.manualContainer}>
            <TextInput
              style={styles.manualInput}
              value={manualInput}
              onChangeText={setManualInput}
              onSubmitEditing={handleManualSubmit}
              keyboardType="numeric"
              placeholder="Enter BPM"
              editable={!disabled}
              selectTextOnFocus
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleManualSubmit}
              disabled={disabled}
            >
              <Text style={styles.submitButtonText}>Set</Text>
            </TouchableOpacity>
          </View>
        );

      case 'presets':
        return (
          <View style={styles.presetsContainer}>
            {BPM_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.name}
                style={[
                  styles.presetButton,
                  currentPreset?.name === preset.name && styles.presetButtonActive,
                ]}
                onPress={() => handlePresetSelect(preset.name)}
                disabled={disabled}
              >
                <Text style={[
                  styles.presetName,
                  currentPreset?.name === preset.name && styles.presetNameActive,
                ]}>
                  {preset.name}
                </Text>
                <Text style={[
                  styles.presetBpm,
                  currentPreset?.name === preset.name && styles.presetBpmActive,
                ]}>
                  {preset.bpm}
                </Text>
                <Text style={styles.presetDescription}>
                  {preset.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.label}>BPM</Text>
      <Text style={styles.value}>{formatBpm(bpm)}</Text>
      
      {currentPreset && (
        <Text style={styles.presetIndicator}>
          {currentPreset.name} • {currentPreset.description}
        </Text>
      )}
      
      <SegmentedControl
        options={inputModeOptions}
        selectedValue={inputMode}
        onSelectionChange={setInputMode}
        disabled={disabled}
        style={styles.modeSelector}
      />
      
      {renderInputControls()}
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
    marginBottom: 8,
    fontVariant: ['tabular-nums'],
  },
  presetIndicator: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
    textAlign: 'center',
  },
  modeSelector: {
    width: '100%',
    marginBottom: 20,
  },
  sliderContainer: {
    width: '100%',
  },
  incrementButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 12,
  },
  incrementButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    width: 60,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incrementButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  tapContainer: {
    width: '100%',
    alignItems: 'center',
  },
  tapButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 48,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tapButtonActive: {
    backgroundColor: '#E8F5E8',
    borderColor: '#34C759',
  },
  tapButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginTop: 8,
  },
  tapButtonActiveText: {
    color: '#34C759',
  },
  tapCount: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  tapResult: {
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tapResultText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34C759',
  },
  resetButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  manualContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  manualInput: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  presetsContainer: {
    width: '100%',
    gap: 8,
  },
  presetButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  presetButtonActive: {
    backgroundColor: '#E8F5FF',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  presetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
  },
  presetNameActive: {
    color: '#007AFF',
  },
  presetBpm: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8E8E93',
    marginHorizontal: 12,
    fontVariant: ['tabular-nums'],
  },
  presetBpmActive: {
    color: '#007AFF',
  },
  presetDescription: {
    fontSize: 12,
    color: '#8E8E93',
    flex: 1,
    textAlign: 'right',
  },
});