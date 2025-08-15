import React from 'react';
import { ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { AdvancedBpmControl } from '../../src/components/metronome/AdvancedBpmControl';
import { TimeSignatureControl } from '../../src/components/metronome/TimeSignatureControl';
import { VolumeControl } from '../../src/components/metronome/VolumeControl';
import { SoundSelector } from '../../src/components/metronome/SoundSelector';
import { MetronomeDisplay } from '../../src/components/metronome/MetronomeDisplay';
import { StoreTestComponent } from '../../src/components/StoreTestComponent';
import { useMetronome } from '../../src/stores';

export default function HomeScreen() {
  const {
    isPlaying,
    currentBeat,
    currentBar,
    bpm,
    timeSignature,
    volume,
    clickSound,
    accentBeats,
    setBpm,
    setTimeSignature,
    setVolume,
    setClickSound,
    togglePlayback,
  } = useMetronome();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* メトロノームメイン表示 */}
        <MetronomeDisplay
          isPlaying={isPlaying}
          currentBeat={currentBeat}
          currentBar={currentBar}
          bpm={bpm}
          timeSignature={timeSignature}
          onPlayToggle={togglePlayback}
          accentBeats={accentBeats}
        />
        
        {/* BPMコントロール */}
        <AdvancedBpmControl
          bpm={bpm}
          onBpmChange={setBpm}
        />
        
        {/* 拍子設定 */}
        <TimeSignatureControl
          timeSignature={timeSignature}
          onTimeSignatureChange={setTimeSignature}
        />
        
        {/* 音量調整 */}
        <VolumeControl
          volume={volume}
          onVolumeChange={setVolume}
        />
        
        {/* 音色選択 */}
        <SoundSelector
          selectedSound={clickSound}
          onSoundChange={setClickSound}
        />
        
        {/* Zustandストアテスト */}
        <StoreTestComponent />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
});