import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { Card, SegmentedControl } from '../ui';
import { TimeSignature } from '../../types';
import {
  TIME_SIGNATURE_PRESETS,
  formatTimeSignature,
  validateTimeSignature,
  getTimeSignatureInfo,
  VALID_DENOMINATORS,
  MAX_NUMERATOR,
  MIN_NUMERATOR,
} from '../../utils/timeSignature';

interface AdvancedTimeSignatureControlProps {
  timeSignature: TimeSignature;
  onTimeSignatureChange: (numerator: number, denominator: number) => void;
  disabled?: boolean;
}

type InputMode = 'presets' | 'custom';

export const AdvancedTimeSignatureControl: React.FC<AdvancedTimeSignatureControlProps> = ({
  timeSignature,
  onTimeSignatureChange,
  disabled = false,
}) => {
  const [inputMode, setInputMode] = useState<InputMode>('presets');
  const [customNumerator, setCustomNumerator] = useState(timeSignature.numerator.toString());
  const [customDenominator, setCustomDenominator] = useState(timeSignature.denominator.toString());

  const timeSignatureInfo = getTimeSignatureInfo(timeSignature);

  const handlePresetSelect = useCallback(
    (preset: typeof TIME_SIGNATURE_PRESETS[0]) => {
      onTimeSignatureChange(preset.timeSignature.numerator, preset.timeSignature.denominator);
    },
    [onTimeSignatureChange]
  );

  const handleCustomTimeSignature = useCallback(() => {
    const numerator = parseInt(customNumerator, 10);
    const denominator = parseInt(customDenominator, 10);

    if (isNaN(numerator) || isNaN(denominator)) {
      Alert.alert('Invalid Time Signature', 'Please enter valid numbers.');
      return;
    }

    if (!validateTimeSignature(numerator, denominator)) {
      Alert.alert(
        'Invalid Time Signature',
        `Numerator must be between ${MIN_NUMERATOR} and ${MAX_NUMERATOR}.\n` +
        `Denominator must be one of: ${VALID_DENOMINATORS.join(', ')}.`
      );
      return;
    }

    onTimeSignatureChange(numerator, denominator);
  }, [customNumerator, customDenominator, onTimeSignatureChange]);

  const inputModeOptions = [
    { value: 'presets' as const, label: 'Presets' },
    { value: 'custom' as const, label: 'Custom' },
  ];

  const renderPresetCategory = (category: 'simple' | 'compound' | 'complex') => {
    const categoryPresets = TIME_SIGNATURE_PRESETS.filter(p => p.category === category);
    const categoryNames = {
      simple: 'Simple Time',
      compound: 'Compound Time',
      complex: 'Complex Time',
    };

    return (
      <View key={category} style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{categoryNames[category]}</Text>
        <View style={styles.presetGrid}>
          {categoryPresets.map((preset) => {
            const isSelected = 
              preset.timeSignature.numerator === timeSignature.numerator &&
              preset.timeSignature.denominator === timeSignature.denominator;

            return (
              <TouchableOpacity
                key={`${preset.timeSignature.numerator}/${preset.timeSignature.denominator}`}
                style={[
                  styles.presetButton,
                  isSelected && styles.presetButtonSelected,
                ]}
                onPress={() => handlePresetSelect(preset)}
                disabled={disabled}
              >
                <Text style={[
                  styles.presetTimeSignature,
                  isSelected && styles.presetTimeSignatureSelected,
                ]}>
                  {formatTimeSignature(preset.timeSignature)}
                </Text>
                <Text style={[
                  styles.presetName,
                  isSelected && styles.presetNameSelected,
                ]}>
                  {preset.name}
                </Text>
                <Text style={styles.presetDescription}>
                  {preset.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderCustomInput = () => {
    return (
      <View style={styles.customContainer}>
        <Text style={styles.customTitle}>Custom Time Signature</Text>
        
        <View style={styles.fractionContainer}>
          <View style={styles.numeratorContainer}>
            <Text style={styles.inputLabel}>Beats per measure</Text>
            <TextInput
              style={styles.fractionInput}
              value={customNumerator}
              onChangeText={setCustomNumerator}
              keyboardType="numeric"
              placeholder="4"
              maxLength={2}
              editable={!disabled}
            />
          </View>
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
          </View>
          
          <View style={styles.denominatorContainer}>
            <Text style={styles.inputLabel}>Note value</Text>
            <View style={styles.denominatorOptions}>
              {VALID_DENOMINATORS.map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.denominatorOption,
                    customDenominator === value.toString() && styles.denominatorOptionSelected,
                  ]}
                  onPress={() => setCustomDenominator(value.toString())}
                  disabled={disabled}
                >
                  <Text style={[
                    styles.denominatorText,
                    customDenominator === value.toString() && styles.denominatorTextSelected,
                  ]}>
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.customInfo}>
          <Text style={styles.customInfoText}>
            Numerator: {MIN_NUMERATOR}-{MAX_NUMERATOR} (beats per measure)
          </Text>
          <Text style={styles.customInfoText}>
            Denominator: {VALID_DENOMINATORS.join(', ')} (note value)
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.applyButton, disabled && styles.applyButtonDisabled]}
          onPress={handleCustomTimeSignature}
          disabled={disabled}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.label}>Time Signature</Text>
      
      <View style={styles.currentValue}>
        <Text style={styles.value}>{formatTimeSignature(timeSignature)}</Text>
        {timeSignatureInfo.preset && (
          <Text style={styles.presetIndicator}>
            {timeSignatureInfo.preset.name}
          </Text>
        )}
      </View>

      {/* Beat pattern visualization */}
      <View style={styles.beatPattern}>
        <Text style={styles.beatPatternLabel}>Beat Pattern:</Text>
        <View style={styles.beatIndicators}>
          {Array.from({ length: timeSignature.numerator }, (_, i) => {
            const beatNumber = i + 1;
            const isStrong = timeSignatureInfo.strongBeats.includes(beatNumber);
            const isMedium = timeSignatureInfo.mediumBeats.includes(beatNumber);
            
            return (
              <View
                key={beatNumber}
                style={[
                  styles.beatDot,
                  isStrong && styles.beatDotStrong,
                  isMedium && styles.beatDotMedium,
                ]}
              >
                <Text style={[
                  styles.beatDotText,
                  isStrong && styles.beatDotTextStrong,
                  isMedium && styles.beatDotTextMedium,
                ]}>
                  {beatNumber}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.beatLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.beatDotStrong]} />
            <Text style={styles.legendText}>Strong</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.beatDotMedium]} />
            <Text style={styles.legendText}>Medium</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.beatDot]} />
            <Text style={styles.legendText}>Weak</Text>
          </View>
        </View>
      </View>
      
      <SegmentedControl
        options={inputModeOptions}
        selectedValue={inputMode}
        onSelectionChange={setInputMode}
        disabled={disabled}
        style={styles.modeSelector}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {inputMode === 'presets' ? (
          <View style={styles.presetsContainer}>
            {['simple', 'compound', 'complex'].map(category => 
              renderPresetCategory(category as 'simple' | 'compound' | 'complex')
            )}
          </View>
        ) : (
          renderCustomInput()
        )}
      </ScrollView>
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
  currentValue: {
    alignItems: 'center',
    marginBottom: 16,
  },
  value: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1C1C1E',
    fontVariant: ['tabular-nums'],
  },
  presetIndicator: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  beatPattern: {
    alignItems: 'center',
    marginBottom: 16,
  },
  beatPatternLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  beatIndicators: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  beatDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    borderWidth: 2,
    borderColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  beatDotStrong: {
    backgroundColor: '#FFD60A',
    borderColor: '#FF9500',
  },
  beatDotMedium: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFD60A',
  },
  beatDotText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  beatDotTextStrong: {
    color: '#B5860B',
  },
  beatDotTextMedium: {
    color: '#B5860B',
  },
  beatLegend: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  legendText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  modeSelector: {
    width: '100%',
    marginBottom: 16,
  },
  content: {
    width: '100%',
    maxHeight: 400,
  },
  presetsContainer: {
    gap: 20,
  },
  categoryContainer: {
    gap: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  presetGrid: {
    gap: 8,
  },
  presetButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  presetButtonSelected: {
    backgroundColor: '#E8F5FF',
    borderColor: '#007AFF',
  },
  presetTimeSignature: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    fontVariant: ['tabular-nums'],
  },
  presetTimeSignatureSelected: {
    color: '#007AFF',
  },
  presetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 4,
  },
  presetNameSelected: {
    color: '#007AFF',
  },
  presetDescription: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  customContainer: {
    alignItems: 'center',
    gap: 20,
  },
  customTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  fractionContainer: {
    alignItems: 'center',
    gap: 16,
  },
  numeratorContainer: {
    alignItems: 'center',
    gap: 8,
  },
  denominatorContainer: {
    alignItems: 'center',
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  fractionInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    minWidth: 80,
  },
  divider: {
    alignItems: 'center',
    width: 60,
  },
  dividerLine: {
    height: 2,
    backgroundColor: '#1C1C1E',
    width: '100%',
  },
  denominatorOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  denominatorOption: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  denominatorOptionSelected: {
    backgroundColor: '#E8F5FF',
    borderColor: '#007AFF',
  },
  denominatorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  denominatorTextSelected: {
    color: '#007AFF',
  },
  customInfo: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  customInfoText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  applyButtonDisabled: {
    opacity: 0.5,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});