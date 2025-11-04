import React, { useEffect, useRef, useState } from 'react'
import { BorderBeam } from "../ui/border-beam"

const YTPlayer = ({ videoId = 'EmsRACUM4V4', onEnd = null, title = 'YouTube player' }) => {
    const containerRef = useRef(null)
    const playerRef = useRef(null)
    const readyRef = useRef(false)
    const [ready, setReady] = useState(false)
    const onEndRef = useRef(onEnd)

    function ensureYT() {
        return new Promise((resolve) => {
            if (window.YT && window.YT.Player) return resolve(window.YT)
            if (!document.getElementById('yt-api')) {
                const s = document.createElement('script')
                s.id = 'yt-api'
                s.src = 'https://www.youtube.com/iframe_api'
                s.async = true
                document.body.appendChild(s)
            }

            const t = setInterval(() => {
                if (window.YT && window.YT.Player) {
                    clearInterval(t)
                    resolve(window.YT)
                }
            }, 100)
        })
    }

    useEffect(() => {
        onEndRef.current = onEnd

        let mounted = true
        ensureYT().then((YT) => {
            if (!mounted) return
            const id = `yt-player-${Date.now()}`
            const div = document.createElement('div')
            div.id = id
            if (containerRef.current) {
                containerRef.current.innerHTML = ''
                containerRef.current.appendChild(div)
            }

            playerRef.current = new YT.Player(id, {
                height: '100%',
                width: '100%',
                videoId,
                // Make sure to use '1' for playsinline and '0' for rel (no related videos)
                playerVars: { playsinline: 1, rel: 0, modestbranding: 1, controls: 1, disablekb: 1 },
                events: {
                    onReady: (ev) => {
                        readyRef.current = true
                        setReady(true)
                        try { ev.target.loadVideoById(videoId); ev.target.playVideo && ev.target.playVideo() } catch (e) { }
                    },
                    onStateChange: (ev) => {
                        const ENDED = window.YT && window.YT.PlayerState ? window.YT.PlayerState.ENDED : 0
                        if (ev.data === ENDED) {
                            const fn = onEndRef.current
                            if (typeof fn === 'function') fn()
                        }
                    }
                }
            })
        })

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
            try { p.loadVideoById(videoId); p.playVideo && p.playVideo() } catch (e) { }
        } catch (e) { console.warn('YTPlayer update error', e) }
    }, [videoId])

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
            {/* Border beams for UI flair */}
            <BorderBeam
                duration={6}
                size={400}
                className="from-transparent via-red-500 to-transparent"
            />
            <BorderBeam
                duration={6}
                delay={3}
                size={400}
                borderWidth={2}
                className="from-transparent via-blue-500 to-transparent"
            />
        </div>
    )
}

export default YTPlayer