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
  const [videoTitleText, setVideoTitleText] = useState('YouTube');

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
              try {
                const info = e.target.getVideoData && e.target.getVideoData();
                if (info && info.title) setVideoTitleText(info.title);
              } catch (err) {
                // ignore
              }
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

  const seekTo = useCallback(
    (time) => {
      const p = playerRef.current;
      if (!p || !ready) return;
      p.seekTo(Number(time), true);
      setCurrentTime(Number(time));
    },
    [ready]
  );

  const skip = useCallback(
    (offset) => {
      const next = Math.max(0, Math.min(currentTime + offset, duration));
      seekTo(next);
    },
    [currentTime, duration, seekTo]
  );

  const handleVolume = useCallback(
    (v) => {
      const p = playerRef.current;
      if (!p || !ready) return;
      p.setVolume(Number(v));
      setVolume(Number(v));
      setMuted(Number(v) === 0);
    },
    [ready]
  );

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
        bgcolor: 'var(--card)',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.02)',
        width: '100%',
        maxWidth: { xs: 420, md: 920 },
        mx: 'auto',
        mt: { xs: 0, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        minHeight: { xs: 'auto', md: 260 },
        position: 'relative',
        px: { xs: 3, md: 4 },
        pt: { xs: 6, md: 3 },
        pb: { xs: 6, md: 3 },
        transition: 'transform 180ms ease, box-shadow 200ms ease',
      }}
    >
      <Box
        sx={{
          width: { xs: '76vw', md: '50vw' },
          height: { xs: '76vw', md: 260 },
          maxWidth: { xs: 420, md: 900 },
          maxHeight: { xs: 420, md: 340 },
          m: '0 auto',
          borderRadius: '24px',
          padding: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(216,27,96,0.06), rgba(142,36,170,0.04))',
          position: 'relative',
          boxShadow: `0 10px 28px rgba(142,36,170,0.10), inset 0 2px 8px rgba(0,0,0,0.5)`,
        }}
      >
        <div style={{ width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden', background: '#0f0f12' }}>
          <img src={thumb} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {!ready && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(10,10,12,0.68)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3,
              borderRadius: { xs: '24px', md: '12px' },
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: `3px solid var(--accent-from)`,
                borderTopColor: 'transparent',
                animation: 'spin 0.95s linear infinite',
                '@keyframes spin': {
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            />
          </Box>
        )}
      </Box>

      <Box flex={1} sx={{ pr: 0, width: '100%' }}>
        <Box sx={{ textAlign: 'center', mt: 2, width: '100%' }}>
          <Typography variant="h6" color="#fff" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="var(--accent-from)" sx={{ mb: 1 }}>
            {buffering ? 'Buffering...' : videoTitleText}
          </Typography>
        </Box>

        <Slider
          min={0}
          max={duration || 1}
          value={currentTime}
          onChange={(_, value) => seekTo(value)}
          disabled={!ready}
          sx={{
            color: 'var(--accent-from)',
            mt: { xs: 2, md: 0 },
            height: { xs: 6, md: 4 },
            '& .MuiSlider-thumb': { width: { xs: 16, md: 10 }, height: { xs: 16, md: 10 } },
            '& .MuiSlider-rail': { opacity: 0.25 },
          }}
        />

        <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="caption" color="#FFD3EF">
            {displayTime(currentTime)}
          </Typography>
          <Typography variant="caption" color="#FFD3EF">
            {displayTime(duration)}
          </Typography>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{
            justifyContent: 'center',
            width: '100%',
            position: 'relative',
            mt: { xs: 2, md: -6 },
            zIndex: 2,
            px: { xs: 0, md: 2 },
            py: { xs: 0, md: 1 },
            bgcolor: { md: 'rgba(255,255,255,0.02)' },
            borderRadius: { md: '999px' },
            boxShadow: { md: '0 8px 24px rgba(0,0,0,0.45)' },
            alignSelf: 'center',
          }}
        >
          <Tooltip title="Back 10s">
            <span>
              <IconButton onClick={() => skip(-10)} size="small" disabled={!ready}>
                <SkipPrevious sx={{ color: 'var(--accent-from)', fontSize: 26 }} />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={playing ? 'Pause' : 'Play'}>
            <span>
              <IconButton
                onClick={togglePlay}
                sx={{
                  bgcolor: 'var(--accent-from)',
                  color: '#fff',
                  width: { xs: 72, md: 48 },
                  height: { xs: 72, md: 48 },
                  borderRadius: '999px',
                  boxShadow: '0 8px 22px rgba(142,36,170,0.18), 0 4px 10px rgba(0,0,0,0.28)',
                  '&:hover': { bgcolor: 'var(--accent-to)', transform: 'scale(1.03)' },
                  transition: 'transform 160ms ease, background 160ms ease',
                }}
                size="large"
                disabled={!ready}
              >
                {playing ? <Pause sx={{ fontSize: { xs: 32, md: 22 } }} /> : <PlayArrow sx={{ fontSize: { xs: 32, md: 22 } }} />}
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Forward 10s">
            <span>
              <IconButton onClick={() => skip(10)} size="small" disabled={!ready}>
                <SkipNext sx={{ color: 'var(--accent-from)', fontSize: 26 }} />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Mute">
            <span>
              <IconButton onClick={toggleMute} sx={{ mx: 1 }} disabled={!ready}>
                {muted ? <VolumeOff sx={{ color: 'var(--accent-from)' }} /> : <VolumeUp sx={{ color: 'var(--accent-from)' }} />}
              </IconButton>
            </span>
          </Tooltip>

          <Slider
            min={0}
            max={100}
            value={muted ? 0 : volume}
            onChange={(_, v) => handleVolume(v)}
            sx={{
              width: { xs: '48%', md: 120 },
              ml: 1,
              color: 'var(--accent-from)',
              '& .MuiSlider-thumb': { width: { xs: 12, md: 10 }, height: { xs: 12, md: 10 } },
            }}
            disabled={!ready}
          />
        </Box>
      </Box>

      <div ref={containerRef} style={{ display: 'none' }} />
    </Box>
  );
}
