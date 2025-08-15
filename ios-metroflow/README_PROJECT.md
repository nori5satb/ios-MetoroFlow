# MetroFlow - Professional Metronome & Sequencer App

## Overview

MetroFlow is a professional-grade metronome and sequencer application for iOS, built with React Native and Expo. Designed for musicians, composers, and music educators, it offers advanced rhythm patterns, multi-track support, and rich sound selection.

## Features

- **Metronome**: BPM range 40-300, multiple sections, count-in functionality
- **Sequencer**: Up to 10 simultaneous tracks, note editing, pattern display
- **Sound Engine**: 10+ basic tones, synthesizer types
- **Project Management**: Auto-save, import/export (JSON format)

## Tech Stack

- **Framework**: Expo SDK 50+
- **Language**: TypeScript (strict mode)
- **UI**: React Native
- **State Management**: Zustand / React Context API
- **Audio**: expo-av
- **Storage**: AsyncStorage / expo-sqlite

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- iOS Simulator (Mac) or Android Emulator
- Xcode (for iOS development)

## Installation

```bash
# Clone the repository
git clone https://github.com/nori5satb/ios-MetoroFlow.git
cd ios-MetoroFlow/ios-metroflow

# Install dependencies
npm install

# For iOS (Mac only)
cd ios && pod install && cd ..
```

## Development

```bash
# Start the development server
npm start

# Run on iOS Simulator
npm run ios

# Run on Android Emulator
npm run android

# Run on Web (development only)
npm run web

# Type checking
npm run typecheck

# Linting
npm run lint

# Format code
npm run format
```

## Project Structure

```
ios-metroflow/
├── app/                    # Main application screens
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Metronome main screen
│   │   └── explore.tsx    # Project management screen
│   └── _layout.tsx        # App layout
├── src/                   # Source code
│   ├── components/        # Reusable UI components
│   ├── stores/           # Zustand state management
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── hooks/            # Custom React hooks
│   └── services/         # Business logic
│       ├── audio/        # Audio engine
│       ├── storage/      # Data persistence
│       └── project/      # Project management
├── assets/               # Images, fonts, and other assets
├── constants/            # Application constants
└── scripts/              # Build and utility scripts
```

## Building for Production

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo account
eas login

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## Configuration Files

- `tsconfig.json` - TypeScript configuration with strict mode
- `eslint.config.js` - ESLint configuration with Prettier integration
- `.prettierrc.json` - Prettier code formatting rules
- `app.json` - Expo application configuration

## Contributing

1. Check GitHub Issues for tasks
2. Create a feature branch: `feature/issue-{number}-{description}`
3. Make your changes
4. Run tests and linting
5. Submit a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For questions or issues, please check the [GitHub Issues](https://github.com/nori5satb/ios-MetoroFlow/issues) page.