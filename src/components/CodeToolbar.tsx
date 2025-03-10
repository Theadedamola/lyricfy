import React from 'react'
import { Image, Palette, ChevronDown } from 'lucide-react'
import { Button } from './ui/Button'

// Language options
const languageOptions = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'swift', label: 'Swift' },
  { value: 'rust', label: 'Rust' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
]

interface ToolbarProps {
  language: string
  setLanguage: (lang: string) => void
  showGradientModal: boolean
  setShowGradientModal: (show: boolean) => void
  fileInputRef: React.RefObject<HTMLInputElement>
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleDownload: () => void
}

export const CodeToolbar: React.FC<ToolbarProps> = ({
  language,
  setLanguage,
  showGradientModal,
  setShowGradientModal,
  fileInputRef,
  handleImageUpload,
  handleDownload,
}) => {
  return (
    <div className="bg-white rounded-full mb-6 p-2 px-4 flex items-center justify-between shadow-[0px_6px_40px_rgba(0,0,0,0.12)]">
     

      {/* Middle - Language selector */}
      <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-transparent border-none focus:outline-none text-gray-700"
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* <ChevronDown size={16} className="ml-2 text-gray-500" /> */}
      </div>

      {/* Right side - Action buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowGradientModal(!showGradientModal)}
          className="bg-white p-2 rounded-full hover:bg-gray-100"
        >
          <Palette size={20} className="text-gray-700" />
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-white p-2 rounded-full hover:bg-gray-100"
        >
          <Image size={20} className="text-gray-700" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </button>

        <Button
          onClick={handleDownload}
          className="text-white px-4 py-2 rounded-full flex items-center gap-2"
        >
          <span>Download</span>
          <ChevronDown size={16} />
        </Button>
      </div>
    </div>
  )
}
