package com.example.pawbaku.dto;

import com.example.pawbaku.model.Animal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Body for {@code POST /api/reports}. */
public record ReportRequest(
        @NotBlank(message = "Başlıq tələb olunur")
        @Size(max = 120, message = "Başlıq ən çox 120 simvol ola bilər")
        String title,

        @NotBlank(message = "Təsvir tələb olunur")
        @Size(max = 2000, message = "Təsvir ən çox 2000 simvol ola bilər")
        String description,

        @NotNull(message = "Heyvan növü tələb olunur")
        Animal.Species species,

        @NotBlank(message = "Rayon tələb olunur")
        @Size(max = 80, message = "Rayon ən çox 80 simvol ola bilər")
        String district,

        @Size(max = 300, message = "Ünvan ən çox 300 simvol ola bilər")
        String address,

        Double latitude,

        Double longitude,

        @Size(max = 500, message = "Şəkil URL-i ən çox 500 simvol ola bilər")
        String photoUrl) {
}