import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { GradientType } from '../types'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

// Character limit for the code editor
const MAX_CHARS = 500

interface CodeDisplayProps {
  code: string
  setCode: (code: string) => void
  language: string
  backgroundUrl?: string
  gradientType?: GradientType
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({
  code,
  setCode,
  language,
  backgroundUrl,
  gradientType,
}) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [, setIsGradient] = useState(false)

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

          // Apply a blur effect
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
      className="relative w-full max-w-3xl aspect-[1/1] py-10 px-14 overflow-hidden flex items-center justify-center"
    >
      {/* Code editor window with its own background */}
      <div className="relative z-10 h-fit w-[90%] flex flex-col rounded-2xl overflow-hidden shadow-xl">
        {/* Editor title bar */}
        <div className="bg-[#1e1e1e] px-4 py-2 flex items-center">
          {/* Window controls */}
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>

          {/* File name tab */}
          <div className="ml-4 px-3 py-1 bg-[#2d2d2d] rounded-md text-white text-xs">
            {language.toLowerCase()}.
            {language === 'javascript'
              ? 'js'
              : language === 'typescript'
              ? 'ts'
              : language === 'python'
              ? 'py'
              : language === 'html'
              ? 'html'
              : language === 'css'
              ? 'css'
              : 'txt'}
          </div>
        </div>

        {/* Editor content area - Now with editable textarea */}
        <div className="flex-1 bg-[#1e1e1e] p-4 flex flex-col">
          {/* Line numbers and code */}
          <div className="font-mono text-sm md:text-base flex flex-1">
            {/* Line numbers */}
            <div className="text-gray-500 pr-4 select-none text-right">
              {code.split('\n').map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
              {!code && <div>1</div>}
            </div>

            {/* Code content - Now with syntax highlighting */}
            <div className="flex-1 relative">
              {/* Hidden textarea for editing */}
              <textarea
                value={code}
                onChange={(e) => {
                  const newCode = e.target.value
                  if (newCode.length <= MAX_CHARS) {
                    setCode(newCode)
                  }
                }}
                placeholder="// put your code here (max 500 characters)"
                className="absolute inset-0 bg-transparent border-none outline-none resize-none
                  font-mono text-white w-full h-full text-sm md:text-base whitespace-pre-wrap
                  opacity-30 z-10"
                maxLength={MAX_CHARS}
              />

              {/* Syntax highlighted code display */}
              <div className="absolute inset-0 overflow-auto pointer-events-none">
                <SyntaxHighlighter
                  language={language.toLowerCase()}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: 0,
                    background: 'transparent',
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    minHeight: '100%',
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: 'inherit',
                    },
                  }}
                >
                  {code || '// put your code here (max 500 characters)'}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>

          {/* Character counter */}
          <div className="text-xs text-gray-500 text-right mt-2">
            {code.length}/{MAX_CHARS} characters
          </div>
        </div>
      </div>
    </motion.div>
  )
}
