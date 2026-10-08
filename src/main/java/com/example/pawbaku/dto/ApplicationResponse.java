package com.example.pawbaku.dto;

import com.example.pawbaku.model.AdoptionApplication;

/** Confirmation of an adoption application, tagged with the pet it targets. */
public record ApplicationResponse(
        Long id,
        Long petId,
        String petName,
        String message,
        AdoptionApplication.ApplicationStatus status,
        String createdAt,
        UserResponse applicant) {

    public record UserResponse(Long id, String username, String fullName) {
    }

    public static ApplicationResponse of(AdoptionApplication application) {
        return new ApplicationResponse(
                application.getId(),
                application.getPet().getId(),
                application.getPet().getName(),
                application.getMessage(),
                application.getStatus(),
                application.getCreatedAt() == null ? null : application.getCreatedAt().toString(),
                new UserResponse(application.getApplicant().getId(),
                        application.getApplicant().getUsername(),
                        application.getApplicant().getFullName()));
    }
}