import React from 'react'
import { BorderBeam } from '@/components/ui/border-beam'
import { Link } from 'react-router-dom';

const Footer = () => {

  return (
    <footer className="w-full text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative rounded-2xl overflow-hidden">
          <BorderBeam borderWidth={6} size={60} />

          <div className="relative z-10 bg-[#191622] border-t border-border px-3 py-4 fade-up smooth-transition">
            <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-6">
              <div className="flex items-center  gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'var(--accent-gradient)',
                    boxShadow: '0 6px 20px rgba(255,30,168,0.28)'
                  }}
                >
                  <span className="text-white font-bold">PP</span>
                </div>
                <div>
                  <div className="text-lg font-semibold">Pocket Playlist</div>
                  <div className="text-sm text-muted-foreground">Lightweight YouTube playlist player</div>
                </div>
              </div>

              <nav className="flex gap-6 md:gap-8 justify-center">

                <Link to='/about' className="text-sm text-muted-foreground hover:text-foreground transition">About</Link>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition">Privacy</Link>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">Help</a>
              </nav>

              <div className="text-sm text-muted-foreground text-center md:text-right">
                <div>© {new Date().getFullYear()} Pocket Playlist</div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;

// We deliver smooth, high-quality background music experiences powered by YouTube. you enjoy the rhythm of creativity that bring music to life.
