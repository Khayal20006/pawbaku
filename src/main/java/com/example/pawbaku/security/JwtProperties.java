package com.example.pawbaku.security;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

/**
 * JWT settings bound from {@code pawbaku.security.jwt.*}.
 *
 * @param secret            HMAC key; HS256 requires at least 32 bytes
 * @param issuer            {@code iss} claim, validated on every request
 * @param expirationMinutes token lifetime in minutes
 */
@ConfigurationProperties(prefix = "pawbaku.security.jwt")
public record JwtProperties(
        String secret,
        @DefaultValue("https://api.pawbaku.az") String issuer,
        @DefaultValue("180") long expirationMinutes) {

    public JwtProperties {
        if (secret == null || secret.getBytes(java.nio.charset.StandardCharsets.UTF_8).length < 32) {
            throw new IllegalArgumentException(
                    "JWT secret HS256 üçün ən azı 32 bayt olmalıdır (pawbaku.security.jwt.secret)");
        }
        if (issuer == null || issuer.isBlank()) {
            throw new IllegalArgumentException("JWT issuer boş ola bilməz (pawbaku.security.jwt.issuer)");
        }
        if (expirationMinutes <= 0) {
            throw new IllegalArgumentException("JWT etibarlılıq müddəti müsbət olmalıdır");
        }
    }

    public long expirationSeconds() {
        return expirationMinutes * 60;
    }
}