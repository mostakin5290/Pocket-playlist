import React, { useEffect, useState } from 'react'

const isMobile = () => /Mobi|Android/i.test(navigator.userAgent || '')

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const dismissed = localStorage.getItem('pp:install-dismissed')

        const handler = (e) => {
            // prevent the browser mini-infobar and capture the prompt
            e.preventDefault()
            setDeferredPrompt(e)
            // show on mobile only and only if the user hasn't dismissed recently
            if (isMobile() && !dismissed) setVisible(true)
        }

        window.addEventListener('beforeinstallprompt', handler)
        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [])

    if (!visible) return null

    const onInstall = async () => {
        if (!deferredPrompt) return
        deferredPrompt.prompt()
        try {
            const choice = await deferredPrompt.userChoice
            // remember choice so we don't nag repeatedly
            if (choice?.outcome === 'accepted') {
                localStorage.setItem('pp:install-accepted', Date.now())
            } else {
                localStorage.setItem('pp:install-dismissed', Date.now())
            }
        } catch (e) {
            // ignore
        }
        setVisible(false)
        setDeferredPrompt(null)
    }

    const onDismiss = () => {
        localStorage.setItem('pp:install-dismissed', Date.now())
        setVisible(false)
    }

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <div className="flex items-center gap-3 bg-card border border-border px-3 py-2 rounded-full shadow-lg">
                <img src="/icons/icon-192.png" alt="Pocket Playlist" className="w-10 h-10 rounded-md" />
                <div className="flex flex-col">
                    <div className="text-sm font-medium">Pocket Playlist</div>
                    <div className="text-xs text-muted">Install for better background playback</div>
                </div>
                <div className="ml-3 flex items-center gap-2">
                    <button onClick={onInstall} className="px-3 py-1 rounded-full bg-primary text-white text-sm">Install</button>
                    <button onClick={onDismiss} aria-label="Dismiss" className="text-sm px-2 py-1">Close</button>
                </div>
            </div>
        </div>
    )
}

export default InstallPrompt
