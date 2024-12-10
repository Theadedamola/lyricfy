import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  const baseStyles =
    'px-4 py-2 rounded-2xl font-medium transition-all duration-200 flex items-center justify-center border border-[#090909] shadow-[3px_4px_0px_rgba(0,0,0)]'
  const variants = {
    primary: 'bg-purple-600 text-white hover:bg-purple-800',
    secondary:
      'bg-white text-[#090909] hover:bg-gray-100',
    ghost: 'bg-transparent hover:bg-gray-100',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
