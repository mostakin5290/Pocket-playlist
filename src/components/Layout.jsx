import React, { useEffect, useState } from 'react'
import YTPlayer from './Player/YTPlayer'

const Layout = () => {
    const [playlistUrl, setPlaylistUrl] = useState('')
    const [playlist, setPlaylist] = useState(() => {

        const saved =  localStorage.getItem('playlists')
        try {
            const parsed = saved ? JSON.parse(saved) : []
            return Array.isArray(parsed) ? parsed : []
        } catch {
            return []
        }
    })
    const [currentIndex, setCurrentIndex] = useState(0)

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

    const handelReset = () => {

        localStorage.removeItem('playlists')
        setPlaylist([])
    }

    async function addPlaylist() {
        const id = parsePlaylistId(playlistUrl.trim())
        if (!id) return

        if (!API_KEY) {
            alert('Set VITE_YT_API in your .env with your YouTube API key')
            return
        }

        try {
            const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${id}&key=${API_KEY}`
            const res = await fetch(url)
            if (!res.ok) throw new Error(await res.text())
            const data = await res.json()

            if (data.error) {
                console.error('YouTube API Error:', data.error)
                alert('YouTube API returned an error. Check console for details.')
                return
            }

            const items = (data.items || []).map(i => ({
                id: i.snippet.resourceId?.videoId,
                title: i.snippet.title,
                thumbnail: i.snippet.thumbnails?.medium?.url || i.snippet.thumbnails?.default?.url,
                channel: i.snippet.channelTitle,
            })).filter(Boolean)

            if (items.length === 0) {
                alert('No videos found in that playlist or playlist is private.')
                return
            }
            
            setPlaylist(items)
            setCurrentIndex(0)
        } catch (err) {
            console.error('Playlist fetch error', err)
            alert('Failed to fetch playlist. Check console for details.')
        }
    }

    function handlePlayIndex(idx) {
        if (idx < 0 || idx >= playlist.length) return
        setCurrentIndex(idx)
    }

    function handleEnded() {
        setCurrentIndex(prev => {
            const next = prev < playlist.length - 1 ? prev + 1 : prev
            try { console.debug('Playlist ended, advancing to', next) } catch (e) { }
            return next
        })
    }

    function handleNext() { setCurrentIndex(prev => Math.min(prev + 1, playlist.length - 1)) }
    function handlePrev() { setCurrentIndex(prev => Math.max(prev - 1, 0)) }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
                <div className='md:col-span-2 w-full p-4 rounded-xl'>


                    <YTPlayer videoId={current?.id || 'EmsRACUM4V4'} autoplay={playlist.length > 0} muted={false} nextVideoId={playlist[currentIndex + 1]?.id || null} onEnd={handleEnded} />
                </div>

                <aside className="w-full">
                    <div className='h-auto md:h-[70vh] w-full border rounded-3xl p-4 bg-card'>
                        <div className="h-full overflow-auto">
                            <div className='flex flex-row justify-between'>
                                <h3 className="text-lg font-semibold mb-2">Add Playlist</h3>
                                <button onClick={handelReset} className='cursor-pointer'> Reset </button>
                            </div>
                            <div className='flex gap-2 mb-4'>
                                <input
                                    value={playlistUrl}
                                    onChange={(e) => setPlaylistUrl(e.target.value)}
                                    placeholder='YouTube playlist URL or ID'
                                    className='flex-1 px-3 py-2 bg-background border border-border rounded-b-2xl outline-none'
                                />
                                <button onClick={addPlaylist} className='px-4 py-2 bg-primary text-primary-foreground rounded-b-2xl'>Add</button>
                            </div>

                            <h3 className="text-lg font-semibold mb-2">Up Next</h3>
                            {playlist.length === 0 && (
                                <p className="text-sm text-muted-foreground">No playlist loaded. Add a YouTube playlist to populate Up Next.</p>
                            )}

                            <div className='mt-2 space-y-2'>
                                {playlist.map((item, idx) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handlePlayIndex(idx)}
                                        className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-shadow ${idx === currentIndex ? 'bg-accent/10 shadow-md' : 'hover:shadow-sm'}`}>
                                        <img src={item.thumbnail} alt={item.title} className='w-20 h-12 object-cover rounded' />
                                        <div className='flex-1'>
                                            <div className='text-sm font-medium'>{item.title}</div>
                                            <div className='text-xs text-muted-foreground'>{item.channel}</div>
                                        </div>
                                        <div className='text-xs text-muted-foreground'>{idx === currentIndex ? 'Playing' : `#${idx + 1}`}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default Layout
