import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Helper para classes (Tailwind + clsx)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * URL base do backend
 * (produção ou localhost)
 */
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Monta URL completa para arquivos vindos do backend
 * Ex: /uploads/avatar.png -> https://kuiddmais.com.br/uploads/avatar.png
 */
export function getFileUrl(path?: string | null): string {
  if (!path) return "/placeholder.svg";

  // Já é URL completa ou base64
  if (path.startsWith("http") || path.startsWith("data:")) {
    return path;
  }

  // Garante barra inicial
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${API_URL}${normalizedPath}`;
}

/**
 * 🔥 Fallback GLOBAL (anti-crash)
 * Se algum arquivo usar getFileUrl sem importar,
 * isso evita o ReferenceError em produção.
 */
if (typeof window !== "undefined") {
  // @ts-ignore
  window.getFileUrl = getFileUrl;
}
