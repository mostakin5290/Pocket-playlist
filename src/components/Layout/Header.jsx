import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group"
import { Video, Music } from 'lucide-react'
import Search from '@/components/Search'

const Header = ({ mode = 'video', setMode = () => { } }) => {
  const [open, setOpen] = useState(false)

  const btnBase = 'rounded-full transform-gpu hover:scale-105 px-4 py-2 flex items-center gap-2 transition-all duration-200'
  const activeClass = 'text-white ring-1'
  const idleClass = 'bg-card/10 text-foreground hover:bg-card/20'

  return (
    <header className="fixed inset-x-0 top-2 md:top-4 z-50 pointer-events-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-visible">

          {/* Main Header Container */}
          <div className="relative z-10 pointer-events-auto w-full bg-card/90 backdrop-blur-lg border border-border shadow-2xl rounded-3xl px-3 py-2 md:px-4 md:py-3">

            {/* Top Row: Brand + Menu Button */}
            <div className="flex items-center justify-between px-0 py-0 md:py-0">

              {/* Brand */}
              <div className="flex items-center gap-3">
                <a href="/" className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'var(--accent-gradient)',
                      boxShadow: '0 8px 30px rgba(255,30,168,0.36)',
                    }}
                  >
                    <span className="text-white font-bold text-sm">PP</span>
                  </div>
                  <span className="font-semibold text-base md:text-lg whitespace-nowrap">Pocket Playlist</span>
                </a>
              </div>

              {/* Desktop Search (center on desktop) */}
              <div className="hidden md:flex flex-1 px-6 justify-center">
                <div className="w-full max-w-2xl">
                  <Search />
                </div>
              </div>

              {/* Desktop Mode Switcher */}
              <div className="hidden md:flex items-center gap-4">
                <ButtonGroup>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setMode('video')}
                    className={`${btnBase} ${mode === 'video' ? activeClass : idleClass}`}
                    style={mode === 'video'
                      ? { background: 'var(--accent-gradient)', boxShadow: '0 6px 30px rgba(255,30,168,0.28)' }
                      : undefined}
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
                    style={mode === 'audio'
                      ? { background: 'var(--accent-gradient)', boxShadow: '0 6px 30px rgba(255,30,168,0.28)' }
                      : undefined}
                  >
                    <Music size={16} />
                    Audio
                  </Button>
                </ButtonGroup>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                aria-label="Toggle menu"
                onClick={() => setOpen(!open)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-full text-foreground hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {open ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Mobile Search Bar (compact & snug) */}
            <div className="md:hidden mt-4 px-3 pb-2 w-full z-50">
              <div className="w-full">
                <Search compact />
              </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {open && (
              <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-lg rounded-b-3xl z-50">
                <div className="px-4 py-4 space-y-3">
                  <ButtonGroup className="w-full">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => { setMode('video'); setOpen(false) }}
                      className={`flex-1 rounded-full px-4 py-2.5 flex items-center justify-center gap-2 ${mode === 'video'
                        ? 'text-white ring-1'
                        : 'bg-accent/10 text-accent hover:bg-accent/20'
                        }`}
                      style={mode === 'video'
                        ? { background: 'var(--accent-gradient)', boxShadow: '0 6px 30px rgba(255,30,168,0.28)' }
                        : undefined}
                    >
                      <Video size={16} />
                      Video
                    </Button>
                    <ButtonGroupSeparator />
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => { setMode('audio'); setOpen(false) }}
                      className={`flex-1 rounded-full px-4 py-2.5 flex items-center justify-center gap-2 ${mode === 'audio'
                        ? 'text-white ring-1'
                        : 'bg-accent/10 text-accent hover:bg-accent/20'
                        }`}
                      style={mode === 'audio'
                        ? { background: 'var(--accent-gradient)', boxShadow: '0 6px 30px rgba(255,30,168,0.28)' }
                        : undefined}
                    >
                      <Music size={16} />
                      Audio
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
