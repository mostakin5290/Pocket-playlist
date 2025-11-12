let TrackPlayer;
try {
    TrackPlayer = require('react-native-track-player');
} catch (e) {
    TrackPlayer = null;
}

export async function setupIfNeeded() {
    if (!TrackPlayer) return false;
    try {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
            stopWithApp: false,
            capabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
                TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
                TrackPlayer.CAPABILITY_STOP,
            ],
        });
        return true;
    } catch (e) {
        return false;
    }
}

export async function playUrl(url, meta = {}) {
    if (!TrackPlayer) return false;
    await setupIfNeeded();
    await TrackPlayer.reset();
    await TrackPlayer.add({ id: url, url, title: meta.title || 'Audio', artist: meta.artist || '' });
    await TrackPlayer.play();
    return true;
}

export async function addToQueue(url, meta = {}) {
    if (!TrackPlayer) return false;
    await setupIfNeeded();
    await TrackPlayer.add({ id: url, url, title: meta.title || 'Audio', artist: meta.artist || '' });
    return true;
}

export async function togglePlay() {
    if (!TrackPlayer) return false;
    const state = await TrackPlayer.getState();
    if (state === TrackPlayer.STATE_PLAYING) await TrackPlayer.pause();
    else await TrackPlayer.play();
    return true;
}

export async function skipNext() {
    if (!TrackPlayer) return false;
    await TrackPlayer.skipToNext();
    return true;
}

export async function skipPrev() {
    if (!TrackPlayer) return false;
    await TrackPlayer.skipToPrevious();
    return true;
}

export default {
    setupIfNeeded,
    playUrl,
    addToQueue,
    togglePlay,
    skipNext,
    skipPrev,
};
