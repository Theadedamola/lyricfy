import React from 'react';
import { motion } from 'framer-motion';
import type { GradientType } from '../types';

interface GradientSelectorProps {
  onSelect: (gradient: GradientType) => void;
  selected: GradientType | undefined;
}

const gradients: Record<GradientType, string> = {
  mesh1: 'bg-gradient-to-r from-purple-500 to-pink-500',
  mesh2: 'bg-gradient-to-r from-blue-500 to-teal-500',
  mesh3: 'bg-gradient-to-r from-orange-500 to-red-500',
  mesh4: 'bg-gradient-to-r from-green-500 to-emerald-500'
};

export const GradientSelector: React.FC<GradientSelectorProps> = ({ onSelect, selected }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {(Object.keys(gradients) as GradientType[]).map((gradient) => (
        <motion.button
          key={gradient}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(gradient)}
          className={`h-20 rounded-lg ${gradients[gradient]} 
            ${selected === gradient ? 'ring-2 ring-[#090909]' : ''}`}
        />
      ))}
    </div>
  );
};