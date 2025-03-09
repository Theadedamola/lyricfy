import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Save } from 'lucide-react'
import { toPng } from 'html-to-image'
import { useMutation } from '@tanstack/react-query'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { GradientSelector } from '../components/GradientSelector'
import { LyricDisplay } from '../components/LyricDisplay'
import { ImagePreview } from '../components/ImagePreview'
import { SaveModal } from '../components/SaveModal'
import { saveLyric } from '../lib/api'
import type { GradientType, Lyric } from '../types'

export const Home: React.FC = () => {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [backgroundUrl, setBackgroundUrl] = useState<string | undefined>()
  const [gradientType, setGradientType] = useState<GradientType | undefined>()
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)

  const saveMutation = useMutation({
    mutationFn: async (creatorName: string) => {
      const element = document.getElementById('lyric-display')
      let imageDataUrl: string | undefined

      if (element) {
        imageDataUrl = await toPng(element)
      }

      const lyricData: Omit<Lyric, 'id' | 'createdAt' | 'likes' | 'userId'> = {
        title,
        artist,
        lyrics,
        backgroundUrl,
        gradientType,
        creatorName,
      }

      await saveLyric(lyricData, imageDataUrl)
    },
    onSuccess: () => {
      setIsSaveModalOpen(false)
      // Optional: Reset form or show success message
      setTitle('')
      setArtist('')
      setLyrics('')
      setBackgroundUrl(undefined)
      setGradientType(undefined)
    },
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          const compressedImage = await compressImage(reader.result as string)
          if (compressedImage) {
            setBackgroundUrl(compressedImage)
            setGradientType(undefined)
          } else {
            // Fallback if compression fails
            setBackgroundUrl(reader.result as string)
          }
        } catch (error) {
          console.error('Image compression failed', error)
          // Fallback to original image
          setBackgroundUrl(reader.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const compressImage = (
    dataUrl: string,
    maxSizeKB: number = 50
  ): Promise<string | null> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.src = dataUrl

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        // Determine scaling
        const MAX_WIDTH = 600
        const MAX_HEIGHT = 600
        let width = img.width
        let height = img.height

        // Scale down if larger than max dimensions
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height

        // Draw compressed image
        ctx?.drawImage(img, 0, 0, width, height)

        // Compress with reduced quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.5)

        // Check final size
        const sizeInKB = compressedDataUrl.length / 1024

        if (sizeInKB <= maxSizeKB) {
          resolve(compressedDataUrl)
        } else {
          // If still too large, return null to use fallback
          resolve(null)
        }
      }

      img.onerror = () => {
        resolve(null)
      }
    })
  }

  const handleDownload = async () => {
    const element = document.getElementById('lyric-display')
    if (element) {
      const dataUrl = await toPng(element)
      const link = document.createElement('a')
      link.download = `${title || 'lyrics'}-lyrics.png`
      link.href = dataUrl
      link.click()
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Input
            label="Song Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter song title"
          />

          <Input
            label="Artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Enter artist name"
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Lyrics</label>
            <textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Enter your favorite lyrics"
              className="px-4 py-2 h-40 rounded-2xl border border-gray-300 focus:border-[#090909] 
                focus:ring-1 focus:ring-[#090909] outline-none transition-all duration-200"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4"
        >
          <div id="lyric-display">
            <LyricDisplay
              title={title || 'Your Song Title'}
              artist={artist || 'Artist Name'}
              lyrics={lyrics || 'Your lyrics will appear here'}
              backgroundUrl={backgroundUrl}
              gradientType={gradientType}
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">
              Background
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:mb-4 file:py-2 file:px-4
                  file:rounded-2xl file:border
                  file:text-sm file:font-medium
                  file:bg-purple-600 file:text-white
                  hover:file:bg-purple-800 file:shadow-[3px_4px_0px_rgba(0,0,0)]"
              />
              <ImagePreview
                url={backgroundUrl}
                onClear={() => setBackgroundUrl(undefined)}
              />
            </div>
            <p className="text-sm text-gray-500">- or choose a gradient -</p>
            <GradientSelector
              selected={gradientType}
              onSelect={setGradientType}
            />
          </div>

          <div className="flex gap-4">
            <Button onClick={handleDownload} disabled={!title && !lyrics}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            {/* <Button variant="secondary">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button> */}
            <Button
              variant="secondary"
              onClick={() => setIsSaveModalOpen(true)}
              disabled={!title || !artist || !lyrics}
            >
              <Save className="w-4 h-4 mr-2" />
              Save to Community
            </Button>
          </div>
        </motion.div>
      </div>

      <SaveModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={(name) => saveMutation.mutate(name)}
        isLoading={saveMutation.isPending}
      />
    </div>
  )
}
