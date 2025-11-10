import React, { useState } from 'react'
import { Button } from './ui/button'
import { RefreshCw, Plus, Trash2, Music, X, Play } from 'lucide-react'
import { Separator } from './ui/separator'

const SongList = ({
    playlistUrl = '',
    setPlaylistUrl = () => { },
    handelReset = () => { },
    handleAdd = () => { },
    playlists = {},
    activePlaylistId,
    handleSwitchPlaylist = () => { },
    handleCreatePlaylist = () => { },
    handleDeletePlaylist = () => { },
    playlist = [], // The items of the active playlist
    currentIndex = 0,
    handlePlayIndex = () => { },
    handleRemoveSong = () => { },
    playerVideoId, // The ID currently passed to the player
}) => {
    const activePlaylist = playlists[activePlaylistId] || { id: 'default-playlist', name: 'My Pocket List', items: [] };
    const [newListName, setNewListName] = useState('');

    const handleCreate = () => {
        if (newListName.trim()) {
            handleCreatePlaylist(newListName.trim());
            setNewListName('');
        }
    }

    return (
        <div className='relative h-auto md:h-[calc(100vh-100px)] w-full rounded-2xl p-5 bg-card shadow-2xl fade-up flex flex-col'>
            <div className="flex-shrink-0 mb-4">
                {/* Playlist Selector/Manager */}
                <div className='mb-4'>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Playlists</h3>
                    <div className='flex flex-wrap gap-2 mb-3 max-h-24 overflow-y-auto custom-scrollbar'>
                        {Object.values(playlists).map((pl) => (
                            <Button
                                key={pl.id}
                                variant={pl.id === activePlaylistId ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleSwitchPlaylist(pl.id)}
                                className="rounded-full flex items-center justify-center gap-2"
                                style={pl.id === activePlaylistId ? { background: 'var(--accent-gradient)' } : undefined}
                            >
                                {pl.name} ({pl.items.length})
                                {pl.id !== 'default-playlist' && pl.id === activePlaylistId && (
                                    <span className='ml-1 cursor-pointer' onClick={(e) => { e.stopPropagation(); handleDeletePlaylist(pl.id); }} aria-label={`Delete ${pl.name}`} title={`Delete ${pl.name}`}>
                                        <Trash2 size={14} className='text-white hover:text-red-300' />
                                    </span>
                                )}
                            </Button>
                        ))}
                    </div>

                    <div className='flex gap-2'>
                        <input
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            placeholder='New list name'
                            className='flex-1 h-10 px-4 bg-card/90 border border-border rounded-full outline-none placeholder:text-muted-foreground text-foreground transition-shadow focus-visible:ring-ring/50 focus-visible:ring-2'
                        />
                        <Button variant="outline" size="sm" onClick={handleCreate} disabled={!newListName.trim()} className="rounded-full flex-shrink-0">
                            <Plus size={16} />
                            Create
                        </Button>
                    </div>
                </div>
                <Separator className="my-4" />

                {/* URL/ID Input for adding videos/playlists */}
                <div className='flex items-end gap-2 mb-4'>
                    <div className='flex-1'>
                        <h3 className="text-lg font-semibold mb-2 text-foreground">Add to "{activePlaylist.name}"</h3>
                        <input
                            value={playlistUrl}
                            onChange={(e) => setPlaylistUrl(e.target.value)}
                            placeholder='YouTube URL or ID'
                            className='w-full h-10 px-4 bg-card/90 border border-border rounded-full outline-none placeholder:text-muted-foreground text-foreground transition-shadow focus-visible:ring-ring/50 focus-visible:ring-2'
                        />
                    </div>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleAdd}
                        disabled={!playlistUrl.trim()}
                        className="rounded-full flex-shrink-0 h-10 px-4 flex items-center justify-center gap-2 text-white"
                        style={{ background: 'var(--accent-gradient)' }}>
                        <Plus size={16} />
                        Add
                    </Button>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handelReset}
                    className="rounded-full shadow-md transform-gpu hover:scale-105 px-4 mb-4 flex items-center justify-center gap-2 border-border text-foreground">
                    <RefreshCw size={16} />
                    Reset All Data
                </Button>
                <Separator className="my-4" />
            </div>

            {/* Song List */}
            <h3 className="text-lg font-semibold mb-2 text-foreground flex-shrink-0">Up Next ({activePlaylist.items.length} songs)</h3>
            {playlist.length === 0 && (
                <p className="text-sm text-muted-foreground flex-grow">No songs in the active playlist. Add some to get started.</p>
            )}

            <div className='mt-2 space-y-2 overflow-y-auto custom-scrollbar flex-grow pr-2'>
                {playlist.map((item, idx) => {
                    const isPlaying = playerVideoId === item.id;
                    const isQueued = !playerVideoId && idx === currentIndex && item.id === playerVideoId; // The actual logic is handled by Layout's useEffect, here we just check ID match

                    return (
                        <div
                            key={item.id}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl group smooth-transition border ${isPlaying ? 'bg-[#0f0f12] ring-2 ring-primary/30 border-primary/20' : 'hover:bg-card/10 hover:shadow-sm border-transparent'}`}
                            style={isPlaying ? { borderLeft: '4px solid var(--accent-from)' } : undefined}
                        >
                            <button
                                onClick={() => handlePlayIndex(idx)}
                                className='shrink-0 relative w-24 h-14 rounded-md overflow-hidden cursor-pointer'
                                title={`Click to Play: ${item.title}`}
                            >
                                <img src={item.thumbnail} alt={item.title} className='w-full h-full object-cover' />
                                {(isPlaying || isQueued) && (
                                    <div className='absolute inset-0 bg-black/60 flex items-center justify-center'>
                                        <Play size={20} className='text-white' fill='currentColor' />
                                    </div>
                                )}
                            </button>

                            <div className='flex-1 min-w-0'>
                                <div className='text-sm font-medium text-foreground truncate'>{item.title}</div>
                                <div className='text-xs text-muted-foreground mt-1 truncate'>{item.channel}</div>
                            </div>

                            <div className='shrink-0 flex items-center gap-2'>
                                {isPlaying ? (
                                    <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium' style={{ background: 'var(--accent-gradient)' }}>
                                        <Music size={12} className='mr-1' /> Playing
                                    </span>
                                ) : (
                                    <div className='text-xs text-muted-foreground'>{idx + 1}</div>
                                )}
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={() => handleRemoveSong(item.id)}
                                    title="Remove from playlist"
                                    className="text-muted-foreground rounded-2xl hover:text-destructive hover:bg-destructive/10"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default SongList;