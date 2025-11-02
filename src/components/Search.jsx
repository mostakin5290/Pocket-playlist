import React, { useState, useRef, useEffect } from 'react'

const Search = ({ onSelect }) => {
    const [q, setQ] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const API_KEY = import.meta.env.VITE_YT_API

    async function searchYouTube(searchTerm) {
        if (!searchTerm) return
        setLoading(true)
        setError(null)
        try {
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(searchTerm)}&key=${API_KEY}`
            const res = await fetch(url)
            if (!res.ok) throw new Error(await res.text())
            const data = await res.json()

            const items = (data.items || []).map(i => ({
                id: i.id.videoId,
                title: i.snippet.title,
                thumbnail: i.snippet.thumbnails?.medium?.url || i.snippet.thumbnails?.default?.url,
                channel: i.snippet.channelTitle,
            }))

            setResults(items)
        } catch (err) {
            setError(err?.message || 'Search failed')
        } finally {
            setLoading(false)
        }
    }

    // show results when there are items
    const [showResults, setShowResults] = useState(false)
    const containerRef = useRef(null)

    useEffect(() => {
        setShowResults(results && results.length > 0)
    }, [results])

    // close on outside click or escape
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

    function onSubmit(e) {
        e.preventDefault()
        searchYouTube(q.trim())
    }

    function handleSelect(item) {
        // call prop handler if provided
        if (onSelect) onSelect(item)
        // dispatch a global event so Layout (or any container) can handle it without prop drilling
        try {
            window.dispatchEvent(new CustomEvent('pp:search-select', { detail: item }))
        } catch (e) { /* ignore */ }
        // hide results after selection
        setShowResults(false)
    }

    return (
        <div ref={containerRef} className='w-full flex flex-col items-center relative'>
            <form onSubmit={onSubmit} className='w-full flex items-center justify-center'>
                <div className='flex items-center px-3 py-2 border border-border w-full max-w-2xl rounded-full overflow-hidden bg-[#191622] shadow-md'>
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        type="text"
                        placeholder='Search YouTube videos...'
                        className='flex-1 h-10 bg-transparent text-foreground placeholder:text-muted-foreground outline-none px-3'
                    />
                    <button type='submit' className='ml-3 px-4 py-2 rounded-full font-semibold text-white shadow-sm' style={{ background: 'linear-gradient(90deg,#FF1EA8,#FF56B6)' }}>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>

            {error && <p className='text-sm text-destructive mt-2'>{error}</p>}

            {showResults && (
                <div className='absolute left-1/2 top-full transform -translate-x-1/2 mt-2 w-full max-w-2xl p-2 grid grid-cols-1 gap-2 rounded-lg bg-[#0f0f12] border border-border shadow-2xl z-50 max-h-72 overflow-auto'>
                    {results.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            className='flex items-center gap-3 p-2 rounded-lg transition-shadow hover:shadow-[0_6px_24px_rgba(255,30,168,0.18)] hover:bg-accent/6 text-left'
                        >
                            <img src={item.thumbnail} alt={item.title} className='w-28 h-16 object-cover rounded' />
                            <div className='flex-1'>
                                <div className='text-sm font-medium text-foreground'>{item.title}</div>
                                <div className='text-xs text-muted-foreground mt-1'>{item.channel}</div>
                            </div>
                            <div className='text-xs text-muted-foreground'>Play</div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Search;
