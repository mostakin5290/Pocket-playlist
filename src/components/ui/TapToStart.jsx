import React, { useEffect, useState } from 'react'

const isMobile = () => /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '')

const TapToStart = () => {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        // show only on mobile devices and when there's no gesture yet
        if (!isMobile()) return
        setVisible(true)
    }, [])

    if (!visible) return null

    const handleTap = () => {
        // Dispatch a custom event players listen to for the first user gesture
        window.dispatchEvent(new CustomEvent('pp:user-gesture'))
        setVisible(false)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <button onClick={handleTap} className="bg-primary text-white px-6 py-3 rounded-full text-lg">Tap to start</button>
        </div>
    )
}

export default TapToStart
