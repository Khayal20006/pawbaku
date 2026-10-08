package com.example.pawbaku.dto;

import com.example.pawbaku.model.AdoptionApplication.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

/** Review decision on a pending adoption application (PENDING itself is rejected server-side). */
public record ApplicationStatusRequest(
        @NotNull(message = "Status tələb olunur") ApplicationStatus status) {
}