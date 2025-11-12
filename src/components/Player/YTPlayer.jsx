import React, { useEffect, useRef, useState } from 'react'
import { createPlayer } from '../../lib/ytManager'

const YTPlayer = ({ videoId = 'EmsRACUM4V4', onEnd = null, title = 'YouTube player' }) => {
    const containerRef = useRef(null)
    const playerRef = useRef(null)
    const readyRef = useRef(false)
    const [ready, setReady] = useState(false)
    const onEndRef = useRef(onEnd)

    useEffect(() => {
        onEndRef.current = onEnd

        let mounted = true
        const id = `yt-player-${Date.now()}`
        const div = document.createElement('div')
        div.id = id
        if (containerRef.current) {
            containerRef.current.innerHTML = ''
            containerRef.current.appendChild(div)
        }

        createPlayer(id, {
            height: '100%',
            width: '100%',
            videoId,
            playerVars: { playsinline: 1, rel: 0, modestbranding: 1, controls: 1, disablekb: 1 },
            events: {
                onReady: (ev) => {
                    if (!mounted) return
                    readyRef.current = true
                    setReady(true)
                    try { ev.target.loadVideoById(videoId); ev.target.playVideo && ev.target.playVideo() } catch { /* ignore */ }
                },
                onStateChange: (ev) => {
                    const ENDED = window.YT && window.YT.PlayerState ? window.YT.PlayerState.ENDED : 0
                    if (ev.data === ENDED) {
                        const fn = onEndRef.current
                        if (typeof fn === 'function') fn()
                    }
                }
            }
        }).then(player => {
            if (!mounted) { try { player.destroy() } catch { /* ignore */ }; return }
            playerRef.current = player
        }).catch(e => console.warn('YTPlayer create error', e))

        return () => {
            mounted = false
            if (playerRef.current && playerRef.current.destroy) playerRef.current.destroy()
        }
    }, [])

    useEffect(() => {
        const p = playerRef.current
        try {
            if (!p || !readyRef.current) return
            // Load and play the new videoId
            try { p.loadVideoById(videoId); p.playVideo && p.playVideo() } catch { /* ignore */ }
        } catch (e) { console.warn('YTPlayer update error', e) }
    }, [videoId])

    // Listen for the user gesture event so we can start playback when user taps the overlay
    useEffect(() => {
        const onGesture = () => {
            try { if (playerRef.current && playerRef.current.playVideo) playerRef.current.playVideo(); } catch { }
        }
        window.addEventListener('pp:user-gesture', onGesture)
        return () => window.removeEventListener('pp:user-gesture', onGesture)
    }, [])

    return (
        <div className="relative w-full mt-10 rounded-2xl">
            {/* The wrapper handles the 16:9 aspect ratio for responsiveness */}
            <div className="relative w-full rounded-2xl overflow-hidden bg-black" style={{ paddingTop: '56.25%' }}>
                <div ref={containerRef} className="absolute inset-0" aria-label={title}></div>
                {!ready && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <div className="w-10 h-10 rounded-full border-4 border-t-transparent border-white animate-spin" />
                    </div>
                )}
            </div>
            {/* Simplified: no decorative beams to keep player focused and lightweight */}
        </div>
    )
}

export default YTPlayer