import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group"
import { Video, Music } from 'lucide-react'
import { BorderBeam } from '@/components/ui/border-beam'
import Search from '@/components/Search'

const Header = ({ mode = 'video', setMode = () => { } }) => {
  const [open, setOpen] = useState(false);

  const btnBase = 'rounded-full transform-gpu hover:scale-105 px-4 flex items-center gap-2 transition-all duration-200'

  const activeClass = 'text-white ring-1'
  const idleClass = 'bg-card/10 text-foreground hover:bg-card/20'

  return (
    // floating fixed header centered at top
    <header className="fixed inset-x-0 top-4 z-50 pointer-events-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-visible flex justify-center">

          <div className="relative z-10 pointer-events-auto w-full bg-card/80 backdrop-blur-lg border border-border shadow-2xl px-4 sm:px-6 lg:px-8 rounded-3xl">
            <div className="flex items-center justify-between h-16">

              {/* Brand */}
              <div className="flex items-center gap-3">
                <a href="/" className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: 'var(--accent-gradient)',
                      boxShadow: '0 8px 30px rgba(255,30,168,0.36)'
                    }}
                  >
                    <span className="text-white font-bold">PP</span>
                  </div>
                  <span className="font-semibold text-lg">Pocket Playlist</span>
                </a>
              </div>

              {/* Search (center) */}
              <div className="hidden md:flex flex-1 px-4 justify-center">
                <div className="w-full max-w-2xl">
                  <Search />
                </div>
              </div>

              {/* Desktop actions */}
              <div className="hidden md:flex items-center gap-4">
                <ButtonGroup>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setMode('video')}
                    className={`${btnBase} ${mode === 'video' ? activeClass : idleClass}`}
                    style={mode === 'video' ? { background: 'var(--accent-gradient)', boxShadow: '0 6px 30px rgba(255,30,168,0.28)' } : undefined}
                  >
                    <Video size={16} />
                    Video
                  </Button>
                  <ButtonGroupSeparator />
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setMode('audio')}
                    className={`${btnBase} ${mode === 'audio' ? activeClass : idleClass}`}
                    style={mode === 'audio' ? { background: 'var(--accent-gradient)', boxShadow: '0 6px 30px rgba(255,30,168,0.28)' } : undefined}
                  >
                    <Music size={16} />
                    Audio
                  </Button>
                </ButtonGroup>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  aria-label="Toggle menu"
                  onClick={() => setOpen(!open)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {open ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile dropdown/menu */}
          {open && (
            <div className="md:hidden relative z-10 bg-card border-t border-border shadow-lg">
              <div className="px-4 pt-4 pb-6 space-y-3">

                <div>
                  <ButtonGroup>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setMode('video')}
                      className={`rounded-full px-4 flex items-center gap-2 ${mode === 'video' ? activeClass : 'bg-accent/10 text-accent'}`}
                    >
                      <Video size={14} />
                      Video
                    </Button>
                    <ButtonGroupSeparator />
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setMode('audio')}
                      className={`rounded-full px-4 flex items-center gap-2 ${mode === 'audio' ? activeClass : 'bg-accent/10 text-accent'}`}
                    >
                      <Music size={14} />
                      Audio
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
