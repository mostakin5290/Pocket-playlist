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
            <div
                role="dialog"
                aria-live="polite"
                className="flex items-center gap-4 bg-[#0b1220] border border-white/6 px-4 py-3 rounded-2xl shadow-xl max-w-md w-[min(92vw,480px)] ring-1 ring-white/6"
            >
                <img
                    src="/icons/icon-192.png"
                    alt="Pocket Playlist"
                    className="w-12 h-12 rounded-md object-cover shrink-0"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/logo.svg' }}
                />

                <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">Pocket Playlist</div>
                    <div className="text-xs text-muted mt-0.5 hidden sm:block truncate">Install for better background playback</div>
                </div>

                <div className="flex items-center gap-2 ml-3">
                    <button
                        onClick={onInstall}
                        className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold shadow-md hover:brightness-105 transition-all"
                    >
                        Install
                    </button>

                    <button
                        onClick={onDismiss}
                        aria-label="Dismiss install prompt"
                        className="text-sm px-4 py-2 rounded-full border border-white/14 text-white/95 bg-white/3 hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default InstallPrompt
