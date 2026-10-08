package com.example.pawbaku.dto;

import java.time.Instant;

import com.example.pawbaku.model.Animal;

/** Safe projection of an {@link Animal}. */
public record AnimalResponse(
        Long id,
        String name,
        Animal.Species species,
        String breed,
        String color,
        Animal.Size size,
        Animal.Gender gender,
        Integer ageMonths,
        String photoUrl,
        String notes,
        Instant createdAt) {

    public static AnimalResponse of(Animal animal) {
        return new AnimalResponse(
                animal.getId(),
                animal.getName(),
                animal.getSpecies(),
                animal.getBreed(),
                animal.getColor(),
                animal.getSize(),
                animal.getGender(),
                animal.getAgeMonths(),
                animal.getPhotoUrl(),
                animal.getNotes(),
                animal.getCreatedAt());
    }
}