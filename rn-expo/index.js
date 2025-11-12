import { registerRootComponent } from 'expo';
import App from './App';

// Try to register react-native-track-player background service when available.
// This is a no-op in Expo Go but required for Android native builds.
try {
	// registerPlaybackService is exported by react-native-track-player
	// Use require to avoid import-time errors in Expo-managed environment.
	const { registerPlaybackService } = require('react-native-track-player');
	// service.js will export the playback service function
	registerPlaybackService(() => require('./service'));
} catch (e) {
	// Not available in Expo Go / when module isn't installed. That's fine.
	// console.log('TrackPlayer service not registered:', e?.message || e);
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
