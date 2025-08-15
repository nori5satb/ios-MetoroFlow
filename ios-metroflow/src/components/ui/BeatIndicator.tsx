import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface BeatIndicatorProps {
  totalBeats: number;
  currentBeat: number;
  accentBeats?: number[];
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

export const BeatIndicator: React.FC<BeatIndicatorProps> = ({
  totalBeats,
  currentBeat,
  accentBeats = [1],
  size = 'medium',
  animated = true,
}) => {
  const animatedValue = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (animated && currentBeat > 0) {
      animatedValue.setValue(1.2);
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [currentBeat, animated, animatedValue]);

  const renderBeat = (beatNumber: number) => {
    const isActive = beatNumber === currentBeat;
    const isAccent = accentBeats.includes(beatNumber);
    
    return (
      <Animated.View
        key={beatNumber}
        style={[
          styles.beat,
          styles[size],
          isAccent && styles.accentBeat,
          isActive && styles.activeBeat,
          isActive && animated && {
            transform: [{ scale: animatedValue }],
          },
        ]}
      >
        <Text
          style={[
            styles.beatText,
            styles[`${size}Text`],
            isAccent && styles.accentBeatText,
            isActive && styles.activeBeatText,
          ]}
        >
          {beatNumber}
        </Text>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: totalBeats }, (_, index) => renderBeat(index + 1))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  beat: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  
  // Sizes
  small: {
    width: 32,
    height: 32,
  },
  medium: {
    width: 48,
    height: 48,
  },
  large: {
    width: 64,
    height: 64,
  },
  
  // States
  accentBeat: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFD60A',
  },
  activeBeat: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  
  // Text styles
  beatText: {
    fontWeight: '600',
    color: '#8E8E93',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 18,
  },
  largeText: {
    fontSize: 24,
  },
  accentBeatText: {
    color: '#B5860B',
  },
  activeBeatText: {
    color: '#FFFFFF',
  },
});