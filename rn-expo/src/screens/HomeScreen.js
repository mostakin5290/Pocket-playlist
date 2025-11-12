import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pocket Playlist</Text>
            <Text style={styles.subtitle}>A small Expo demo port of the web app.</Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Playlist')}>
                <Text style={styles.buttonText}>Open Playlist</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.ghost]} onPress={() => navigation.navigate('Help')}>
                <Text style={[styles.buttonText, styles.ghostText]}>Help & Notes</Text>
            </TouchableOpacity>

            <Text style={styles.footer}>Built for quick prototyping — background playback is platform-limited in Expo.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0b1220', padding: 20, justifyContent: 'center' },
    title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 6 },
    subtitle: { color: '#9CA3AF', marginBottom: 20 },
    button: { backgroundColor: '#7C3AED', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 12 },
    buttonText: { color: '#fff', fontWeight: '600' },
    ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#2b2b2b' },
    ghostText: { color: '#9CA3AF' },
    footer: { color: '#6B7280', marginTop: 24, textAlign: 'center' }
});
