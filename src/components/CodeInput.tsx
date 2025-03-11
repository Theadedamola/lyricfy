import React from 'react'
import { motion } from 'framer-motion'

// Character limit for the code editor
const MAX_CHARS = 500

interface CodeInputProps {
  code: string
  setCode: (code: string) => void
}

export const CodeInput: React.FC<CodeInputProps> = ({ code, setCode }) => {
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value
    if (newCode.length <= MAX_CHARS) {
      setCode(newCode)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col justify-end w-full h-64 ml-auto" // Reduced width and positioned at the end
    >
      <div className="flex flex-col gap-2 flex-1">
        <div className="rounded-2xl overflow-hidden flex-1 border border-gray-100 bg-gray-50/70 shadow-[0px_6px_40px_rgba(0,0,0,0.04)]">
          <textarea
            value={code}
            onChange={handleCodeChange}
            placeholder="Paste your code here (max 500 characters)"
            className="px-4 py-2 h-full w-full font-mono text-sm bg-transparent
              focus:border-[#090909] focus:ring-1 focus:ring-[#090909] outline-none transition-all duration-200"
            maxLength={MAX_CHARS}
          />
        </div>
        <div className="text-xs text-gray-500 text-right">
          {code.length}/{MAX_CHARS} characters
        </div>
      </div>
    </motion.div>
  )
}
