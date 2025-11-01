import React from 'react'

const Footer = () => {

  return (
    <footer className="w-full bg-background text-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold">PP</span>
            </div>
            <div>
              <div className="text-lg font-semibold">Pocket Playlist</div>
              <div className="text-sm text-muted-foreground">Lightweight YouTube playlist player</div>
            </div>
          </div>

          <nav className="flex gap-6 md:gap-8 justify-center">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">About</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">Help</a>
          </nav>

          <div className="text-sm text-muted-foreground text-center md:text-right">
            <div>© {new Date().getFullYear()} Pocket Playlist</div>

          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;

// We deliver smooth, high-quality background music experiences powered by YouTube. you enjoy the rhythm of creativity that bring music to life.
