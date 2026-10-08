import { formatRelative } from './format'
import { toTrackerReport } from './reports'
import type { FeedItem, ListingCard } from './paw'
import type { ListingDto, ListingStatus, ReportDto } from './types'

function toListingStatus(status: ListingStatus): ListingCard['status'] {
  if (status === 'ACTIVE' || status === 'REOPENED') return 'ACTIVE'
  if (status === 'MATCHED') return 'MATCHED'
  return 'CLOSED'
}

export function listingDtoToCard(dto: ListingDto): ListingCard {
  const animal = dto.animal
  return {
    id: `L-${dto.id}`,
    numericId: dto.id,
    kind: dto.kind,
    status: toListingStatus(dto.status),
    animal: {
      name: animal.name?.trim() || 'Adsız dost',
      species: animal.species,
      breed: animal.breed?.trim() || 'Məlum deyil',
      color: animal.color?.trim() || '—',
      size: animal.size ?? 'MEDIUM',
      age: animal.ageMonths ?? 0,
      image: animal.photoUrl || '/hero-paw.jpg',
    },
    district: dto.district || '—',
    address: dto.address || '',
    eventTime: formatRelative(dto.createdAt),
    matchScore: dto.matchScore,
  }
}

export function reportDtoToFeedItem(dto: ReportDto): FeedItem {
  const tracker = toTrackerReport(dto)
  return {
    id: tracker.id,
    title: tracker.title,
    description: tracker.description,
    status: tracker.status,
    district: tracker.district,
    time: tracker.time,
    avatar: tracker.avatar,
    photo: dto.photoUrl,
  }
}