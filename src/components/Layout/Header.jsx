import React from 'react'
import { Button } from "@/components/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group"

const Header = () => {
  return (
    <div className='flex justify-center '>
      <div className='h-[10vh] w-[85vw] flex justify-between items-center'>
        <div>Pocket Playlist</div>
        <ButtonGroup>
      <Button variant="secondary" size="sm">
        Video
      </Button>
      <ButtonGroupSeparator />
      <Button variant="secondary" size="sm">
        Audio
      </Button>
    </ButtonGroup>
      </div>
    </div>
  )
}

export default Header
