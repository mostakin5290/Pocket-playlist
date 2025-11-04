import React, { useEffect, useState, useCallback } from 'react'
import { nanoid } from 'nanoid' 
import YTPlayer from './components/Player/YTPlayer'
import AudioPlayer from './components/Player/AudioPlayer'
import SongList from './components/SongList'
import Header from './components/Layout/Header'

const DEFAULT_PLAYLIST_ID = 'default-playlist'

const Layout = () => {
    const [playlistUrl, setPlaylistUrl] = useState('')
    const [mode, setMode] = useState('video')

    const [playlists, setPlaylists] = useState(() => {
        const saved = localStorage.getItem('playlistsV2') 
        try {
            const parsed = saved ? JSON.parse(saved) : {}
            if (Object.keys(parsed).length === 0) {
                return { [DEFAULT_PLAYLIST_ID]: { id: DEFAULT_PLAYLIST_ID, name: 'My Pocket List', items: [] } }
            }
            return parsed
        } catch {
            return { [DEFAULT_PLAYLIST_ID]: { id: DEFAULT_PLAYLIST_ID, name: 'My Pocket List', items: [] } }
        }
    })
    const [activePlaylistId, setActivePlaylistId] = useState(() => {
        const savedId = localStorage.getItem('activePlaylistId')
        const initialPlaylists = JSON.parse(localStorage.getItem('playlistsV2') || '{}');
        const initialId = savedId && initialPlaylists[savedId] ? savedId : DEFAULT_PLAYLIST_ID;
        return initialId;
    })
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentVideoId, setCurrentVideoId] = useState(null) 
    const API_KEY = import.meta.env.VITE_YT_API || import.meta.env.vite_YT_API

    const activePlaylist = playlists[activePlaylistId] || playlists[DEFAULT_PLAYLIST_ID]
    const currentSong = activePlaylist?.items[currentIndex] || null
    const playerVideoId = currentVideoId || currentSong?.id || 'EmsRACUM4V4'

    useEffect(() => {
        localStorage.setItem('playlistsV2', JSON.stringify(playlists))
    }, [playlists])

    useEffect(() => {
        localStorage.setItem('activePlaylistId', activePlaylistId)
    }, [activePlaylistId])

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
            // console.log('Cannot detect the Input type', error)
        }

        if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return { type: 'video', id: trimmed }
        if (/^(PL|OL|UU|LL|FL)/.test(trimmed) || trimmed.length > 11) return { type: 'playlist', id: trimmed }

        return { type: 'unknown' }
    }


    const addSongsToPlaylist = useCallback((songs, playlistId = activePlaylistId, autoPlay = false) => {
        setPlaylists(prev => {
            const targetPlaylist = prev[playlistId]
            if (!targetPlaylist) return prev

            const newItems = songs.filter(newSong =>
                !targetPlaylist.items.some(existingSong => existingSong.id === newSong.id)
            )

            if (newItems.length === 0) {
                if (autoPlay && songs.length === 1) {
                    const existingIndex = targetPlaylist.items.findIndex(item => item.id === songs[0].id)
                    if (existingIndex !== -1) {
                        setCurrentIndex(existingIndex)
                        setCurrentVideoId(null)
                    }
                }
                return prev
            }

            const updatedItems = [...targetPlaylist.items, ...newItems]
            const newPlaylists = { ...prev, [playlistId]: { ...targetPlaylist, items: updatedItems } }

            if (autoPlay) {
                const firstNewIndex = updatedItems.findIndex(item => item.id === newItems[0].id)
                setCurrentIndex(firstNewIndex)
                setCurrentVideoId(null)
            }
            
            return newPlaylists
        })
    }, [activePlaylistId])

    const fetchAndAddVideo = useCallback(async (vid, playlistId, autoPlay = false) => {
        try {
            const vurl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${vid}&key=${API_KEY}`
            const res = await fetch(vurl)
            if (!res.ok) throw new Error(await res.text())
            const data = await res.json()

            const itemRaw = (data.items || [])[0]
            if (!itemRaw) throw new Error('Video not found or is restricted.')

            const item = {
                id: itemRaw.id,
                title: itemRaw.snippet.title,
                thumbnail: itemRaw.snippet.thumbnails?.medium?.url || itemRaw.snippet.thumbnails?.default?.url,
                channel: itemRaw.snippet.channelTitle,
            }
            
            addSongsToPlaylist([item], playlistId, autoPlay)
            return item
        } catch (err) {
            console.error('Failed to fetch video:', err)
            alert('Failed to fetch video.')
            return null
        }
    }, [API_KEY, addSongsToPlaylist])

    const fetchAndLoadPlaylist = useCallback(async (id) => {
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
            })).filter(item => item.id)

            if (items.length === 0) throw new Error('Playlist is empty or all videos are restricted.')

            setPlaylists(prev => ({
                ...prev,
                [activePlaylistId]: { ...prev[activePlaylistId], items }
            }))
            setCurrentIndex(0)
            setCurrentVideoId(null)
            alert(`Loaded ${items.length} songs into '${activePlaylist?.name || 'playlist'}'`)
        } catch (err) {
            console.error('Failed to fetch playlist:', err)
            alert('Failed to fetch playlist.')
        }
    }, [API_KEY, activePlaylistId, activePlaylist])

    const handleAdd = async () => {
        const input = playlistUrl.trim()
        if (!input) return

        const detected = detectInputType(input)
        if (detected.type === 'playlist') {
            await fetchAndLoadPlaylist(detected.id)
        } else if (detected.type === 'video') {
            await fetchAndAddVideo(detected.id, activePlaylistId, false) // false for no autoPlay
        } else {
            alert('Could not detect whether input is a playlist or a video. Paste a full YouTube playlist URL or a video URL/ID.')
        }
        setPlaylistUrl('')
    }

    const handelReset = () => {
        if (!window.confirm('Are you sure you want to reset all data (playlists and settings)? This action cannot be undone.')) return
        localStorage.removeItem('playlistsV2')
        localStorage.removeItem('activePlaylistId')
        setPlaylists({ [DEFAULT_PLAYLIST_ID]: { id: DEFAULT_PLAYLIST_ID, name: 'My Pocket List', items: [] } })
        setActivePlaylistId(DEFAULT_PLAYLIST_ID)
        setCurrentIndex(0)
        setCurrentVideoId(null)
    }

    const handlePlayIndex = (idx) => {
        if (!activePlaylist || idx < 0 || idx >= activePlaylist.items.length) return
        setCurrentIndex(idx)
        setCurrentVideoId(null)
    }
    

    const handleEnded = useCallback(() => {
        const currentItems = activePlaylist?.items || []
        if (currentItems.length > 0) {
            setCurrentIndex(prev => (prev < currentItems.length - 1 ? prev + 1 : 0))
            setCurrentVideoId(null)
        } else {
            setCurrentVideoId('EmsRACUM4V4') 
        }
    }, [activePlaylist])

    const handleSkipNext = useCallback(() => {
        const currentItems = activePlaylist?.items || []
        if (currentItems.length > 0) {
            setCurrentIndex(prev => (prev < currentItems.length - 1 ? prev + 1 : 0))
            setCurrentVideoId(null)
        }
    }, [activePlaylist])

    const handleSkipPrev = useCallback(() => {
        const currentItems = activePlaylist?.items || []
        if (currentItems.length > 0) {
            setCurrentIndex(prev => (prev > 0 ? prev - 1 : currentItems.length - 1))
            setCurrentVideoId(null)
        }
    }, [activePlaylist])


    useEffect(() => {
        function onSearchAdd(e) {
            const item = e?.detail
            if (!item || !item.id) return
            addSongsToPlaylist([item], activePlaylistId, false)
        }

        function onSearchPlay(e) {
            const item = e?.detail
            if (!item || !item.id) return

            setCurrentVideoId(item.id)
            
            const activeItems = activePlaylist?.items || []
            const existingIndex = activeItems.findIndex(p => p.id === item.id)
            if (existingIndex !== -1) {
                setCurrentIndex(existingIndex)
            } else {
                 addSongsToPlaylist([item], activePlaylistId, false)
            }
        }

        window.addEventListener('pp:search-add', onSearchAdd)
        window.addEventListener('pp:search-play', onSearchPlay)

        return () => {
            window.removeEventListener('pp:search-add', onSearchAdd)
            window.removeEventListener('pp:search-play', onSearchPlay)
        }
    }, [activePlaylistId, activePlaylist, addSongsToPlaylist])



    const handleRemoveSong = useCallback((idToRemove) => {
        setPlaylists(prev => {
            const targetPlaylist = prev[activePlaylistId]
            if (!targetPlaylist) return prev

            const indexToRemove = targetPlaylist.items.findIndex(item => item.id === idToRemove)
            if (indexToRemove === -1) return prev

            const newItems = targetPlaylist.items.filter(item => item.id !== idToRemove)
            const newPlaylists = { ...prev, [activePlaylistId]: { ...targetPlaylist, items: newItems } }

            // Adjust currentIndex if necessary
            let newIndex = currentIndex
            if (indexToRemove < currentIndex) {
                newIndex = Math.max(0, currentIndex - 1)
            } else if (indexToRemove === currentIndex) {
                newIndex = Math.min(currentIndex, newItems.length > 0 ? newItems.length - 1 : 0)
            }
            setCurrentIndex(newIndex)
            setCurrentVideoId(null)
            return newPlaylists
        })
    }, [activePlaylistId, currentIndex])

    const handleCreatePlaylist = useCallback((name) => {
        const newId = nanoid()
        setPlaylists(prev => ({
            ...prev,
            [newId]: { id: newId, name, items: [] }
        }))
        setActivePlaylistId(newId)
        setCurrentIndex(0)
        setCurrentVideoId(null)
    }, [])

    // **FIXED DELETE FUNCTION**
    const handleDeletePlaylist = useCallback((idToDelete) => {
        if (idToDelete === DEFAULT_PLAYLIST_ID) {
            alert("The default playlist cannot be deleted.")
            return
        }
        
        if (!window.confirm(`Are you sure you want to delete playlist "${playlists[idToDelete]?.name}"? This action cannot be undone.`)) return

        setPlaylists(prev => {
            const newPlaylists = { ...prev };
            delete newPlaylists[idToDelete];

            let newActiveId = activePlaylistId;
            if (activePlaylistId === idToDelete) {
                newActiveId = DEFAULT_PLAYLIST_ID;
                setActivePlaylistId(DEFAULT_PLAYLIST_ID); 
                setCurrentIndex(0);
                setCurrentVideoId(null);
            }
            
            return newPlaylists;
        });
    }, [activePlaylistId, playlists])


    const handleSwitchPlaylist = useCallback((id) => {
        setActivePlaylistId(id)
        setCurrentIndex(0)
        setCurrentVideoId(null)
    }, [])
    
    const playerTitle = currentVideoId ? 'Direct Play' : currentSong?.title || 'Pocket Playlist'
    const playerThumbnail = currentVideoId ? (currentSong?.thumbnail || `https://i.ytimg.com/vi/${currentVideoId}/mqdefault.jpg`) : currentSong?.thumbnail


    return (
        <>
            <Header mode={mode} setMode={setMode} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
                    <div className='md:col-span-2 w-full flex gap-9 flex-col p-4 rounded-xl'>
                        {mode === 'audio' ? (
                            <AudioPlayer
                                videoId={playerVideoId}
                                videoTitle={playerTitle}
                                videoThumbnail={playerThumbnail}
                                onEnd={handleEnded}
                                onSkipNext={handleSkipNext}
                                onSkipPrev={handleSkipPrev}
                            />
                        ) : (
                            <YTPlayer
                                videoId={playerVideoId}
                                title={playerTitle}
                                onEnd={handleEnded}
                            />
                        )}
                    </div>
                    <aside className="w-full">
                        <SongList
                            playlistUrl={playlistUrl}
                            setPlaylistUrl={setPlaylistUrl}
                            handelReset={handelReset}
                            handleAdd={handleAdd}
                            // New Playlist Props
                            playlists={playlists}
                            activePlaylistId={activePlaylistId}
                            handleSwitchPlaylist={handleSwitchPlaylist}
                            handleCreatePlaylist={handleCreatePlaylist}
                            handleDeletePlaylist={handleDeletePlaylist}
                            // Current Active Playlist Songs
                            playlist={activePlaylist?.items || []}
                            currentIndex={currentIndex}
                            handlePlayIndex={handlePlayIndex}
                            handleRemoveSong={handleRemoveSong}
                            playerVideoId={playerVideoId}
                        />
                    </aside>
                </div>
            </div>
        </>
    )
}

export default Layout