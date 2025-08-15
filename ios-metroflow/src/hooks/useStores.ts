import { useMetronomeStore } from '../stores/metronomeStore';
import { useAppSettingsStore } from '../stores/appSettingsStore';
import { useProjectStore } from '../stores/projectStore';

/**
 * Custom hook to access metronome state and actions
 */
export const useMetronome = () => {
  const store = useMetronomeStore();
  return {
    // State
    isPlaying: store.isPlaying,
    currentBeat: store.currentBeat,
    currentBar: store.currentBar,
    bpm: store.bpm,
    timeSignature: store.timeSignature,
    volume: store.volume,
    clickSound: store.clickSound,
    accentBeats: store.accentBeats,
    countIn: store.countIn,
    countInBars: store.countInBars,
    
    // Actions
    setBpm: store.setBpm,
    setTimeSignature: store.setTimeSignature,
    setVolume: store.setVolume,
    togglePlayback: store.togglePlayback,
    startPlayback: store.startPlayback,
    stopPlayback: store.stopPlayback,
    setCurrentBeat: store.setCurrentBeat,
    incrementBeat: store.incrementBeat,
    setClickSound: store.setClickSound,
    setAccentBeats: store.setAccentBeats,
    toggleCountIn: store.toggleCountIn,
    setCountInBars: store.setCountInBars,
    reset: store.reset,
  };
};

/**
 * Custom hook to access app settings
 */
export const useAppSettings = () => {
  const store = useAppSettingsStore();
  return {
    // State
    theme: store.theme,
    keepScreenOn: store.keepScreenOn,
    vibrateOnBeat: store.vibrateOnBeat,
    flashOnBeat: store.flashOnBeat,
    visualBeatIndicator: store.visualBeatIndicator,
    audioLatencyCompensation: store.audioLatencyCompensation,
    backgroundPlayback: store.backgroundPlayback,
    defaultBpm: store.defaultBpm,
    defaultTimeSignature: store.defaultTimeSignature,
    
    // Actions
    setTheme: store.setTheme,
    setKeepScreenOn: store.setKeepScreenOn,
    setVibrateOnBeat: store.setVibrateOnBeat,
    setFlashOnBeat: store.setFlashOnBeat,
    setVisualBeatIndicator: store.setVisualBeatIndicator,
    setAudioLatencyCompensation: store.setAudioLatencyCompensation,
    setBackgroundPlayback: store.setBackgroundPlayback,
    setDefaultBpm: store.setDefaultBpm,
    setDefaultTimeSignature: store.setDefaultTimeSignature,
    resetSettings: store.resetSettings,
  };
};

/**
 * Custom hook to access project management state and actions
 */
export const useProjects = () => {
  const store = useProjectStore();
  return {
    // State
    currentProject: store.currentProject,
    projects: store.projects,
    selectedProjectId: store.selectedProjectId,
    isLoading: store.isLoading,
    error: store.error,
    
    // Project Management
    createProject: store.createProject,
    loadProject: store.loadProject,
    saveProject: store.saveProject,
    deleteProject: store.deleteProject,
    duplicateProject: store.duplicateProject,
    renameProject: store.renameProject,
    
    // Current Project Editing
    updateCurrentProject: store.updateCurrentProject,
    addSection: store.addSection,
    updateSection: store.updateSection,
    deleteSection: store.deleteSection,
    addTrack: store.addTrack,
    updateTrack: store.updateTrack,
    deleteTrack: store.deleteTrack,
    
    // UI
    setSelectedProjectId: store.setSelectedProjectId,
    setError: store.setError,
    clearError: store.clearError,
  };
};

/**
 * Custom hook to access only metronome playback controls
 */
export const useMetronomeControls = () => {
  const store = useMetronomeStore();
  return {
    isPlaying: store.isPlaying,
    play: store.startPlayback,
    stop: store.stopPlayback,
    toggle: store.togglePlayback,
  };
};

/**
 * Custom hook to access only metronome settings
 */
export const useMetronomeSettings = () => {
  const store = useMetronomeStore();
  return {
    bpm: store.bpm,
    timeSignature: store.timeSignature,
    volume: store.volume,
    clickSound: store.clickSound,
    setBpm: store.setBpm,
    setTimeSignature: store.setTimeSignature,
    setVolume: store.setVolume,
    setClickSound: store.setClickSound,
  };
};