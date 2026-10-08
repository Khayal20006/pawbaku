package com.example.pawbaku.exception;

/** Invalid client input that doesn't qualify for a bean-validation error (400). */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}