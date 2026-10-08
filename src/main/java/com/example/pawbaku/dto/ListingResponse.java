package com.example.pawbaku.dto;

import java.time.Instant;

import com.example.pawbaku.model.Animal;
import com.example.pawbaku.model.Listing;

/** İtkin / Tapılmış elanı + hered profile, ready for the listings grid. */
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
        int matchScore) {

    public static ListingResponse of(Listing listing, int matchScore) {
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
                matchScore);
    }

    /** Deterministic 50-100 demo score so the grid looks alive until the real matcher lands. */
    public static int demoMatchScore(long listingId) {
        int value = 50 + (int) (Math.abs(listingId * 37L) % 51);
        return Math.min(100, value);
    }
}