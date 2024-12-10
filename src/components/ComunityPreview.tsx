import { motion } from 'framer-motion'
import { Download, Heart, PenToolIcon } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getLyrics, toggleLike, getBackgroundImage } from '../lib/api'
import { title } from 'framer-motion/client'
import { Button } from '../components/ui/Button'
import { Link } from 'react-router-dom'
// import type { Lyric } from '../types'

export const CommunityPreview = () => {
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
    <div className="w-full space-y-8 py-32 px-6 md:px-10 lg:px-16 flex flex-col items-center justify-center">
      <motion.h1
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.1 }}
        transition={{ duration: 0.5 }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        className="font-semibold text-center w-full max-w-[700px]"
      >
        <span className="font-cehua text-red-600">Feel</span> what other{' '}
        <span className="font-cehua text-purple-600">creators</span> are{' '}
        <span className="font-cehua text-teal-700">making</span>
      </motion.h1>
      <Link to="/dashboard" className="">
        <Button className="gap-2">
          <PenToolIcon className="w-4 h-4" />
          <span className="text-sm">Start Creating</span>
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lyrics.slice(0, 12).map((lyric, index) => (
          <motion.div
            key={lyric.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.1 }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="w-80 h-80 relative">
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
                variant="secondary"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Image
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
      <Link to="/dashboard" className="">
        <Button className="gap-2">
          <PenToolIcon className="w-4 h-4" />
          <span className="text-sm">Start Creating</span>
        </Button>
      </Link>
    </div>
  )
}
