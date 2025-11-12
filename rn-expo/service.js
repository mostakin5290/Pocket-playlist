module.exports = async function () {
    // This file runs in a separate JS context on Android to handle remote actions
    const TrackPlayer = require('react-native-track-player');

    TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play());
    TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause());
    TrackPlayer.addEventListener('remote-stop', () => TrackPlayer.stop());
    TrackPlayer.addEventListener('remote-next', () => TrackPlayer.skipToNext());
    TrackPlayer.addEventListener('remote-previous', () => TrackPlayer.skipToPrevious());
};
