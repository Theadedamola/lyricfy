import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        className={`px-4 py-3 rounded-2xl border border-gray-300 focus:border-[#090909] 
          focus:ring-1 focus:ring-[#090909] outline-none transition-all duration-200 ${className}`}
        {...props}
      />
    </div>
  );
};