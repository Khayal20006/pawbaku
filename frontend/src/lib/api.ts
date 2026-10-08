import axios, { AxiosError } from 'axios'
import type { ApiErrorBody, ListingDto, Page, ReportDto, ReportInput, ReportStatus } from './types'

const TOKEN_KEY = 'pawbaku.token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

/** Thrown for every failed request so callers only deal with one error shape. */
export class ApiError extends Error {
  readonly status: number
  readonly details: string[]

  constructor(message: string, status: number, details: string[] = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

/**
 * In development the Vite proxy forwards /api to Spring Boot, so an empty base URL keeps the
 * browser on a single origin. Set VITE_API_BASE_URL when the API lives somewhere else.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: { Accept: 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const status = error.response?.status ?? 0
    const body = error.response?.data

    if (status === 401) {
      // The token expired or was revoked: drop it and bounce to the login screen.
      setToken(null)
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login')
      }
      return Promise.reject(new ApiError('Sessiya sona çatdı. Yenidən daxil olun.', status))
    }

    if (body?.message) {
      return Promise.reject(new ApiError(body.message, status, body.details ?? []))
    }

    if (error.code === 'ERR_NETWORK') {
      return Promise.reject(new ApiError('Serverə qoşulma mümkün deyil.', 0))
    }

    return Promise.reject(new ApiError('Gözlənilməz xəta baş verdi.', status || 500))
  },
)

/* ------------------------------------------------------------------ resource endpoints */

export interface ListingQuery {
  status?: string
  district?: string
  species?: string
}

/** Public feed of lost/found listings, newest first. */
export async function fetchListings(query: ListingQuery = {}): Promise<ListingDto[]> {
  const { data } = await api.get<Page<ListingDto>>('/api/listings', {
    params: { size: 200, ...query },
  })
  return data.content
}

/** Public feed of street-animal help reports, newest first. */
export async function fetchReports(): Promise<ReportDto[]> {
  const { data } = await api.get<ReportDto[]>('/api/reports')
  return data
}

export async function fetchReport(id: number | string): Promise<ReportDto> {
  const { data } = await api.get<ReportDto>(`/api/reports/${id}`)
  return data
}

/** Creating a report requires an authenticated account (POST is behind the JWT). */
export async function createReport(input: ReportInput): Promise<ReportDto> {
  const { data } = await api.post<ReportDto>('/api/reports', input)
  return data
}

/** Move a report to its next lifecycle step; the backend enforces roles and ordering. */
export async function advanceReportStatus(
  id: number | string,
  status: ReportStatus,
  note?: string,
): Promise<ReportDto> {
  const { data } = await api.patch<ReportDto>(`/api/reports/${id}/status`, { status, note })
  return data
}