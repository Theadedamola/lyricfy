import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { GradientType } from '../types'
import { ArtistAvatar } from './Avatar'

interface LyricDisplayProps {
  title: string
  artist: string
  lyrics: string
  backgroundUrl?: string
  gradientType?: GradientType
}

export const LyricDisplay: React.FC<LyricDisplayProps> = ({
  title,
  artist,
  lyrics,
  backgroundUrl,
  gradientType,
}) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [isGradient, setIsGradient] = useState(false)

  useEffect(() => {
    setIsGradient(!!gradientType)

    // If a background URL is provided, preload the image
    if (backgroundUrl) {
      const img = new Image()
      img.src = backgroundUrl
      img.onload = () => {
        // Create a canvas to draw the blurred background
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (ctx) {
          // Set canvas size to match the image
          canvas.width = img.width
          canvas.height = img.height

          // Draw the original image
          ctx.drawImage(img, 0, 0, img.width, img.height)

          // Apply a blur effect (this is a simple blur, you might want a more sophisticated approach)
          ctx.filter = 'blur(20px)'
          ctx.drawImage(img, 0, 0, img.width, img.height)

          // Convert the canvas to a data URL
          setBackgroundImage(canvas.toDataURL())
        }
      }
    }
  }, [backgroundUrl, gradientType])

  const gradients: Record<GradientType, string> = {
    mesh1: 'linear-gradient(to right, #6b46c1, #d53f8c)',
    mesh2: 'linear-gradient(to right, #4299e1, #38b2ac)',
    mesh3: 'linear-gradient(to right, #ed8936, #f56565)',
    mesh4: 'linear-gradient(to right, #48bb78, #34d399)',
  }

  const getBackgroundStyle = () => {
    if (backgroundImage) {
      return {
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    }

    return {
      background: gradientType
        ? gradients[gradientType]
        : 'linear-gradient(to right, #4c51bf, #805ad5)',
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={getBackgroundStyle()}
      className="relative w-full max-w-2xl aspect-[4/4] overflow-hidden"
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-black/30" />

      {/* Content */}
      <div className="relative z-10 h-full p-8 pt-10 flex flex-col">
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex gap-4 items-center">
            <ArtistAvatar
              artist={artist}
              backgroundUrl={backgroundUrl}
              gradientType={gradientType}
              isGradient={isGradient}
            />
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <p className="text-lg text-white/60">{artist}</p>
            </div>
          </div>
          <p className="text-5xl w-full font-bold text-wrap leading-snug text-white whitespace-pre-line">
            {lyrics}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
