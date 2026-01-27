import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper para construir URL completa de arquivos do backend
export function getFileUrl(path: string | null | undefined): string {
  if (!path) return '/placeholder.svg';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  // URLs relativas precisam do domínio do backend
  return `https://kuiddmais.com.br${path.startsWith('/') ? '' : '/'}${path}`;
}
