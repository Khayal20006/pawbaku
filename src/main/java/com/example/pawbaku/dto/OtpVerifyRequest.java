package com.example.pawbaku.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Request to validate an email verification code. */
public record OtpVerifyRequest(
        @NotBlank(message = "Email tələb olunur")
        @Email(message = "Email formatı düzgün deyil")
        @Size(max = 150, message = "Email 150 simvoldan uzun ola bilməz")
        String email,

        @NotBlank(message = "Kod tələb olunur")
        @Pattern(regexp = "^[0-9]{6}$", message = "Kod 6 rəqəm olmalıdır")
        String code) {
}