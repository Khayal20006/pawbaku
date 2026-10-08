export type Role = 'CITIZEN' | 'VOLUNTEER' | 'SHELTER_STAFF' | 'VET' | 'MODERATOR' | 'ADMIN'

export type AnimalSpecies = 'DOG' | 'CAT' | 'OTHER'
export type AnimalSize = 'SMALL' | 'MEDIUM' | 'LARGE'
export type AnimalGender = 'MALE' | 'FEMALE' | 'UNKNOWN'

export type ListingKind = 'LOST' | 'FOUND'
export type ListingStatus = 'ACTIVE' | 'MATCHED' | 'CLOSED' | 'EXPIRED' | 'REOPENED'
export type ReportStatus = 'REPORTED' | 'VERIFIED' | 'VOLUNTEER_ASSIGNED' | 'VET_CARE' | 'RESOLVED'

export interface User {
  id: number
  username: string
  email: string
  fullName: string | null
  phoneNumber: string | null
  role: Role
  active: boolean
  createdAt: string
}

export interface AuthResponse {
  accessToken: string
  tokenType: string
  expiresInSeconds: number
  user: User
}

/** Animal profile as returned by the backend. */
export interface AnimalDto {
  id: number
  name: string | null
  species: AnimalSpecies
  breed: string | null
  color: string | null
  size: AnimalSize | null
  gender: AnimalGender
  ageMonths: number | null
  photoUrl: string | null
  notes: string | null
  createdAt: string
}

/** İtkin / Tapılmış elanı as returned by the backend. */
export interface ListingDto {
  id: number
  kind: ListingKind
  status: ListingStatus
  latitude: number
  longitude: number
  district: string | null
  address: string | null
  description: string | null
  createdAt: string
  createdBy: User
  animal: AnimalDto
  matchScore: number
}

export interface ListingInput {
  kind: ListingKind
  latitude: number
  longitude: number
  district: string
  address: string
  description?: string
  animal: {
    name?: string
    species: AnimalSpecies
    breed?: string
    color?: string
    size?: AnimalSize
    gender?: AnimalGender
    ageMonths?: number
    photoUrl?: string
  }
}

/** Street-animal help report as returned by the backend feed/tracker. */
export interface ReportDto {
  id: number
  title: string
  description: string
  species: AnimalSpecies
  status: ReportStatus
  district: string
  address: string | null
  latitude: number | null
  longitude: number | null
  photoUrl: string | null
  reporter: User
  verifiedBy: User | null
  volunteer: User | null
  vet: User | null
  createdAt: string
  updatedAt: string
}

export interface ReportInput {
  title: string
  description: string
  species: AnimalSpecies
  district: string
  address?: string
  latitude?: number
  longitude?: number
  photoUrl?: string
}

/** Stable paged envelope shared by every list endpoint. */
export interface Page<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

export interface ApiErrorBody {
  timestamp?: string
  status: number
  error?: string
  message: string
  path?: string
  details?: string[]
}

export interface LoginInput {
  username: string
  password: string
}

export interface RegisterInput {
  username: string
  email: string
  password: string
  fullName?: string
  phoneNumber?: string
}

export interface UserUpdateInput {
  email?: string
  fullName?: string
  phoneNumber?: string
  role?: Role
  active?: boolean
}

export type PetStatus = 'AVAILABLE' | 'ADOPTED' | 'ARCHIVED'
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

/** Adoptable pet as returned by the backend. */
export interface PetDto {
  id: number
  name: string
  species: AnimalSpecies
  breed: string | null
  gender: AnimalGender
  ageMonths: number | null
  size: AnimalSize | null
  color: string | null
  about: string | null
  photoUrl: string | null
  status: PetStatus
  createdAt: string
  createdBy: { id: number; username: string; fullName: string | null }
}

export interface PetInput {
  name: string
  species: AnimalSpecies
  breed?: string
  gender?: AnimalGender
  ageMonths?: number
  size?: AnimalSize
  color?: string
  about?: string
  photoUrl?: string
}

/** Adoption application as returned by the backend. */
export interface ApplicationDto {
  id: number
  petId: number
  petName: string
  message: string | null
  status: ApplicationStatus
  createdAt: string
  applicant: { id: number; username: string; fullName: string | null }
}

export interface HealthDto {
  status: string
}