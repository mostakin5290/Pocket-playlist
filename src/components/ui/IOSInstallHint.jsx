import React, { useEffect, useState } from 'react'

const isiOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream

const IOSInstallHint = () => {
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (!isiOS()) return
        // Show hint briefly for iOS users
        setShow(true)
        const t = setTimeout(() => setShow(false), 12000)
        return () => clearTimeout(t)
    }, [])

    if (!show) return null

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-card border border-border px-4 py-3 rounded-full shadow-lg flex items-center gap-3">
                <div className="text-sm">Install: tap Share → Add to Home Screen (Safari)</div>
                <button onClick={() => setShow(false)} className="ml-2 px-3 py-1 rounded-full">OK</button>
            </div>
        </div>
    )
}

export default IOSInstallHint
