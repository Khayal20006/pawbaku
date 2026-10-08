package com.example.pawbaku.dto;

import java.time.Instant;

import com.example.pawbaku.model.Listing;
import com.example.pawbaku.service.MatchService.Match;

/** İtkin / Tapılmış elanı + heyvan profili + hesablanmış uyğunluq balı. */
public record ListingResponse(
        Long id,
        Listing.Kind kind,
        Listing.Status status,
        double latitude,
        double longitude,
        String district,
        String address,
        String description,
        Instant createdAt,
        AuthResponse.UserResponse createdBy,
        AnimalResponse animal,
        int matchScore,
        Long matchListingId,
        String matchListingName) {

    public static ListingResponse of(Listing listing, Match match) {
        return new ListingResponse(
                listing.getId(),
                listing.getKind(),
                listing.getStatus(),
                listing.getLatitude(),
                listing.getLongitude(),
                listing.getDistrict(),
                listing.getAddress(),
                listing.getDescription(),
                listing.getCreatedAt(),
                AuthResponse.UserResponse.of(listing.getCreatedBy()),
                AnimalResponse.of(listing.getAnimal()),
                match == null ? 0 : match.score(),
                match == null ? null : match.listingId(),
                match == null ? null : match.listingName());
    }
}