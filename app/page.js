'use client'

import MotionPortfolio from '@/components/MotionPortfolio'
import AiAgent from '@/components/agent/AiAgent'
import AudioTour from '@/components/agent/AudioTour'
import SmoothScroll from '@/components/SmoothScroll'

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <MotionPortfolio />

      {/* Audio résumé tour (opens on the Audio-tour button) */}
      <AudioTour />

      {/* Floating AI assistant — answers questions about my background */}
      <AiAgent />
    </>
  )
}
