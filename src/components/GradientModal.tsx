import React from 'react'
import { GradientSelector } from './GradientSelector'
import type { GradientType } from '../types'

interface GradientModalProps {
  show: boolean
  gradientType?: GradientType
  onSelect: (type: GradientType) => void
}

export const GradientModal: React.FC<GradientModalProps> = ({
  show,
  gradientType,
  onSelect,
}) => {
  if (!show) return null

  return (
    <div className="absolute top-24 right-40 w-64 h-72 bg-white p-4 rounded-lg shadow-lg z-20">
      <h3 className="text-sm font-medium mb-2">Select Gradient</h3>
      <GradientSelector selected={gradientType} onSelect={onSelect} />
    </div>
  )
}
