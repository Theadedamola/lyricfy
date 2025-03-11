import React, { useState, useRef } from 'react'
// import { motion } from 'framer-motion'
import { toPng } from 'html-to-image'
import type { GradientType } from '../types'
import { CodeDisplay } from '../components/CodeDisplay'
import { CodeToolbar } from '../components/CodeToolbar'
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
      // Apply temporary styles to ensure proper centering and sizing for download
      const originalStyle = element.getAttribute('style') || ''

      // Get the CodeDisplay element (the child with the gradient background)
      const codeDisplayElement = element.querySelector('div[style]')
      if (codeDisplayElement) {
        // Store original styles
        const originalCodeDisplayStyle =
          codeDisplayElement.getAttribute('style') || ''

        // Modify the container to take full width
        element.style.width = '70%'
        element.style.maxWidth = 'none'
        element.style.padding = '0'
        element.style.margin = '0'
        element.style.display = 'flex'
        element.style.justifyContent = 'center'
        element.style.alignItems = 'center'
        element.style.borderRadius = '24px'

        // Generate the image
        const dataUrl = await toPng(element, {
          quality: 0.95,
          pixelRatio: 2,
        })

        // Restore original styles
        element.setAttribute('style', originalStyle)
        codeDisplayElement.setAttribute('style', originalCodeDisplayStyle)

        // Download the image
        const link = document.createElement('a')
        link.download = `${language || 'code'}-snippet.png`
        link.href = dataUrl
        link.click()
      }
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

      <div className="rounded-3xl flex-1 flex items-center justify-center">
        {/* Centered code editor */}
        <div
          id="code-display"
          className="w-full flex justify-center items-center"
        >
          <CodeDisplay
            code={code}
            setCode={setCode}
            language={language}
            backgroundUrl={backgroundUrl}
            gradientType={gradientType}
          />
        </div>
      </div>
    </div>
  )
}

export default CodeBeautify
