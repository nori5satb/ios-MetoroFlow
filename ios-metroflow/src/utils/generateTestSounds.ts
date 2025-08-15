/**
 * Utility to generate test sound data for development
 * This creates simple sine wave beeps that can be used as placeholder sounds
 * In production, these would be replaced with actual audio files
 */

export interface TestSoundData {
  uri: string;
  duration: number;
}

/**
 * Generate a simple sine wave tone as a data URI
 * This is for testing purposes only - real sounds should be proper audio files
 */
export const generateTestTone = (
  frequency: number,
  duration: number,
  _sampleRate: number = 44100
): TestSoundData => {
  // Note: This is a placeholder function
  // In a real implementation, we would use actual audio files
  // For now, we'll return a dummy data structure
  
  return {
    uri: `test-tone-${frequency}hz`,
    duration: duration,
  };
};

/**
 * Get test sound configurations for different sound types
 */
export const getTestSounds = () => {
  return {
    wood: {
      high: generateTestTone(800, 0.05),
      low: generateTestTone(600, 0.05),
    },
    digital: {
      high: generateTestTone(1000, 0.03),
      low: generateTestTone(750, 0.03),
    },
    bell: {
      high: generateTestTone(1200, 0.1),
      low: generateTestTone(900, 0.1),
    },
    tick: {
      high: generateTestTone(1500, 0.02),
      low: generateTestTone(1000, 0.02),
    },
  };
};

/**
 * Note for production:
 * Replace this with actual sound file imports like:
 * 
 * export const productionSounds = {
 *   wood: {
 *     high: require('../../assets/sounds/wood_high.wav'),
 *     low: require('../../assets/sounds/wood_low.wav'),
 *   },
 *   // ... etc
 * };
 */