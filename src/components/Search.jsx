import React, { useState } from 'react'
const Search = ({ onSelect }) => {
    const [q, setQ] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const API_KEY = import.meta.env.VITE_YT_API || import.meta.env.vite_YT_API

    async function searchYouTube(searchTerm) {
        if (!searchTerm) return
        if (!API_KEY) {
            setError('Missing YouTube API key. Set VITE_YT_API in .env')
            return
        }

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
            console.error('YT search error', err)
            setError('Search failed. Check console for details.')
        } finally {
            setLoading(false)
        }
    }

    function onSubmit(e) {
        e.preventDefault()
        searchYouTube(q.trim())
    }

    function handleSelect(item) {
        console.log('Search select', item)
        if (onSelect) onSelect(item)
        else console.log('Selected video', item)
    }

    return (
        <div className='w-full flex flex-col items-center'>
            <form onSubmit={onSubmit} className='w-full flex items-center justify-center'>
                <div className='flex items-center p-2 pl-4 pr-1 border border-amber-200/20 w-full max-w-2xl h-12 rounded-full overflow-hidden bg-card'>
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        type="text"
                        placeholder='Search YouTube videos...'
                        className='flex-1 h-8 bg-transparent text-foreground placeholder:text-muted-foreground outline-none px-3'
                    />
                    <button type='submit' className='bg-amber-50 hover:bg-amber-100 text-black font-semibold px-4 py-2 rounded-3xl ml-2'>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>

            {error && <p className='text-sm text-destructive mt-2'>{error}</p>}
            <div className=' w-full max-w-2xl mt-4 p-2 grid grid-cols-1 sm:grid-cols-2 gap-1 rounded-lg  absolute z-10'>
                {results.map(item => (
                    <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className='flex items-center gap-3 p-2 rounded-lg hover:shadow-md transition-shadow bg-[#333]'
                    >
                        <img src={item.thumbnail} alt={item.title} className='w-28 h-16 object-cover rounded' />
                        <div className='text-left'>
                            <div className='text-sm font-medium'>{item.title}</div>
                            
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Search;
