'use client'

import PortfolioSite from '@/components/PortfolioSite'
import AiAgent from '@/components/agent/AiAgent'
import AudioTour from '@/components/agent/AudioTour'
import MagneticCursor from '@/components/MagneticCursor'

export default function Home() {
  return (
    <>
      <MagneticCursor />
      <PortfolioSite />

      {/* Audio résumé tour (opens on the Audio-tour button) */}
      <AudioTour />

      {/* Floating AI assistant — answers questions about my background */}
      <AiAgent />
    </>
  )
}
