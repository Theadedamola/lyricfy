import React from 'react';

interface ImagePreviewProps {
  url: string | undefined;
  onClear: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ url, onClear }) => {
  if (!url) return null;

  return (
    <div className="relative inline-block">
      <img
        src={url}
        alt="Preview"
        className="w-[60px] h-[60px] rounded-lg object-cover"
      />
      <button
        onClick={onClear}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm"
      >
        ×
      </button>
    </div>
  );
};