package com.example.pawbaku.dto;

/**
 * Result of {@code POST /api/auth/otp/send}. {@code dev=true} means the SMTP channel is
 * switched off and the code is echoed back as {@code previewCode} purely so the local demo
 * can be exercised end-to-end; production ({@code pawbaku.mail.enabled=true}) never returns it.
 */
public record OtpSendResponse(
        int expiresInSeconds,
        boolean dev,
        String previewCode) {
}