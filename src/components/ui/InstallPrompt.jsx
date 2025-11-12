import React, { useEffect, useState } from 'react'

const isMobile = () => /Mobi|Android/i.test(navigator.userAgent || '')

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null)
    const [visible, setVisible] = useState(false)
    const [imgError, setImgError] = useState(false)

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
        } catch {
            void 0;
        }
        setVisible(false)
        setDeferredPrompt(null)
    }

    const onDismiss = () => {
        localStorage.setItem('pp:install-dismissed', Date.now())
        setVisible(false)
    }

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto">
            <div className="w-full max-w-xs bg-card border border-border px-3 py-3 rounded-2xl shadow-xl flex items-center gap-4">
                <div className="shrink-0">
                    {!imgError ? (
                        <img
                            src="/logo.svg"
                            alt="Pocket Playlist"
                            className="w-12 h-12 rounded-lg object-contain"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <img
                            src="/icons/icon-192.png"
                            alt="Pocket Playlist"
                            className="w-12 h-12 rounded-lg object-cover"
                        />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white leading-tight truncate">Pocket Playlist</div>
                    {/* <div className="text-xs text-muted-foreground leading-tight mt-1">Install for better background playback</div> */}
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={onInstall} className="px-4 py-1.5 rounded-lg bg-primary text-white text-sm">Install</button>
                    <button onClick={onDismiss} aria-label="Dismiss" className="text-sm text-muted-foreground px-2 py-1">Close</button>
                </div>
            </div>
        </div>
    )
}

export default InstallPrompt
