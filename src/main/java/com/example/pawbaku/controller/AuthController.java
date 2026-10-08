package com.example.pawbaku.controller;

import com.example.pawbaku.dto.AuthResponse;
import com.example.pawbaku.dto.LoginRequest;
import com.example.pawbaku.dto.OtpSendRequest;
import com.example.pawbaku.dto.OtpSendResponse;
import com.example.pawbaku.dto.OtpVerifyRequest;
import com.example.pawbaku.dto.OtpVerifyResponse;
import com.example.pawbaku.dto.RegisterRequest;
import com.example.pawbaku.service.AuthService;
import com.example.pawbaku.service.EmailOtpService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final EmailOtpService emailOtpService;

    public AuthController(AuthService authService, EmailOtpService emailOtpService) {
        this.authService = authService;
        this.emailOtpService = emailOtpService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    /** Email doğrulama kodu göndərir — registrasiyadan əvvəl məcburidir. */
    @PostMapping("/otp/send")
    public OtpSendResponse sendOtp(@Valid @RequestBody OtpSendRequest request) {
        return emailOtpService.send(request.email());
    }

    /** Kodu doğrulayır və istehlak edir. */
    @PostMapping("/otp/verify")
    public OtpVerifyResponse verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
        emailOtpService.verify(request.email(), request.code());
        return new OtpVerifyResponse(true);
    }
}