package com.example.pawbaku.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Request to issue a fresh email verification code. */
public record OtpSendRequest(
        @NotBlank(message = "Email tələb olunur")
        @Email(message = "Email formatı düzgün deyil")
        @Size(max = 150, message = "Email 150 simvoldan uzun ola bilməz")
        String email) {
}