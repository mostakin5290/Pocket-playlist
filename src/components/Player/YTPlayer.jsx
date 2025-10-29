import React, { useEffect, useRef, useState } from 'react'

const YTPlayer = ({ videoId = 'EmsRACUM4V4', autoplay = false, muted = false, onEnd, title = 'YouTube player' }) => {
    const containerRef = useRef(null)
    const playerRef = useRef(null)
    const [ready, setReady] = useState(false)

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

    const readyRef = useRef(false)
    const pendingVideoRef = useRef(null)

    useEffect(() => {
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
                playerVars: { autoplay: autoplay ? 1 : 0, playsinline: 1 },
                events: {
                    onReady: (ev) => {
                        readyRef.current = true
                        setReady(true)
                        try {
                            if (muted && ev.target.mute) { try { ev.target.mute() } catch (e) { } }
                            if (pendingVideoRef.current) {
                                const vid = pendingVideoRef.current
                                pendingVideoRef.current = null
                                ev.target.loadVideoById(vid)
                                if (autoplay) try { ev.target.playVideo() } catch (e) { }
                            }
                        } catch (e) { }
                    },
                    onStateChange: (ev) => {
                        try { console.debug('YT player state', ev.data) } catch (e) { }
                        if (ev.data === (window.YT && window.YT.PlayerState ? window.YT.PlayerState.ENDED : 0) && typeof onEnd === 'function') onEnd()
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
            if (!p || !readyRef.current) {
                pendingVideoRef.current = videoId
                return
            }

            if (autoplay) {
                try { if (muted && p.mute) { p.mute() } } catch (e) { }
                try { p.loadVideoById(videoId); p.playVideo && p.playVideo() } catch (e) { }
            } else {
                try { p.cueVideoById(videoId) } catch (e) { }
                try { if (muted && p.mute) { p.mute() } } catch (e) { }
            }
        } catch (e) { console.warn('YTPlayer update error', e) }
    }, [videoId, autoplay, muted])


    return (
        <div className="w-full">
            <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ paddingTop: '56.25%' }}>
                <div ref={containerRef} className="absolute inset-0" aria-label={title}></div>
                {!ready && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <div className="w-10 h-10 rounded-full border-4 border-t-transparent border-white animate-spin" />
                    </div>
                )}
            </div>
        </div>
    )
}

export default YTPlayer
