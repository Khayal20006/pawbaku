package com.example.pawbaku.dto;

import com.example.pawbaku.model.Animal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Body for {@code POST /api/adoptions} — a community-offered adoptable pet. */
public record PetRequest(
        @NotBlank(message = "Heyvanın adı tələb olunur")
        @Size(max = 120, message = "Ad ən çox 120 simvol ola bilər")
        String name,

        @NotNull(message = "Heyvan növü tələb olunur")
        Animal.Species species,

        @Size(max = 80, message = "Cins ən çox 80 simvol ola bilər")
        String breed,

        Animal.Gender gender,

        Integer ageMonths,

        Animal.Size size,

        @Size(max = 60, message = "Rəng ən çox 60 simvol ola bilər")
        String color,

        @Size(max = 1200, message = "Haqqında mətn ən çox 1200 simvol ola bilər")
        String about,

        @Size(max = 500, message = "Şəkil URL-i ən çox 500 simvol ola bilər")
        String photoUrl) {
}