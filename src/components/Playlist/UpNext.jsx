import React from 'react'

const UpNext = ({ items = [], currentIndex = 0, onPlayIndex = () => { }, className = '' }) => {
    return (
        <div className={className}>
            <h3 className="text-lg font-semibold mb-2">Up Next</h3>
            {items.length === 0 && (
                <p className="text-sm text-muted-foreground">No playlist loaded. Add a YouTube playlist to populate Up Next.</p>
            )}

            <div className='mt-2 space-y-2'>
                {items.map((item, idx) => (
                    <button
                        key={item.id}
                        onClick={() => onPlayIndex(idx)}
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
    )
}

export default UpNext
