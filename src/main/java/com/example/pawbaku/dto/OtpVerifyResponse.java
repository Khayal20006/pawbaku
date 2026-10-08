package com.example.pawbaku.dto;

/** Result of {@code POST /api/auth/otp/verify}; a rejected code raises an HTTP error instead. */
public record OtpVerifyResponse(boolean valid) {
}