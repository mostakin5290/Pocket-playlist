import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, FastForward, Rewind } from 'lucide-react';
import { createPlayer } from '../../lib/ytManager';

const AudioPlayer = ({
  videoId = 'EmsRACUM4V4',
  videoTitle = 'YouTube Audio',
  videoThumbnail,
  onEnd,
  onSkipNext,
  onSkipPrev,
}) => {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const tickRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const [muted, setMuted] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [titleText, setTitleText] = useState(videoTitle);

  useEffect(() => {
    setTitleText(videoTitle);
  }, [videoTitle]);

  // Player setup and teardown
  useEffect(() => {
    let mounted = true;
    const id = `yt-audio-${Date.now()}`;
    const div = document.createElement('div');
    div.id = id;
    div.style.width = '1px';
    div.style.height = '1px';
    div.style.position = 'absolute';
    div.style.left = '-9999px';

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(div);
    }

    createPlayer(id, {
      height: 0,
      width: 0,
      videoId,
      playerVars: {
        playsinline: 1,
        rel: 0,
        modestbranding: 1,
        controls: 0,
        disablekb: 1,
        iv_load_policy: 3,
        html5: 1,
      },
      events: {
        onReady: (e) => {
          setReady(true);
          const p = e.target;
          p.setVolume(volume);
          p.mute();
          p.playVideo();
          setTimeout(() => {
            p.unMute();
            setDuration(p.getDuration());
            setVolume(p.getVolume());
            try {
              const info = p.getVideoData && p.getVideoData();
              if (info && info.title) setTitleText(info.title);
            } catch (err) { /* ignore */ }
          }, 500);
        },
        onStateChange: (ev) => {
          const STATES = window.YT.PlayerState;
          if (ev.data === STATES.PLAYING) {
            setPlaying(true);
            setBuffering(false);
          } else if (ev.data === STATES.PAUSED) {
            setPlaying(false);
          } else if (ev.data === STATES.ENDED) {
            setPlaying(false);
            if (typeof onEnd === 'function') onEnd();
          } else if (ev.data === STATES.BUFFERING) {
            setBuffering(true);
          } else if (ev.data === STATES.CUED) {
            if (playing) p.playVideo();
          }
        },
        onError: (e) => {
          console.error('YouTube Player Error', e);
          if (e.data === 150 || e.data === 101) {
            if (typeof onSkipNext === 'function') onSkipNext();
            else if (typeof onEnd === 'function') onEnd();
          }
        }
      }
    }).then((player) => {
      if (!mounted) {
        try { player.destroy(); } catch (e) { }
        return;
      }
      playerRef.current = player;
    }).catch((err) => {
      console.error('YT createPlayer error', err);
    });
    return () => {
      mounted = false;
      if (tickRef.current) clearInterval(tickRef.current);
      if (playerRef.current && playerRef.current.destroy) playerRef.current.destroy();
    };
  }, [videoId, onEnd, onSkipNext]);

  // Logic to load new videoId when prop changes
  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    const tryLoad = () => {
      if (cancelled) return;
      const p = playerRef.current;
      // Only attempt load when player is ready and iframe exists with a src
      try {
        const iframe = p && typeof p.getIframe === 'function' ? p.getIframe() : null;
        if (p && ready && iframe && iframe.src) {
          try {
            if (typeof p.loadVideoById === 'function') {
              p.loadVideoById(videoId);
              p.playVideo && p.playVideo();
            } else if (typeof p.cueVideoById === 'function') {
              // fallback: cue then play
              p.cueVideoById(videoId);
              p.playVideo && p.playVideo();
            } else {
              // Player doesn't expose expected API yet — log and skip to avoid TypeError
              console.warn('AudioPlayer: YT player instance does not expose loadVideoById/cueVideoById yet', p);
            }
          } catch (e) {
            console.warn('AudioPlayer video update error', e);
          }
        } else if (tries < 6) {
          tries += 1;
          // retry after a short delay — handles timing issues in dev/StrictMode
          setTimeout(tryLoad, 200);
        }
      } catch (e) {
        console.warn('AudioPlayer video load guard error', e);
      }
    };

    tryLoad();

    return () => { cancelled = true; };
  }, [videoId, ready]);

  // Timer for progress
  useEffect(() => {
    if (!playing || !ready || !playerRef.current) return;
    tickRef.current = setInterval(() => {
      try {
        setCurrentTime(playerRef.current.getCurrentTime());
        setDuration(playerRef.current.getDuration());
        if (playerRef.current.isMuted() !== muted) setMuted(playerRef.current.isMuted());
      } catch (e) {
        if (tickRef.current) clearInterval(tickRef.current);
      }
    }, 500);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [playing, ready, muted]);

  // Lightweight: avoid complex MediaSession and visibility handling here to keep player logic focused
  // (This keeps the component smaller and more predictable across browsers/devices.)

  // Controls
  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p || !ready) return;
    const state = p.getPlayerState();
    if (state === window.YT.PlayerState.PLAYING) {
      p.pauseVideo();
    } else {
      if (state === window.YT.PlayerState.ENDED) {
        p.seekTo(0, true);
      }
      p.playVideo();
    }
  }, [ready]);

  const seekTo = useCallback(
    (time) => {
      const p = playerRef.current;
      if (!p || !ready) return;
      p.seekTo(Number(time), true);
      setCurrentTime(Number(time));
    },
    [ready]
  );

  const handleSeek = useCallback((e) => {
    seekTo(e.target.value);
  }, [seekTo]);

  const skipForward = useCallback(() => skip(10), [seekTo, currentTime, duration]);
  const skipBackward = useCallback(() => skip(-10), [seekTo, currentTime, duration]);

  const skip = useCallback(
    (offset) => {
      const next = Math.max(0, Math.min(currentTime + offset, duration));
      seekTo(next);
    },
    [currentTime, duration, seekTo]
  );

  const handleVolumeChange = useCallback(
    (e) => {
      const v = Number(e.target.value);
      const p = playerRef.current;
      if (!p || !ready) return;
      p.setVolume(v);
      setVolume(v);
      if (v > 0 && muted) p.unMute();
      if (v === 0 && !muted) p.mute();
    },
    [ready, muted]
  );

  const toggleMute = useCallback(() => {
    const p = playerRef.current;
    if (!p || !ready) return;
    if (muted) {
      p.unMute();
      setMuted(false);
      if (volume === 0) p.setVolume(70); setVolume(p.getVolume());
    } else {
      p.mute();
      setMuted(true);
    }
  }, [muted, ready, volume]);

  const displayTime = (s = 0) => {
    if (!s || s < 0) return '0:00';
    const sec = Math.floor(s);
    const m = Math.floor(sec / 60);
    const r = sec % 60;
    return `${m}:${r.toString().padStart(2, '0')}`;
  };

  const thumb = videoThumbnail || `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
  const activeColor = 'var(--accent-from)';

  return (
    <div
      className="bg-card rounded-2xl shadow-lg w-full md:mx-auto flex flex-col items-center gap-6 px-4 sm:px-6 lg:px-8 py-6 md:py-8 relative smooth-transition fade-up"
    >
      <div className="relative w-full aspect-video p-1.5 rounded-3xl bg-gradient-to from-purple-900/10 to-pink-900/10 shadow-lg md:max-w-sm">
        <div className='w-full h-full rounded-2xl overflow-hidden bg-[#0f0f12]'>
          <img src={thumb} alt={titleText} className='w-full h-full object-cover' />
        </div>

        {!ready && (
          <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-black/60 z-30">
            <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: activeColor, borderTopColor: 'transparent' }} />
          </div>
        )}
      </div>

      <div className="w-full text-center">
        <h2 className="text-xl font-bold text-white truncate">{titleText}</h2>
        <p className="text-sm" style={{ color: activeColor }}>
          {buffering ? 'Buffering...' : 'Now Playing'}
        </p>
      </div>

      {/* Progress Slider */}
      <div className="w-full">
        <input
          type="range"
          min={0}
          max={duration || 1}
          step="any"
          value={currentTime}
          onInput={handleSeek} // Use onInput for continuous update
          disabled={!ready}
          className="w-full h-2 md:h-1 appearance-none bg-gray-700 rounded-full cursor-pointer"
          style={{
            '--accent-color': activeColor,
            '--rail-color': 'rgba(255,255,255,0.25)',
            '--progress': `${(currentTime / (duration || 1)) * 100}%`,
            background: `linear-gradient(to right, var(--accent-color) 0%, var(--accent-color) var(--progress), var(--rail-color) var(--progress), var(--rail-color) 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{displayTime(currentTime)}</span>
          <span>{displayTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button title="Previous Song" onClick={onSkipPrev} disabled={!ready} className="text-muted-foreground hover:text-white transition-colors p-2">
          <Rewind size={24} />
        </button>

        <button title="Rewind 10s" onClick={skipBackward} disabled={!ready} className="text-muted-foreground hover:text-white transition-colors p-2">
          <Rewind size={18} />
        </button>

        <button
          title={playing ? 'Pause' : 'Play'}
          onClick={togglePlay}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 transition-transform"
          style={{ background: 'var(--accent-gradient)', boxShadow: '0 12px 30px rgba(124, 58, 237, 0.4), 0 4px 10px rgba(0,0,0,0.38)' }}
          disabled={!ready}
        >
          {playing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className='translate-x-px' />}
        </button>

        <button title="Forward 10s" onClick={skipForward} disabled={!ready} className="text-muted-foreground hover:text-white transition-colors p-2">
          <FastForward size={18} />
        </button>
        <button title="Next Song" onClick={onSkipNext} disabled={!ready} className="text-muted-foreground hover:text-white transition-colors p-2">
          <FastForward size={24} />
        </button>
      </div>

      {/* Volume Control (stack on small screens) */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:max-w-xs mt-2">
        <button title={muted ? 'Unmute' : 'Mute'} onClick={toggleMute} disabled={!ready} className="text-muted-foreground hover:text-white transition-colors p-1">
          {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={muted ? 0 : volume}
          onInput={handleVolumeChange}
          disabled={!ready}
          className="flex-1 h-2 sm:h-1 appearance-none bg-gray-700 rounded-full cursor-pointer"
          style={{
            '--accent-color': activeColor,
            '--rail-color': 'rgba(255,255,255,0.25)',
            '--progress': `${(muted ? 0 : volume)}%`,
            background: `linear-gradient(to right, var(--accent-color) 0%, var(--accent-color) var(--progress), var(--rail-color) var(--progress), var(--rail-color) 100%)`,
          }}
        />
      </div>

      <div ref={containerRef} style={{ display: 'none' }} />
    </div>
  );
};

export default AudioPlayer;