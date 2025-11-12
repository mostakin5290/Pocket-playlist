import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function HelpScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
            <Text style={styles.title}>Help & Notes</Text>

            <Text style={styles.header}>What this demo does</Text>
            <Text style={styles.p}>This Expo demo shows a minimal port of Pocket Playlist features: create a small playlist by pasting YouTube URLs/IDs, save locally, and open a player that uses a YouTube iframe.</Text>

            <Text style={styles.header}>Background playback</Text>
            <Text style={styles.p}>Expo-managed apps do not guarantee background playback with lock-screen controls. For reliable background audio, eject to bare React Native and integrate a library such as react-native-track-player.</Text>

            <Text style={styles.header}>Next steps</Text>
            <Text style={styles.p}>You can ask me to: polish the UI, add reorder support, integrate a native audio player (requires eject), or prepare a TWA/Capacitor packaging plan.</Text>

            <Text style={styles.header}>Notes for developers</Text>
            <Text style={styles.p}>This demo uses AsyncStorage for persistence and react-native-youtube-iframe for playback. On iOS Simulator, audio may be muted by default; test on a real device for accurate behavior.</Text>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: '#0b1220' },
    title: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 12 },
    header: { color: '#fff', fontSize: 16, fontWeight: '600', marginTop: 12 },
    p: { color: '#9CA3AF', marginTop: 6, lineHeight: 20 }
});
