import React from 'react'

const YTPlayer = ({ videoId = 'EmsRACUM4V4', playlistId = 'RDEmsRACUM4V4' }) => {
    const src = `https://www.youtube.com/embed/${videoId}?list=${playlistId}&autoplay=0&rel=0`;

    return (
        <div>
            <div className="relative w-full bg-black rounded-xl overflow-hidden">
                <div style={{ aspectRatio: '16/9' }}>
                    <iframe
                        title="YouTube player"
                        src={src}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    )
}

export default YTPlayer;
