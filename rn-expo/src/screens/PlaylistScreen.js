import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import trackManager from '../src/lib/trackManager';

const STORAGE_KEY = 'pp:playlists';

export default function PlaylistScreen({ navigation }) {
    const [items, setItems] = useState([]);
    const [url, setUrl] = useState('');

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEY);
            if (raw) setItems(JSON.parse(raw));
        } catch (e) {
            console.warn('load err', e);
        }
    };

    const save = async (next) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            setItems(next);
        } catch (e) {
            console.warn('save err', e);
        }
    };

    const add = () => {
        if (!url) return;
        // extract youtube id if present
        const idMatch = url.match(/(?:v=|youtu.be\/)([\w-]{11})/);
        const id = idMatch ? idMatch[1] : url;
        const item = { id: Date.now().toString(), title: id, src: id };
        const next = [item, ...items];
        save(next);
        setUrl('');
    };

    const remove = (id) => {
        const next = items.filter(i => i.id !== id);
        save(next);
    };

    const play = (item) => {
        navigation.navigate('Player', { src: item.src, title: item.title });
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.header}>
                <Text style={styles.title}>Pocket Playlist</Text>
                <Text style={styles.subtitle}>Paste a YouTube link or ID to play</Text>
            </View>

            <View style={styles.inputRow}>
                <TextInput value={url} onChangeText={setUrl} placeholder="YouTube URL or ID" placeholderTextColor="#666" style={styles.input} />
                <TouchableOpacity onPress={add} style={styles.addBtn}><Text style={styles.addText}>Add</Text></TouchableOpacity>
            </View>

            <FlatList
                data={items}
                keyExtractor={(i) => i.id}
                contentContainerStyle={{ padding: 12 }}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => play(item)}>
                            <Text style={styles.rowTitle} numberOfLines={1}>{item.title}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => remove(item.id)} style={styles.delBtn}><Text style={styles.delText}>Delete</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => trackManager.playUrl(item.src, { title: item.title })} style={styles.playNativeBtn}>
                            <Text style={styles.playNativeText}>Play (native)</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0b1220' },
    header: { padding: 16 },
    title: { color: '#fff', fontSize: 20, fontWeight: '700' },
    subtitle: { color: '#9CA3AF', marginTop: 4 },
    inputRow: { flexDirection: 'row', paddingHorizontal: 12, alignItems: 'center' },
    input: { flex: 1, backgroundColor: '#11121A', color: '#fff', padding: 10, borderRadius: 8, marginRight: 8 },
    addBtn: { backgroundColor: '#7C3AED', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
    addText: { color: '#fff', fontWeight: '600' },
    row: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#0f1724', borderRadius: 8, marginBottom: 8 },
    rowTitle: { color: '#fff' },
    delBtn: { marginLeft: 12, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, backgroundColor: '#2b2b2b' },
    delText: { color: '#fff' },
    playNativeBtn: { marginLeft: 8, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6, backgroundColor: '#2563EB' },
    playNativeText: { color: '#fff' }
});
