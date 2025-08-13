import { ModeToggle } from '@/components/modeToggle'
import PalettePreview from '@/components/palettePreview'
import React from 'react'

const page = () => {
  return (
    <div>
      <ModeToggle/>
      <PalettePreview />
    </div>
  )
}

export default page