import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { toPng } from 'html-to-image'
import type { GradientType } from '../types'
import { CodeDisplay } from '../components/CodeDisplay'
import { CodeToolbar } from '../components/CodeToolbar'
import { CodeInput } from '../components/CodeInput'
import { GradientModal } from '../components/GradientModal'


export const CodeBeautify: React.FC = () => {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [backgroundUrl, setBackgroundUrl] = useState<string | undefined>()
  const [gradientType, setGradientType] = useState<GradientType | undefined>()
  const [showGradientModal, setShowGradientModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    const element = document.getElementById('code-display')
    if (element) {
      const dataUrl = await toPng(element)
      const link = document.createElement('a')
      link.download = `${language || 'code'}-snippet.png`
      link.href = dataUrl
      link.click()
    }
  }
  
  const handleGradientSelect = (type: GradientType) => {
    setGradientType(type)
    setBackgroundUrl(undefined)
    setShowGradientModal(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Top toolbar */}
      <CodeToolbar
        language={language}
        setLanguage={setLanguage}
        showGradientModal={showGradientModal}
        setShowGradientModal={setShowGradientModal}
        fileInputRef={fileInputRef}
        handleImageUpload={handleImageUpload}
        handleDownload={handleDownload}
      />
      
      {/* Gradient modal */}
      <GradientModal
        show={showGradientModal}
        gradientType={gradientType}
        onSelect={handleGradientSelect}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 items-center justify-center">
        {/* Code input */}
        <div className="h-full pt-72 flex items-end">
          <CodeInput code={code} setCode={setCode} />
        </div>
      
        {/* Code display */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-center justify-center"
        >
          <div id="code-display" className="flex-1">
            <CodeDisplay
              code={code || '// Your code will appear here'}
              language={language}
              backgroundUrl={backgroundUrl}
              gradientType={gradientType}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CodeBeautify
