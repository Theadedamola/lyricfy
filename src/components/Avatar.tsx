import React, { useEffect, useState } from 'react'
import type { GradientType } from '../types'

interface ArtistAvatarProps {
  artist: string
  backgroundUrl?: string
  gradientType?: GradientType
  isGradient?: boolean
}

export const ArtistAvatar: React.FC<ArtistAvatarProps> = ({
  artist,
  backgroundUrl,
  gradientType,
  isGradient = false,
}) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)

  const gradients: Record<GradientType, string> = {
    mesh1: 'linear-gradient(to right, #6b46c1, #d53f8c)',
    mesh2: 'linear-gradient(to right, #4299e1, #38b2ac)',
    mesh3: 'linear-gradient(to right, #ed8936, #f56565)',
    mesh4: 'linear-gradient(to right, #48bb78, #34d399)',
  }

  const getBackgroundStyle = () => {
    if (backgroundUrl) {
      return {
        backgroundImage: `url('${backgroundImage || backgroundUrl}')`,
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

  useEffect(() => {
    // Preload image if background URL is provided
    if (backgroundUrl) {
      const img = new Image()
      img.src = backgroundUrl
      img.onload = () => {
        setBackgroundImage(backgroundUrl)
      }
    }
  }, [backgroundUrl])

  return (
    <div
      className="w-16 h-16 rounded-xl shadow-md flex items-center justify-center"
      style={getBackgroundStyle()}
    >
      {isGradient && (
        <p className="text-white font-bold text-3xl">{artist.slice(0, 1)}</p>
      )}
    </div>
  )
}
