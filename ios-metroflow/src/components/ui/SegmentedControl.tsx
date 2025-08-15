import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  selectedValue: T;
  onSelectionChange: (value: T) => void;
  disabled?: boolean;
  style?: object;
}

export function SegmentedControl<T extends string>({
  options,
  selectedValue,
  onSelectionChange,
  disabled = false,
  style,
}: SegmentedControlProps<T>) {
  return (
    <View style={[styles.container, style]}>
      {options.map((option, index) => {
        const isSelected = option.value === selectedValue;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;
        
        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.segment,
              isFirst && styles.firstSegment,
              isLast && styles.lastSegment,
              isSelected && styles.selectedSegment,
              disabled && styles.disabledSegment,
            ]}
            onPress={() => onSelectionChange(option.value)}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.segmentText,
                isSelected && styles.selectedSegmentText,
                disabled && styles.disabledSegmentText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  firstSegment: {
    // No additional styles needed for first segment
  },
  lastSegment: {
    // No additional styles needed for last segment
  },
  selectedSegment: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  disabledSegment: {
    opacity: 0.5,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  selectedSegmentText: {
    color: '#1C1C1E',
    fontWeight: '600',
  },
  disabledSegmentText: {
    opacity: 0.5,
  },
});