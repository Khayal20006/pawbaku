package com.example.pawbaku.dto;

import java.time.Instant;

import com.example.pawbaku.model.Animal;
import com.example.pawbaku.model.Listing;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Body for {@code POST /api/listings}. */
public record ListingRequest(
        @NotNull(message = "Elan növü (İtkin/Tapılmış) tələb olunur") Listing.Kind kind,
        @NotNull(message = "En dairəsi tələb olunur") Double latitude,
        @NotNull(message = "Uzunluq dairəsi tələb olunur") Double longitude,
        @NotBlank(message = "Rayon tələb olunur") String district,
        @Size(max = 300, message = "Ünvan ən çox 300 simvol ola bilər") String address,
        @Size(max = 4000, message = "Təsvir ən çox 4000 simvol ola bilər") String description,
        @Valid @NotNull(message = "Heyvan məlumatları tələb olunur") AnimalInput animal) {

    /** Flattened animal block so callers post one object instead of two requests. */
    public record AnimalInput(
            @Size(max = 80, message = "Ad ən çox 80 simvol ola bilər") String name,
            @NotNull(message = "Heyvan növü tələb olunur") Animal.Species species,
            @Size(max = 80, message = "Cins ən çox 80 simvol ola bilər") String breed,
            @Size(max = 60, message = "Rəng ən çox 60 simvol ola bilər") String color,
            Animal.Size size,
            Animal.Gender gender,
            Integer ageMonths,
            @Size(max = 500, message = "Şəkil URL-i ən çox 500 simvol ola bilər") String photoUrl) {
    }
}