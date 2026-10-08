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

/**
 * A concrete animal that appears in listings and adoption profiles. Listings reference
 * the same animal (once for LOST, once for FOUND) so the matcher can pair them.
 */
@Entity
@Table(name = "animals")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Animal {

    public enum Species {
        DOG,
        CAT,
        OTHER
    }

    public enum Size {
        SMALL,
        MEDIUM,
        LARGE
    }

    public enum Gender {
        MALE,
        FEMALE,
        UNKNOWN
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", length = 80)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "species", nullable = false, length = 30)
    private Species species;

    @Column(name = "breed", length = 80)
    private String breed;

    @Column(name = "color", length = 60)
    private String color;

    @Enumerated(EnumType.STRING)
    @Column(name = "size", length = 20)
    private Size size;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false, length = 20)
    @Builder.Default
    private Gender gender = Gender.UNKNOWN;

    @Column(name = "age_months")
    private Integer ageMonths;

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Column(name = "notes", length = 1000)
    private String notes;

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