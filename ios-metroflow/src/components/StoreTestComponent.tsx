import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useMetronome, useAppSettings, useProjects } from '../stores';

/**
 * Test component to verify Zustand stores are working correctly
 * This component should be removed once the stores are integrated with actual UI
 */
export const StoreTestComponent: React.FC = () => {
  const metronome = useMetronome();
  const settings = useAppSettings();
  const projects = useProjects();

  const handleTestMetronome = () => {
    metronome.setBpm(140);
    metronome.setTimeSignature(3, 4);
    metronome.togglePlayback();
  };

  const handleTestSettings = () => {
    settings.setTheme(settings.theme === 'light' ? 'dark' : 'light');
    settings.setKeepScreenOn(!settings.keepScreenOn);
  };

  const handleTestProject = () => {
    projects.createProject(
      `Test Project ${projects.projects.length + 1}`,
      'Created for testing Zustand store'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zustand Store Test</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Metronome Store</Text>
        <Text>BPM: {metronome.bpm}</Text>
        <Text>Time Signature: {metronome.timeSignature.numerator}/{metronome.timeSignature.denominator}</Text>
        <Text>Playing: {metronome.isPlaying ? 'Yes' : 'No'}</Text>
        <Button title="Test Metronome" onPress={handleTestMetronome} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings Store</Text>
        <Text>Theme: {settings.theme}</Text>
        <Text>Keep Screen On: {settings.keepScreenOn ? 'Yes' : 'No'}</Text>
        <Button title="Test Settings" onPress={handleTestSettings} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Store</Text>
        <Text>Projects: {projects.projects.length}</Text>
        <Text>Current: {projects.currentProject?.name || 'None'}</Text>
        <Button title="Create Test Project" onPress={handleTestProject} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
});