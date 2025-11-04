import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Plus, Play, Search as SearchIcon } from 'lucide-react'
import { Button } from './ui/button'

const Search = ({ compact = false }) => {
    const [q, setQ] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const API_KEY = import.meta.env.VITE_YT_API

    async function searchYouTube(searchTerm) {
        if (!searchTerm) return
        setLoading(true)
        setError(null)
        setResults([])
        try {
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(searchTerm)}&key=${API_KEY}`
            const res = await fetch(url)
            if (!res.ok) throw new Error(await res.text())
            const data = await res.json()

            // Map search results to the video item structure
            const items = (data.items || []).map(i => ({
                id: i.id.videoId,
                title: i.snippet.title,
                thumbnail: i.snippet.thumbnails?.medium?.url || i.snippet.thumbnails?.default?.url,
                channel: i.snippet.channelTitle,
                // NOTE: Duration is not in 'snippet' part. A separate API call is needed to fetch it.
                // For simplicity and reducing API calls, 'duration' is omitted in this version.
            })).filter(item => item.id)

            setResults(items)
        } catch (err) {
            console.error('Search failed:', err);
            setError(err?.message || 'Search failed')
        } finally {
            setLoading(false)
        }
    }

    // Handlers for play/add actions dispatching global events
    const handleAction = useCallback((item, actionType) => {
        try {
            window.dispatchEvent(new CustomEvent(`pp:search-${actionType}`, { detail: item }))
        } catch (e) { /* ignore */ }
        // For smoother UX, hide results only on Play action, keep visible on Add
        if (actionType === 'play') setShowResults(false)
    }, [])

    const handlePlay = useCallback((item) => handleAction(item, 'play'), [handleAction])
    const handleAdd = useCallback((item) => handleAction(item, 'add'), [handleAction])

    // --- UI/UX State and Handlers ---
    
    const [showResults, setShowResults] = useState(false)
    const containerRef = useRef(null)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const itemRefs = useRef([])

    useEffect(() => {
        // Only show results if search has been performed and there are results
        setShowResults(results && results.length > 0)
    }, [results])

    // Close on outside click or escape
    useEffect(() => {
        function onDocClick(e) {
            if (!containerRef.current) return
            if (!containerRef.current.contains(e.target)) {
                setShowResults(false)
            }
        }
        function onKey(e) {
            if (e.key === 'Escape') setShowResults(false)
        }
        document.addEventListener('click', onDocClick)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('click', onDocClick)
            document.removeEventListener('keydown', onKey)
        }
    }, [])

    useEffect(() => {
        if (!showResults) setSelectedIndex(-1)
    }, [showResults])

    useEffect(() => {
        // Keep the selected item in view
        const ref = itemRefs.current[selectedIndex]
        if (ref && ref.scrollIntoView) {
            ref.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
        }
    }, [selectedIndex])

    function onSubmit(e) {
        e.preventDefault()
        searchYouTube(q.trim())
    }

    function onInputKey(e) {
        if (!showResults) return
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIndex(i => Math.min((results?.length || 0) - 1, i + 1))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIndex(i => Math.max(0, i - 1))
        } else if (e.key === 'Enter') {
            if (selectedIndex >= 0 && results[selectedIndex]) {
                // Default Enter action: Play
                handlePlay(results[selectedIndex])
            } else if (q.trim()) {
                // If no selection, perform search on enter if there's text
                onSubmit(e)
            }
        }
    }
    
    return (
        <div ref={containerRef} className={`w-full ${compact ? 'flex items-center' : 'flex flex-col items-center'} relative`}>
            <form onSubmit={onSubmit} className={`w-full flex items-center ${compact ? '' : 'justify-center'}`}>
                <div className={`flex items-center ${compact ? 'px-2 py-1' : 'px-3 py-2'} border border-border w-full ${compact ? 'max-w-full' : 'max-w-2xl'} rounded-full overflow-hidden bg-[#191622] shadow-md`}
                >
                    <input
                        value={q}
                        onChange={(e) => {
                            setQ(e.target.value)
                            if(e.target.value.length > 2) searchYouTube(e.target.value) // Live search after 3 chars
                        }}
                        onFocus={() => setShowResults(true)}
                        type="search"
                        placeholder='Search YouTube videos...'
                        onKeyDown={onInputKey}
                        className={`flex-1 ${compact ? 'h-8 text-sm' : 'h-10'} bg-transparent text-foreground placeholder:text-muted-foreground outline-none px-3`}
                    />
                    <Button type='submit' size={compact ? 'icon-sm' : 'icon'} className={`shrink-0 text-white shadow-sm rounded-full`} style={{ background: 'var(--accent-gradient)' }}>
                        <SearchIcon size={compact ? 16 : 20} />
                    </Button>
                </div>
            </form>

            {loading && <p className='text-sm text-muted-foreground mt-2'>Searching...</p>}
            {error && <p className='text-sm text-destructive mt-2'>{error}</p>}

            {showResults && (
                <div
                    role="listbox"
                    aria-label="Search results"
                    className={`absolute top-full ${compact ? 'left-0 mt-2 w-full max-w-full' : 'left-1/2 transform -translate-x-1/2 mt-3 w-full max-w-3xl'} p-3 grid grid-cols-1 gap-2 rounded-3xl z-50 max-h-[60vh] overflow-y-auto custom-scrollbar fade-up`}
                    style={{
                        background: 'rgba(10,10,12,0.92)', // Slightly less transparent for better readability
                        border: '1px solid rgba(255,255,255,0.04)',
                        boxShadow: '0 30px 80px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.02)',
                        backdropFilter: 'blur(24px) saturate(150%)',
                        WebkitBackdropFilter: 'blur(24px) saturate(150%)',
                        borderRadius: '20px'
                    }}
                >
                    {results.map((item, idx) => (
                        <div
                            key={item.id}
                            role="option"
                            aria-selected={selectedIndex === idx}
                            ref={(el) => (itemRefs.current[idx] = el)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`flex items-center gap-4 p-3 rounded-2xl smooth-transition border border-transparent ${selectedIndex === idx ? 'border-primary/20' : 'hover:bg-card/20'}`}
                            style={selectedIndex === idx ? { background: 'rgba(255,255,255,0.03)', boxShadow: `0 8px 30px rgba(124, 58, 237, 0.12)`, borderLeft: `6px solid var(--accent-from)` } : {}}
                        >
                            <div className='w-28 h-16 rounded-xl overflow-hidden shrink-0' style={{ boxShadow: 'inset 0 -12px 24px rgba(0,0,0,0.4)' }}>
                                <img src={item.thumbnail} alt={item.title} className='w-full h-full object-cover' />
                            </div>
                            <div className='flex-1 min-w-0'>
                                <div className='text-sm font-semibold text-foreground truncate'>{item.title}</div>
                                <div className='text-xs text-muted-foreground mt-1 truncate'>{item.channel}</div>
                            </div>
                            <div className='ml-4 flex items-center gap-2 shrink-0'>
                                {/* Play Button: Instantly plays, does NOT add to playlist queue */}
                                <Button
                                    onClick={(e) => { e.preventDefault(); handlePlay(item); }}
                                    aria-label={`Play ${item.title}`}
                                    title={`Play ${item.title} Instantly`}
                                    size="icon-sm"
                                    className='text-white'
                                    style={{ background: 'var(--accent-gradient)' }}
                                >
                                    <Play size={16} fill="currentColor" />
                                </Button>

                                {/* Add Button: Adds to playlist queue, does NOT play */}
                                <Button
                                    onClick={(e) => { e.preventDefault(); handleAdd(item); }}
                                    aria-label={`Add ${item.title}`}
                                    title={`Add ${item.title} to Playlist`}
                                    size="icon-sm"
                                    variant="outline"
                                    className='text-foreground hover:bg-secondary/50'
                                >
                                    <Plus size={16} />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {results.length === 0 && !loading && q.length > 2 && (
                        <p className='text-center text-muted-foreground p-4'>No results found for "{q}".</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default Search;