package com.example.pawbaku.dto;

import com.example.pawbaku.model.AdoptablePet;
import com.example.pawbaku.model.Animal;

/** Public profile of an adoptable pet. */
public record PetResponse(
        Long id,
        String name,
        Animal.Species species,
        String breed,
        Animal.Gender gender,
        Integer ageMonths,
        Animal.Size size,
        String color,
        String about,
        String photoUrl,
        AdoptablePet.PetStatus status,
        String createdAt,
        UserResponse createdBy) {

    public record UserResponse(Long id, String username, String fullName) {
    }

    public static PetResponse of(AdoptablePet pet) {
        return new PetResponse(
                pet.getId(),
                pet.getName(),
                pet.getSpecies(),
                pet.getBreed(),
                pet.getGender(),
                pet.getAgeMonths(),
                pet.getSize(),
                pet.getColor(),
                pet.getAbout(),
                pet.getPhotoUrl(),
                pet.getStatus(),
                pet.getCreatedAt() == null ? null : pet.getCreatedAt().toString(),
                new UserResponse(pet.getCreatedBy().getId(), pet.getCreatedBy().getUsername(),
                        pet.getCreatedBy().getFullName()));
    }
}