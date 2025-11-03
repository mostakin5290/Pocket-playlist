import React from 'react'
import { Button } from './ui/button'
import { RefreshCw, Plus } from 'lucide-react'

const SongList = ({ playlistUrl = '', setPlaylistUrl = () => { }, handelReset = () => { }, handleAdd = () => { }, playlist = [], currentIndex = 0, handlePlayIndex = () => { } }) => {
    return (
        <div className='relative h-auto md:h-[70vh] w-full rounded-2xl p-5 bg-card shadow-2xl fade-up'>
            <div className="h-full flex flex-col">
                <div className='flex items-center justify-between gap-4 mb-4'>
                    <div className='flex-1'>
                        <h3 className="text-lg font-semibold mb-2 text-foreground">Add Playlist</h3>
                        <input
                            value={playlistUrl}
                            onChange={(e) => setPlaylistUrl(e.target.value)}
                            placeholder='YouTube playlist URL or ID'
                            className='w-full h-10 px-4 bg-card/90 border border-border rounded-full outline-none placeholder:text-muted-foreground text-foreground transition-shadow focus-visible:ring-ring/50 focus-visible:ring-2'
                        />
                    </div>
                    <div className='shrink-0 flex flex-col items-end gap-3'>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handelReset}
                            className="rounded-full shadow-md transform-gpu hover:scale-105 px-4 flex items-center justify-center gap-2 border-border text-foreground">
                            <RefreshCw size={16} />
                            Reset
                        </Button>

                        <Button
                            variant="default"
                            size="sm"
                            onClick={handleAdd}
                            className="rounded-full shadow-md transform-gpu hover:scale-105 px-4 flex items-center justify-center gap-2 text-white"
                            style={{ background: 'var(--accent-gradient)' }}>
                            <Plus size={16} />
                            Add
                        </Button>
                    </div>
                </div>

                <h3 className="text-lg font-semibold mb-2 text-foreground">Up Next</h3>
                {playlist.length === 0 && (
                    <p className="text-sm text-muted-foreground">No playlist loaded. Add a YouTube playlist to populate Up Next.</p>
                )}

                <div className='mt-2 space-y-2 overflow-auto max-h-[48vh] pr-2'>
                    {playlist.map((item, idx) => (
                        <button
                            key={item.id}
                            onClick={() => handlePlayIndex(idx)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg group smooth-transition ${idx === currentIndex ? 'bg-[#0f0f12] border-l-4' : 'hover:bg-card/10 hover:shadow-sm'}`}
                            style={idx === currentIndex ? { borderLeftColor: 'var(--accent-from)' } : undefined}
                        >
                            <img src={item.thumbnail} alt={item.title} className='w-24 h-14 object-cover rounded-md shrink-0' />
                            <div className='flex-1 min-w-0'>
                                <div className='text-sm font-medium text-foreground truncate'>{item.title}</div>
                                <div className='text-xs text-muted-foreground mt-1 truncate'>{item.channel}</div>
                            </div>
                            <div className='flex flex-col items-end ml-2'>
                                {idx === currentIndex ? (
                                    <div className='inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium neon-glow' style={{ background: 'var(--accent-gradient)' }}>
                                        <span className='w-2 h-2 rounded-full' style={{ background: 'var(--accent-from)' }} />
                                        <span className='text-white'>Playing</span>
                                    </div>
                                ) : (
                                    <div className='text-xs text-muted-foreground'>#{idx + 1}</div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SongList;