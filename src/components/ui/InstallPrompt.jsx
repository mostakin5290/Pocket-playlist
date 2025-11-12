import React, { useEffect, useState } from 'react'

const isMobile = () => /Mobi|Android/i.test(navigator.userAgent || '')

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const handler = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault()
            setDeferredPrompt(e)
            // show prompt only on mobile
            if (isMobile()) setVisible(true)
        }
        window.addEventListener('beforeinstallprompt', handler)
        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [])

    if (!visible) return null

    const onInstall = async () => {
        if (!deferredPrompt) return
        deferredPrompt.prompt()
        await deferredPrompt.userChoice
        setVisible(false)
        setDeferredPrompt(null)
    }

    const onDismiss = () => {
        setVisible(false)
    }

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-card border border-border px-4 py-3 rounded-full shadow-lg flex items-center gap-3">
                <div className="text-sm">Install Pocket Playlist for better background playback</div>
                <button onClick={onInstall} className="ml-2 px-3 py-1 rounded-full bg-primary text-white">Install</button>
                <button onClick={onDismiss} className="ml-2 px-3 py-1 rounded-full">Dismiss</button>
            </div>
        </div>
    )
}

export default InstallPrompt
