import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8011'

export const apiEndpoints = {
  auth: {
    login: '/api/auth/login/',
    register: '/api/auth/register/',
    logout: '/api/auth/logout/',
    refresh: '/api/auth/refresh/',
    me: '/api/auth/me/',
  },
  tasks: {
    list: '/api/tasks/',
    create: '/api/tasks/',
    detail: (id: number) => `/api/tasks/${id}/`,
    update: (id: number) => `/api/tasks/${id}/`,
    patch: (id: number) => `/api/tasks/${id}/`,
    delete: (id: number) => `/api/tasks/${id}/`,
    complete: (id: number) => `/api/tasks/${id}/complete/`,
    pending: (id: number) => `/api/tasks/${id}/pending/`,
    toggle: (id: number) => `/api/tasks/${id}/toggle/`,
    stats: '/api/tasks/stats/',
  },
} as const
