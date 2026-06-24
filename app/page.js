'use client'

import { useState } from 'react'
import Navbar from '@/components/ui/Navbar'
import Journey3D from '@/components/journey/Journey3D'
import ScreenLoader from '@/components/sections/ScreenLoader'
import AiAgent from '@/components/agent/AiAgent'
import AudioTour from '@/components/agent/AudioTour'

export default function Home() {
  const [showLoader, setShowLoader] = useState(true)

  return (
    <>
      {showLoader && <ScreenLoader onDismiss={() => setShowLoader(false)} />}

      <Navbar />
      <Journey3D />

      {/* Audio résumé tour (opens on the Résumé button) */}
      <AudioTour />

      {/* Floating AI assistant (hidden during the intro loader) */}
      {!showLoader && <AiAgent />}
    </>
  )
}
