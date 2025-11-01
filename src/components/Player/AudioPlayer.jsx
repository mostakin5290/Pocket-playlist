import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, IconButton, Slider, Typography, Tooltip } from '@mui/material';
import { PlayArrow, Pause, SkipPrevious, SkipNext, VolumeUp, VolumeOff } from '@mui/icons-material';

const YT_API = 'https://www.youtube.com/iframe_api';

function loadYTApi() {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) return resolve(window.YT);
    const scriptId = 'yt-api';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = YT_API;
      script.async = true;
      document.body.appendChild(script);
    }
    const interval = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(interval);
        resolve(window.YT);
      }
    }, 100);
  });
}

export default function AudioPlayer({
  videoId = 'EmsRACUM4V4',
  title = 'YouTube Audio',
  thumbnail,
  onEnd,
}) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const tickRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(100);
  const [muted, setMuted] = useState(false);
  const [buffering, setBuffering] = useState(false);

  useEffect(() => {
    let mounted = true;
    loadYTApi().then((YT) => {
      if (!mounted) return;
      const id = `yt-audio-${Date.now()}`;
      const div = document.createElement('div');
      div.id = id;
      div.style.width = 0;
      div.style.height = 0;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(div);
      }
      playerRef.current = new YT.Player(id, {
        height: 0,
        width: 0,
        videoId,
        playerVars: { playsinline: 1, rel: 0, modestbranding: 1, controls: 0 },
        events: {
          onReady: (e) => {
            setReady(true);
            setTimeout(() => {
              setDuration(e.target.getDuration());
              setVolume(e.target.getVolume());
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
              if (typeof onEnd === "function") onEnd();
            } else if (ev.data === STATES.BUFFERING) {
              setBuffering(true);
            }
          },
        },
      });
    });
    return () => {
      mounted = false;
      if (tickRef.current) clearInterval(tickRef.current);
      if (playerRef.current && playerRef.current.destroy) playerRef.current.destroy();
    };
  }, [videoId, onEnd]);

  // Timer for progress
  useEffect(() => {
    if (!playing || !ready || !playerRef.current) return;
    tickRef.current = setInterval(() => {
      setCurrentTime(playerRef.current.getCurrentTime());
      setDuration(playerRef.current.getDuration());
    }, 500);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [playing, ready]);

  // Controls
  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    const state = p.getPlayerState();
    if (state === window.YT.PlayerState.PLAYING) {
      p.pauseVideo();
    } else {
      p.playVideo();
    }
  }, []);

  const seekTo = useCallback((time) => {
    const p = playerRef.current;
    if (!p || !ready) return;
    p.seekTo(Number(time), true);
    setCurrentTime(Number(time));
  }, [ready]);

  const skip = useCallback((offset) => {
    const next = Math.max(0, Math.min(currentTime + offset, duration));
    seekTo(next);
  }, [currentTime, duration, seekTo]);

  const handleVolume = useCallback((v) => {
    const p = playerRef.current;
    if (!p || !ready) return;
    p.setVolume(Number(v));
    setVolume(Number(v));
    setMuted(Number(v) === 0);
  }, [ready]);

  const toggleMute = useCallback(() => {
    const p = playerRef.current;
    if (!p || !ready) return;
    if (muted) {
      p.unMute();
      setMuted(false);
      setVolume(p.getVolume());
    } else {
      p.mute();
      setMuted(true);
    }
  }, [muted, ready]);

  const displayTime = (s = 0) => {
    const sec = Math.floor(s);
    const m = Math.floor(sec / 60);
    const r = sec % 60;
    return `${m}:${r.toString().padStart(2, '0')}`;
  };

  const thumb = thumbnail || `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;

  return (
    <Box
      sx={{
        bgcolor: '#191622',
        borderRadius: 4,
        boxShadow: 8,
        width: '100%',
        maxWidth: 530,
        mx: 'auto',
        mt: 5,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        minHeight: 180,
        position: 'relative',
      }}
    >
      <Box
        sx={{
          width: 120,
          height: 120,
          m: 2,
          borderRadius: '50%',
          boxShadow: `0 3px 30px #FF1EA899, 0 6px 12px #000b`,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#181818',
          position: 'relative',
        }}
      >
        <img
          src={thumb}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '50%',
            boxShadow: '0 2px 16px rgba(0,0,0,0.22)',
          }}
        />
        {!ready && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(20,20,20,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3,
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                border: '4px solid #FF1EA8',
                borderTopColor: 'transparent',
                animation: 'spin 0.95s linear infinite',
                '@keyframes spin': {
                  '100%': { transform: 'rotate(360deg)' }
                }
              }}
            />
          </Box>
        )}
      </Box>
      <Box flex={1} sx={{ pr: 2 }}>
        <Typography variant="h6" color="#fff" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="#FF1EA8" sx={{ mb: 1 }}>
          {buffering ? "Buffering..." : "YouTube"}
        </Typography>
        <Slider
          min={0}
          max={duration || 1}
          value={currentTime}
          onChange={(_, value) => seekTo(value)}
          disabled={!ready}
          sx={{
            color: '#FF1EA8',
            mt: 1,
            height: 3,
          }}
        />
        <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="caption" color="#FFD3EF">{displayTime(currentTime)}</Typography>
          <Typography variant="caption" color="#FFD3EF">{displayTime(duration)}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Back 10s">
            <span>
              <IconButton onClick={() => skip(-10)} size="small" disabled={!ready}>
                <SkipPrevious sx={{ color: '#FF1EA8', fontSize: 26 }} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={playing ? "Pause" : "Play"}>
            <span>
              <IconButton
                onClick={togglePlay}
                sx={{
                  bgcolor: '#FF1EA8',
                  color: '#fff',
                  width: 48,
                  height: 48,
                  boxShadow: '0 0 16px 3px #FF1EA888',
                  '&:hover': { bgcolor: '#FF56B6' },
                }}
                size="large"
                disabled={!ready}
              >
                {playing ? <Pause sx={{ fontSize: 32 }} /> : <PlayArrow sx={{ fontSize: 32 }} />}
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Forward 10s">
            <span>
              <IconButton onClick={() => skip(10)} size="small" disabled={!ready}>
                <SkipNext sx={{ color: '#FF1EA8', fontSize: 26 }} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Mute">
            <span>
              <IconButton onClick={toggleMute} sx={{ mx: 1 }} disabled={!ready}>
                {muted ? <VolumeOff sx={{ color: '#FF1EA8' }} /> : <VolumeUp sx={{ color: '#FF1EA8' }} />}
              </IconButton>
            </span>
          </Tooltip>
          <Slider
            min={0}
            max={100}
            value={muted ? 0 : volume}
            onChange={(_, v) => handleVolume(v)}
            sx={{ width: 100, ml: 1, color: '#FF1EA8' }}
            disabled={!ready}
          />
        </Box>
      </Box>
      <div ref={containerRef} style={{ display: 'none' }} />
    </Box>
  );
}
