# Metronome Sound Assets

This directory contains audio files for the metronome.

## Required Files

### Basic Clicks
- `click_high.wav` - High-pitched click for downbeat/accent
- `click_low.wav` - Low-pitched click for regular beats
- `wood_high.wav` - Wooden block sound (high)
- `wood_low.wav` - Wooden block sound (low)
- `digital_high.wav` - Digital/electronic click (high)
- `digital_low.wav` - Digital/electronic click (low)
- `bell_high.wav` - Bell/chime sound (high)
- `bell_low.wav` - Bell/chime sound (low)

## Audio Specifications
- Format: WAV (uncompressed) for lowest latency
- Sample Rate: 44.1 kHz or 48 kHz
- Bit Depth: 16-bit
- Duration: < 100ms per sound
- Peak Level: -3dB to prevent clipping

## Notes
- All sounds should be normalized to similar perceived loudness
- Keep file sizes small (< 50KB per file)
- Test on actual iOS devices for latency