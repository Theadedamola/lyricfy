import { motion } from 'framer-motion'
import { Download, Heart } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getLyrics, toggleLike, getBackgroundImage } from '../lib/api'
import { title } from 'framer-motion/client'
import { Button } from '../components/ui/Button'
// import type { Lyric } from '../types'

export const Community = () => {
  const queryClient = useQueryClient()

  const { data: lyrics = [], isLoading } = useQuery({
    queryKey: ['lyrics'],
    queryFn: async () => {
      const fetchedLyrics = await getLyrics()

      // Fetch background images if needed
      const lyricWithImages = await Promise.all(
        fetchedLyrics.map(async (lyric) => {
          if (lyric.backgroundUrl) {
            const imageUrl = await getBackgroundImage(lyric.backgroundUrl)
            return { ...lyric, backgroundUrl: imageUrl }
          }
          return lyric
        })
      )

      return lyricWithImages
    },
  })

  const likeMutation = useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lyrics'] })
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    )
  }

  const handleDownload = async (backgroundUrl: string | null | undefined) => {
    if (backgroundUrl) {
      try {
        const imageUrl = await getBackgroundImage(backgroundUrl) // Fetch the image URL from storage
        if (imageUrl) {
          const link = document.createElement('a')
          link.href = imageUrl // Use the fetched image URL
          link.setAttribute('download', `${title || 'lyrics'}-background.png`) // Set the download filename
          document.body.appendChild(link)
          link.click() // Trigger the download
          document.body.removeChild(link) // Clean up the link element
        } else {
          console.error('Image URL could not be fetched.')
        }
      } catch (error) {
        console.error('Error fetching image for download:', error)
      }
    } else {
      console.error('No background URL provided for download.')
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Community Creations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lyrics.map((lyric, index) => (
          <motion.div
            key={lyric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="aspect-[4/4] relative">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: lyric.backgroundUrl
                    ? `url(${lyric.backgroundUrl})`
                    : lyric.gradientType === 'mesh1'
                    ? 'linear-gradient(to right, #8B5CF6, #EC4899)'
                    : undefined,
                }}
              >
                {/* <div className="absolute inset-0 backdrop-blur-sm bg-black/30" /> */}
                <div className="relative z-10 h-full p-6 flex flex-col">
                  {/* <h3 className="text-xl font-bold text-white">
                    {lyric.title}
                  </h3>
                  <p className="text-white/80">{lyric.artist}</p>
                  <p className="mt-4 text-white">{lyric.lyrics}</p> */}
                  <p className="mt-auto text-white/70 text-sm">
                    Created by {lyric.creatorName}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 flex justify-between items-center">
              <div className="flex gap-4">
                <button
                  className="flex items-center gap-1 text-gray-600 hover:text-red-500"
                  onClick={() => likeMutation.mutate(lyric.id)}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      lyric.likes ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                  <span>{lyric.likes || 0}</span>
                </button>
              </div>
              <Button
                onClick={() => handleDownload(lyric.backgroundUrl)}
                disabled={!lyric.backgroundUrl}
                className="flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Image
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
