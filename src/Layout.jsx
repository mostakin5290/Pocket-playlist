import React, { useEffect, useState } from 'react'
import YTPlayer from './components/Player/YTPlayer'
import AudioPlayer from './components/Player/AudioPlayer'
import { Button } from './components/ui/button'
import { RefreshCw, Plus } from 'lucide-react'
import SongList from './components/SongList'
import Header from './components/Layout/Header'

const Layout = () => {
    const [playlistUrl, setPlaylistUrl] = useState('')
    const [mode, setMode] = useState('video')
    const [playlist, setPlaylist] = useState(() => {

        const saved = localStorage.getItem('playlists')
        try {
            const parsed = saved ? JSON.parse(saved) : []
            return Array.isArray(parsed) ? parsed : []
        } catch {
            return []
        }
    })
    const [currentIndex, setCurrentIndex] = useState(0)
    const [origin, setOrigin] = useState(null)

    useEffect(() => {
        localStorage.setItem('playlists', JSON.stringify(playlist))
    }, [playlist])

    const current = playlist[currentIndex] || null
    const API_KEY = import.meta.env.VITE_YT_API || import.meta.env.vite_YT_API

    function parsePlaylistId(input) {
        try {
            const url = new URL(input)
            return url.searchParams.get('list') || input
        } catch (e) {
            return input
        }
    }

    function detectInputType(input) {
        const trimmed = (input || '').trim()
        if (!trimmed) return { type: 'unknown' }

        try {
            const url = new URL(trimmed)
            if (url.searchParams.get('list')) return { type: 'playlist', id: url.searchParams.get('list') }
            if (url.searchParams.get('v')) return { type: 'video', id: url.searchParams.get('v') }

            if (url.hostname.includes('youtu.be')) {
                const possible = url.pathname.replace(/^\//, '').split(/[/?#]/)[0]
                if (possible) return { type: 'video', id: possible }
            }

            const path = url.pathname || ''
            const shortsMatch = path.match(/\/shorts\/([_A-Za-z0-9-]+)/)
            if (shortsMatch) return { type: 'video', id: shortsMatch[1] }
            const embedMatch = path.match(/\/embed\/([_A-Za-z0-9-]+)/)
            if (embedMatch) return { type: 'video', id: embedMatch[1] }
        } catch (error) {
            console.log('Cannot detect the Input type', error)
        }

        if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return { type: 'video', id: trimmed }
        if (/^(PL|OL|UU|LL|FL)/.test(trimmed) || trimmed.length > 11) return { type: 'playlist', id: trimmed }

        return { type: 'unknown' }
    }

    const handelReset = () => {
        localStorage.removeItem('playlists')
        setPlaylist([])
        setCurrentIndex(0)
        setOrigin(null)
    }

    async function handleAdd() {
        const input = playlistUrl.trim()
        if (!input) return

        const detected = detectInputType(input)
        if (detected.type === 'playlist') {
            const id = detected.id
            try {
                const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${id}&key=${API_KEY}`
                const res = await fetch(url)
                if (!res.ok) throw new Error(await res.text())
                const data = await res.json()

                const items = (data.items || []).map(i => ({
                    id: i.snippet.resourceId?.videoId,
                    title: i.snippet.title,
                    thumbnail: i.snippet.thumbnails?.medium?.url || i.snippet.thumbnails?.default?.url,
                    channel: i.snippet.channelTitle,
                })).filter(Boolean)

                setPlaylist(items)
                setCurrentIndex(0)
                setOrigin('playlist')
            } catch (err) {
                alert('Failed to fetch playlist.')
            }
        } else if (detected.type === 'video') {
            const vid = detected.id
            try {
                const vurl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${vid}&key=${API_KEY}`
                const res = await fetch(vurl)
                if (!res.ok) throw new Error(await res.text())
                const data = await res.json()

                const itemRaw = (data.items || [])[0]

                const item = {
                    id: itemRaw.id,
                    title: itemRaw.snippet.title,
                    thumbnail: itemRaw.snippet.thumbnails?.medium?.url || itemRaw.snippet.thumbnails?.default?.url,
                    channel: itemRaw.snippet.channelTitle,
                }

                if (origin === 'playlist') {
                    setPlaylist(item)
                    setCurrentIndex(0)
                    setOrigin('songs')
                    return
                }
                if (origin === 'songs') {
                    setPlaylist(prev => {
                        const existing = prev.findIndex(p => p.id === item.id)
                        if (existing !== -1) {
                            setCurrentIndex(existing)
                            return prev
                        }

                        // const insertAt = Math.min(prev.length, currentIndex + 1)
                        // const next = [...prev.slice(0, insertAt), item, ...prev.slice(insertAt)]
                        // setCurrentIndex(insertAt)
                        const next = [...prev, item]
                        return next
                    })
                    return
                }
                const found = playlist.findIndex(p => p.id === item.id)
                if (found !== -1) {
                    setCurrentIndex(found)
                    setOrigin('songs')
                } else {
                    setPlaylist([item])
                    setCurrentIndex(0)
                    setOrigin('songs')
                }
            } catch (err) {
                alert('Failed to fetch video.')
            }
        } else {
            alert('Could not detect whether input is a playlist or a video. Paste a full YouTube playlist URL or a video URL/ID.')
        }
    }

    function handlePlayIndex(idx) {
        if (idx < 0 || idx >= playlist.length) return
        setCurrentIndex(idx)
    }

    function handleEnded() {
        setCurrentIndex(prev => {
            // const next = prev < playlist.length - 1 ? prev + 1 : prev
            const next = prev < playlist.length - 1 ? prev + 1 : 0
            try { console.debug('Playlist ended, advancing to', next) } catch (e) { }
            return next
        })
    }

    // Listen for header search selections (dispatched by Search component)
    useEffect(() => {
        function onSearchSelect(e) {
            const item = e?.detail
            if (!item || !item.id) return
            // If item already in playlist, play it. Otherwise add and play immediately.
            setPlaylist(prev => {
                const found = prev.findIndex(p => p.id === item.id)
                if (found !== -1) {
                    setCurrentIndex(found)
                    setOrigin('songs')
                    return prev
                }
                // insert after current index so it becomes the next item, but also play it now
                const insertAt = Math.min(prev.length, currentIndex + 1)
                const next = [...prev.slice(0, insertAt), item, ...prev.slice(insertAt)]
                setCurrentIndex(insertAt)
                setOrigin('songs')
                return next
            })
        }
        window.addEventListener('pp:search-select', onSearchSelect)
        return () => window.removeEventListener('pp:search-select', onSearchSelect)
    }, [currentIndex])

    return (
        <>
            <Header mode={mode} setMode={setMode} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
                    <div className='md:col-span-2 w-full flex gap-9 flex-col p-4 rounded-xl'>
                        {mode === 'audio' ? (
                            <AudioPlayer videoId={current?.id || 'EmsRACUM4V4'} onEnd={handleEnded} />
                        ) : (
                            <YTPlayer videoId={current?.id || 'EmsRACUM4V4'} onEnd={handleEnded} />
                        )}
                    </div>
                    <aside className="w-full">
                        <SongList
                            playlistUrl={playlistUrl}
                            setPlaylistUrl={setPlaylistUrl}
                            handelReset={handelReset}
                            handleAdd={handleAdd}
                            playlist={playlist}
                            currentIndex={currentIndex}
                            handlePlayIndex={handlePlayIndex}
                        />
                    </aside>
                </div>
            </div>
        </>
    )
}

export default Layout
