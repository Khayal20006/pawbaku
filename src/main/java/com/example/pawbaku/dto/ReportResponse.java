package com.example.pawbaku.dto;

import java.time.Instant;
import java.util.List;

import com.example.pawbaku.model.Animal;
import com.example.pawbaku.model.Report;
import com.example.pawbaku.model.ReportEvent;

/** A street-animal report with its people and full audit trail. */
public record ReportResponse(
        Long id,
        String title,
        String description,
        Animal.Species species,
        Report.Status status,
        String district,
        String address,
        Double latitude,
        Double longitude,
        String photoUrl,
        AuthResponse.UserResponse reporter,
        AuthResponse.UserResponse verifiedBy,
        AuthResponse.UserResponse volunteer,
        AuthResponse.UserResponse vet,
        Instant createdAt,
        Instant updatedAt,
        List<Event> events) {

    public static ReportResponse of(Report report, List<ReportEvent> events) {
        List<Event> eventViews = events == null ? List.of() : events.stream().map(Event::of).toList();
        return new ReportResponse(
                report.getId(),
                report.getTitle(),
                report.getDescription(),
                report.getSpecies(),
                report.getStatus(),
                report.getDistrict(),
                report.getAddress(),
                report.getLatitude(),
                report.getLongitude(),
                report.getPhotoUrl(),
                AuthResponse.UserResponse.of(report.getReporter()),
                report.getVerifiedBy() == null ? null : AuthResponse.UserResponse.of(report.getVerifiedBy()),
                report.getVolunteer() == null ? null : AuthResponse.UserResponse.of(report.getVolunteer()),
                report.getVet() == null ? null : AuthResponse.UserResponse.of(report.getVet()),
                report.getCreatedAt(),
                report.getUpdatedAt(),
                eventViews);
    }

    /** One immutable audit row. */
    public record Event(
            Long id,
            Report.Status fromStatus,
            Report.Status toStatus,
            String actor,
            String note,
            Instant createdAt) {

        public static Event of(ReportEvent event) {
            return new Event(
                    event.getId(),
                    event.getFromStatus(),
                    event.getToStatus(),
                    event.getActor() == null ? null : event.getActor().getDisplayName(),
                    event.getNote(),
                    event.getCreatedAt());
        }
    }
}