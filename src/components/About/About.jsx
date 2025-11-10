import React from 'react'
import ProfileCard from '../ui/ProfileCard'
import Footer from '../Layout/Footer'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="w-full max-w-7xl mx-auto px-4">
        {/* Hero */}
        <section className="bg-card border border-border rounded-2xl p-8 shadow-2xl mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ boxShadow: '0 10px 30px rgba(142,36,170,0.14)' }}>
              <img src="/logo.svg" alt="Pocket Playlist Logo" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Pocket Playlist — music, simplified</h1>
              <p className="text-muted-foreground mt-2 max-w-3xl">Pocket Playlist is a lightweight, privacy-friendly YouTube background player. Create custom playlists, play audio-only or video, and enjoy a distraction-free listening experience without ads.</p>
              <div className="mt-4 flex items-center gap-3">
                <Link to="/" className="inline-block px-4 py-2 rounded-full font-semibold text-white" style={{ background: 'var(--accent-gradient)' }}>Get Started</Link>
                <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">See features</a>
              </div>
            </div>
          </div>
        </section>

        {/* Features + How it works */}
        <section id="features" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Core Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#0f0f12]/40">
                <h3 className="font-semibold">Background Play</h3>
                <p className="text-sm text-muted-foreground mt-2">Continue listening while you browse other apps or lock your screen — optimized for low-bandwidth audio playback.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#0f0f12]/40">
                <h3 className="font-semibold">Custom Playlists</h3>
                <p className="text-sm text-muted-foreground mt-2">Paste a YouTube playlist URL or add individual videos to build your own queue. Save locally in your browser.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#0f0f12]/40">
                <h3 className="font-semibold">Audio & Video Modes</h3>
                <p className="text-sm text-muted-foreground mt-2">Toggle between audio-only and full video modes — perfect for background listening or watching.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#0f0f12]/40">
                <h3 className="font-semibold">No Ads, No Tracking</h3>
                <p className="text-sm text-muted-foreground mt-2">We don't require accounts and avoid unnecessary tracking — your playlists stay in your browser.</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mt-6 mb-3">How it works</h2>
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2">
              <li>Paste a YouTube playlist URL or a single video link.</li>
              <li>Click Add to load the playlist into the Up Next queue.</li>
              <li>Use the Video/Audio toggle in the header to switch modes.</li>
              <li>Click a track to play, or let the queue play continuously.</li>
            </ol>

          <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Do I need an account?</h4>
              <p className="text-sm text-muted-foreground mt-1">No — Pocket Playlist stores your playlist locally in the browser. You can remove it at any time.</p>
            </div>
            <div>
              <h4 className="font-medium">Is this affiliated with YouTube?</h4>
              <p className="text-sm text-muted-foreground mt-1">Pocket Playlist uses the public YouTube APIs to fetch video and playlist metadata. We are not affiliated with YouTube/Google.</p>
            </div>
            <div>
              <h4 className="font-medium">Can I export my playlists?</h4>
              <p className="text-sm text-muted-foreground mt-1">Currently playlists are stored locally. Export/import support is planned for future releases.</p>
            </div>
            <div>
              <h4 className="font-medium">How can I contribute?</h4>
              <p className="text-sm text-muted-foreground mt-1">Contributions, bug reports, and feature requests are welcome on our GitHub repository — check the README for project links.</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Contact</h3>
            <p className="text-sm text-muted-foreground">Questions or feedback? Email us at <a className='text-accent-foreground underline' href="mailto:hello@pocket-playlist.example">hello@pocket-playlist.example</a></p>
          </div>
          </div>
          

          <aside className="bg-card border border-border rounded-2xl p-6 shadow-lg">
            <h3 className='text-lg font-semibold mb-3'>Meet Our Team</h3>
            <div className='flex flex-col gap-3'>
              <ProfileCard Fname="Mostakin Mondal" />
              <ProfileCard Fname="Sandipan Pal" />
              <ProfileCard Fname="Sk Asfar Ali" />
            </div>
          </aside>
          
        </section>

        {/* FAQ + Contact */}

      </div>

      <Footer />
    </div>
  )
}

export default About


