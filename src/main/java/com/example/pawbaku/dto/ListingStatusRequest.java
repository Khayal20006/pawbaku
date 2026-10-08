package com.example.pawbaku.dto;

import com.example.pawbaku.model.Listing.Status;
import jakarta.validation.constraints.NotNull;

/** Listing lifecycle target — only CLOSED/REOPENED are actionable (ACTIVE/MATCHED set by the system). */
public record ListingStatusRequest(
        @NotNull(message = "Status tələb olunur") Status status) {
}