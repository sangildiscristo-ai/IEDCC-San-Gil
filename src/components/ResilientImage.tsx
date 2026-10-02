import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle = 'Iglesia Discípulos de Cristo de San Gil',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white p-8 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <BookOpen className="w-10 h-10 text-blue-400 mb-3 opacity-80" />
        <p className="font-serif text-lg font-medium text-white/90 max-w-xs">
          {fallbackTitle}
        </p>
        <span className="text-xs text-blue-200/70 mt-1">
          San Gil · Villa Olímpica
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
