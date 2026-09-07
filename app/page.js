'use client'

import MotionPortfolio from '@/components/MotionPortfolio'
import OpeningSequence from '@/components/cine/OpeningSequence'
import AiAgent from '@/components/agent/AiAgent'
import AudioTour from '@/components/agent/AudioTour'
import SmoothScroll from '@/components/SmoothScroll'

export default function Home() {
  return (
    <>
      <OpeningSequence />
      <SmoothScroll />
      <MotionPortfolio />

      {/* Audio résumé tour (opens on the Audio-tour button) */}
      <AudioTour />

      {/* Floating AI assistant — answers questions about my background */}
      <AiAgent />
    </>
  )
}
