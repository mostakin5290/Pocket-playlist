import React from 'react'
import Footer from '../Layout/Footer'
import { Link } from 'react-router-dom'

const Help = () => {
    return (
        <div className="min-h-screen bg-background text-foreground py-12">
            <div className="w-full max-w-4xl mx-auto px-4">
                <section className="bg-card border border-border rounded-2xl p-6 shadow-lg mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">Help & Support</h1>
                    <p className="text-sm text-muted-foreground">Need a hand? This page contains quick answers, troubleshooting tips, and ways to get in touch.</p>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                        <h2 className="text-lg font-semibold mb-3">Getting started</h2>
                        <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2">
                            <li>Use the search box to find YouTube videos or paste a YouTube link.</li>
                            <li>Add items to the queue and click the Play button to start playback.</li>
                            <li>Use the Audio player for background listening and the Video player for watching.</li>
                        </ol>
                        <Link to="/" className="inline-block mt-4 text-sm text-accent-foreground underline">Back to Home</Link>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                        <h2 className="text-lg font-semibold mb-3">Quick tips</h2>
                        <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                            <li>On mobile, use the audio mode for lower bandwidth and background play.</li>
                            <li>Use the seek controls to skip forward/back 10s when listening.</li>
                            <li>Mute/unmute and volume controls are available in the audio player.</li>
                        </ul>
                    </div>
                </section>

                <section className="bg-card border border-border rounded-2xl p-6 shadow-lg mb-6">
                    <h2 className="text-lg font-semibold mb-3">Troubleshooting</h2>
                    <div className="space-y-3 text-sm text-muted-foreground">
                        <div>
                            <strong>Audio not playing?</strong>
                            <p className="mt-1">Make sure your browser tab isn't muted and that autoplay isn't blocked. Try tapping the player once to allow playback.</p>
                        </div>
                        <div>
                            <strong>Video doesn't load?</strong>
                            <p className="mt-1">Some YouTube videos restrict embedding. Try using the audio mode or a different video.</p>
                        </div>
                        <div>
                            <strong>Playback stops on lock-screen (mobile)?</strong>
                            <p className="mt-1">Some mobile browsers suspend background playback. Use the audio mode for best results.</p>
                        </div>
                    </div>
                </section>

                <section className="bg-card border border-border rounded-2xl p-6 shadow-lg mb-6">
                    <h2 className="text-lg font-semibold mb-3">Contact & feedback</h2>
                    <p className="text-sm text-muted-foreground">Found a bug or want a feature? Open an issue on GitHub or email us:</p>
                    <p className="text-sm mt-2"><a className="text-accent-foreground underline" href="mailto:hello@pocket-playlist.example">hello@pocket-playlist.example</a></p>
                </section>

            </div>
            <Footer />
        </div>
    )
}

export default Help
