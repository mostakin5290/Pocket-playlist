import React, { useState, useRef, useEffect } from 'react'
import { AiOutlinePlus, AiOutlinePlayCircle, AiOutlineSearch } from 'react-icons/ai'

// compact prop makes the search input smaller and the dropdown full-width (for mobile header)

const Search = ({ onSelect, compact = false }) => {
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
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=100&q=${encodeURIComponent(searchTerm)}&key=${API_KEY}`
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
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const itemRefs = useRef([])

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

    useEffect(() => {
        if (!showResults) setSelectedIndex(-1)
    }, [showResults])

    useEffect(() => {
        // keep the selected item in view
        const ref = itemRefs.current[selectedIndex]
        if (ref && ref.scrollIntoView) {
            ref.scrollIntoView({ block: 'nearest', inline: 'nearest' })
        }
    }, [selectedIndex])

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
                handleSelect(results[selectedIndex])
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
                        onChange={(e) => setQ(e.target.value)}
                        type="text"
                        placeholder='Search YouTube videos...'
                        onKeyDown={onInputKey}
                        className={`flex-1 ${compact ? 'h-8 text-sm' : 'h-10'} bg-transparent text-foreground placeholder:text-muted-foreground outline-none px-3`}
                    />
                    <button type='submit' className={`${compact ? 'ml-2 px-3 h-8' : 'ml-3 px-4 h-10'} flex items-center justify-center rounded-full font-semibold text-white shadow-sm`} style={{ background: 'var(--accent-gradient)' }}>
                        {loading ? (compact ? <span className="text-sm">...</span> : 'Searching...') : (compact ? <AiOutlineSearch size={16} /> : 'Search')}
                    </button>
                </div>
            </form>

            {error && <p className='text-sm text-destructive mt-2'>{error}</p>}

            {showResults && (
                <div
                    role="listbox"
                    aria-label="Search results"
                    className={`absolute top-full ${compact ? 'left-0 mt-2 w-full max-w-full' : 'left-1/2 transform -translate-x-1/2 mt-3 w-full max-w-3xl'} p-2 grid grid-cols-1 gap-2 rounded-3xl z-50 max-h-[60vh] overflow-auto fade-up`}
                    style={{
                        background: 'rgba(10,10,12,0.86)',
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
                            onMouseLeave={() => setSelectedIndex(-1)}
                            className={`flex items-center gap-4 p-2 rounded-2xl smooth-transition ${selectedIndex === idx ? '' : ''}`}
                            style={selectedIndex === idx ? { background: 'rgba(255,255,255,0.03)', boxShadow: `0 8px 30px rgba(216,27,96,0.12), 0 2px 8px rgba(142,36,170,0.06)`, borderLeft: `6px solid var(--accent-from)` } : { background: 'transparent' }}
                        >
                            <div className='w-32 h-20 rounded-xl overflow-hidden shrink-0' style={{ boxShadow: 'inset 0 -20px 40px rgba(0,0,0,0.5)' }}>
                                <img src={item.thumbnail} alt={item.title} className='w-full h-full object-cover' />
                            </div>
                            <div className='flex-1 min-w-0'>
                                <div className='text-sm font-semibold text-foreground truncate'>{item.title}</div>
                                <div className='text-xs text-muted-foreground mt-1 truncate'>{item.channel}</div>
                                <div className='text-xs text-muted-foreground mt-2'>{/* placeholder for duration or extra metadata */}</div>
                            </div>
                            <div className='ml-4 flex items-center gap-2'>
                                <button
                                    onClick={() => handleSelect(item)}
                                    aria-label={`Play ${item.title}`}
                                    title={`Play ${item.title}`}
                                    className='inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold text-white smooth-transition'
                                    style={{ background: 'var(--accent-gradient)', boxShadow: selectedIndex === idx ? '0 10px 24px rgba(216,27,96,0.14)' : '0 4px 12px rgba(216,27,96,0.06)' }}
                                >
                                    <AiOutlinePlayCircle size={16} />
                                </button>

                                <button
                                    onClick={() => handleSelect(item)}
                                    aria-label={`Add ${item.title}`}
                                    title={`Add ${item.title}`}
                                    className='inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold text-white smooth-transition'
                                    style={{ background: 'var(--accent-gradient)', boxShadow: selectedIndex === idx ? '0 10px 24px rgba(216,27,96,0.14)' : '0 4px 12px rgba(216,27,96,0.06)' }}
                                >
                                    <AiOutlinePlus size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Search;
