import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProfileImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallback?: string;
}

// Helper para construir URL completa de arquivos do backend
const getFileUrl = (path: string | null | undefined): string => {
  if (!path) return '/placeholder.svg';
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) return path;
  // URLs relativas precisam do domínio do backend
  return `https://kuiddmais.com.br${path.startsWith('/') ? '' : '/'}${path}`;
};

export function ProfileImage({ src, alt, className, fallback = '/placeholder.svg' }: ProfileImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const imageUrl = hasError ? fallback : getFileUrl(src);
  
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
          <span className="text-muted-foreground text-xs">Carregando...</span>
        </div>
      )}
      <img
        src={imageUrl}
        alt={alt}
        className={cn("w-full h-full object-cover", isLoading && "opacity-0")}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}
