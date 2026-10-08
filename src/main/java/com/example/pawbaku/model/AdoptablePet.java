package com.example.pawbaku.model;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** An animal looking for a new home, shown on the adoption page. */
@Entity
@Table(name = "adoptable_pets")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AdoptablePet {

    public enum PetStatus {
        AVAILABLE,
        ADOPTED,
        ARCHIVED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 120)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "species", nullable = false, length = 10)
    private Animal.Species species;

    @Column(name = "breed", length = 80)
    private String breed;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false, length = 20)
    @Builder.Default
    private Animal.Gender gender = Animal.Gender.UNKNOWN;

    @Column(name = "age_months")
    private Integer ageMonths;

    @Enumerated(EnumType.STRING)
    @Column(name = "size", length = 20)
    private Animal.Size size;

    @Column(name = "color", length = 60)
    private String color;

    @Column(name = "about", length = 1200)
    private String about;

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private PetStatus status = PetStatus.AVAILABLE;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = Instant.now();
        }
    }
}