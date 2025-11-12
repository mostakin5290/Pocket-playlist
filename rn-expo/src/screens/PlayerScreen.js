import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

let TrackPlayer;
try {
    TrackPlayer = require('react-native-track-player');
} catch (e) {
    TrackPlayer = null;
}

export default function PlayerScreen({ route }) {
    const { src, title } = route.params || {};
    const playerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);

    const isAudioUrl = (u) => typeof u === 'string' && (u.endsWith('.mp3') || u.endsWith('.m4a') || u.startsWith('http'));

    useEffect(() => {
        let mounted = true;
        async function setup() {
            if (!TrackPlayer) return;
            try {
                await TrackPlayer.setupPlayer();
                await TrackPlayer.updateOptions({
                    stopWithApp: false,
                    capabilities: [
                        TrackPlayer.CAPABILITY_PLAY,
                        TrackPlayer.CAPABILITY_PAUSE,
                        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
                        TrackPlayer.CAPABILITY_STOP
                    ],
                });

                if (isAudioUrl(src)) {
                    await TrackPlayer.reset();
                    await TrackPlayer.add({
                        id: src,
                        url: src,
                        title: title || 'Audio',
                        artist: 'Pocket Playlist'
                    });
                    await TrackPlayer.play();
                    TrackPlayer.addEventListener('playback-state', (data) => {
                        if (!mounted) return;
                        setIsPlaying(data.state === TrackPlayer.STATE_PLAYING);
                    });
                }
            } catch (e) {
                // fail silently — we'll fallback to YouTube player
                // console.warn('TrackPlayer setup failed', e);
            }
        }
        setup();
        return () => { mounted = false; };
    }, [src]);

    const toggle = async () => {
        if (TrackPlayer && isAudioUrl(src)) {
            const state = await TrackPlayer.getState();
            if (state === TrackPlayer.STATE_PLAYING) await TrackPlayer.pause();
            else await TrackPlayer.play();
        } else {
            // for Youtube iframe, flip local flag — the iframe play prop controls playback
            setIsPlaying((s) => !s);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title || 'Player'}</Text>
            <View style={styles.playerWrap}>
                {isAudioUrl(src) && TrackPlayer ? (
                    <View style={{ padding: 20 }}>
                        <Text style={{ color: '#fff' }}>Playing audio via native TrackPlayer</Text>
                        <Text style={{ color: '#9CA3AF', marginTop: 8 }}>{src}</Text>
                    </View>
                ) : (
                    <YoutubePlayer height={230} play={isPlaying} videoId={src} />
                )}
            </View>
            <TouchableOpacity style={styles.button} onPress={toggle}>
                <Text style={{ color: '#fff' }}>{isPlaying ? 'Pause' : 'Play'}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0b1220', padding: 16 },
    title: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 12 },
    playerWrap: { borderRadius: 12, overflow: 'hidden', backgroundColor: '#000' },
    button: { marginTop: 18, backgroundColor: '#7C3AED', padding: 12, borderRadius: 8, alignItems: 'center' }
});
