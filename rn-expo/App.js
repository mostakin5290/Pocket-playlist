import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Pocket Playlist (Expo Demo)</Text>
        <Text style={styles.subtitle}>This is a starter shell. I'll port audio & playlist screens next.</Text>
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    padding: 20,
    borderRadius: 14,
    backgroundColor: '#11121A',
    width: '90%'
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 14
  }
});
