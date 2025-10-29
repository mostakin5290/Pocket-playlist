import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group"
import { Video, Music } from 'lucide-react'

const Header = () => {
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full bg-background text-foreground shadow-xl backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center shadow-md">
                <span className="text-primary-foreground font-bold">L</span>
              </div>
              <span className="font-semibold text-lg">Pocket Playlist</span>
            </a>
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4">
            <ButtonGroup>
              <Button variant="default" size="sm" className="rounded-full shadow-md transform-gpu hover:scale-105 px-4 flex items-center gap-2">
                <Video size={16} />
                Video
              </Button>
              <ButtonGroupSeparator />
              <Button variant="default" size="sm" className="rounded-full shadow-md transform-gpu hover:scale-105 px-4 flex items-center gap-2">
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
        <div className="md:hidden bg-background border-t border-border shadow-lg">
          <div className="px-4 pt-4 pb-6 space-y-3">

            <div>
              <ButtonGroup>
                <Button variant="default" size="sm" className="rounded-full shadow-md px-4 flex items-center gap-2">
                  <Video size={14} />
                  Video
                </Button>
                <ButtonGroupSeparator />
                <Button variant="default" size="sm" className="rounded-full shadow-md px-4 flex items-center gap-2">
                  <Music size={14} />
                  Audio
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
