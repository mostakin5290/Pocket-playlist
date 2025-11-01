import React from 'react'
import { Button } from './ui/button'
import { RefreshCw, Plus } from 'lucide-react'

const SongList = ({ playlistUrl = '', setPlaylistUrl = () => { }, handelReset = () => { }, handleAdd = () => { }, playlist = [], currentIndex = 0, handlePlayIndex = () => { } }) => {
    return (
        <div className='h-auto md:h-[70vh] w-full border rounded-3xl p-4 bg-card'>
            <div className="h-full overflow-auto">
                <div className='flex gap-5 mb-6 justify-around'>
                    <div className='flex flex-col justify-between'>
                        <h3 className="text-lg font-semibold mb-2">Add Playlist</h3>
                        <input
                            value={playlistUrl}
                            onChange={(e) => setPlaylistUrl(e.target.value)}
                            placeholder='YouTube playlist URL or ID'
                            className='flex-1 h-10 px-4 bg-card border border-border rounded-full outline-none placeholder:text-muted-foreground text-foreground transition-shadow focus-visible:ring-ring/50 focus-visible:ring-2'
                        />
                    </div>
                    <div className='flex flex-col justify-start items-stretch gap-3 mb-4'>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handelReset}
                            className="w-full rounded-full shadow-md transform-gpu hover:scale-105 px-4 flex items-center justify-center gap-2">
                            <RefreshCw size={16} />
                            Reset
                        </Button>

                        <Button
                            variant="default"
                            size="sm"
                            onClick={handleAdd}
                            className="w-full rounded-full shadow-md transform-gpu hover:scale-105 px-4 flex items-center justify-center gap-2">
                            <Plus size={16} />
                            Add
                        </Button>
                    </div>
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
    )
}

export default SongList;