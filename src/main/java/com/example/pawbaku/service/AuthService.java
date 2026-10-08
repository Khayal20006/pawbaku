package com.example.pawbaku.service;

import com.example.pawbaku.dto.AuthResponse;
import com.example.pawbaku.dto.LoginRequest;
import com.example.pawbaku.dto.RegisterRequest;
import com.example.pawbaku.exception.BadRequestException;
import com.example.pawbaku.exception.ConflictException;
import com.example.pawbaku.model.User;
import com.example.pawbaku.repository.UserRepository;
import com.example.pawbaku.security.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Registration and login. */
@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final EmailOtpService emailOtpService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService,
                       EmailOtpService emailOtpService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.emailOtpService = emailOtpService;
    }

    /** Self-service registration always produces a citizen account. */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String username = request.username().trim();
        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByUsernameIgnoreCase(username)) {
            throw new ConflictException("Bu istifadəçi adı artıq tutulub: " + username);
        }
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ConflictException("Bu email artıq istifadə olunub: " + email);
        }
        String phoneNumber = normalizePhone(request.phoneNumber());
        if (phoneNumber != null && userRepository.existsByPhoneNumber(phoneNumber)) {
            throw new ConflictException("Bu telefon nömrəsi artıq istifadə olunub: " + phoneNumber);
        }

        if (request.verificationCode() == null || request.verificationCode().isBlank()) {
            throw new BadRequestException(
                    "Email doğrulama kodu tələb olunur — əvvəlcə 'Kod göndər' deyin");
        }
        emailOtpService.verify(email, request.verificationCode());

        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(request.password()))
                .fullName(blankToNull(request.fullName()))
                .phoneNumber(phoneNumber)
                .role(User.Role.CITIZEN)
                .active(true)
                .build();
        user = userRepository.save(user);

        log.info("Yeni qeydiyyat: {}", username);
        return AuthResponse.of(jwtService.issue(user), jwtService.expiresInSeconds(), user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String identifier = request.username().trim();
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(identifier, request.password()));
        } catch (BadCredentialsException ex) {
            throw new BadCredentialsException("İstifadəçi adı və ya parol düzgün deyil");
        }

        User user = userRepository.findByEmailIgnoreCase(identifier)
                .or(() -> userRepository.findByUsernameIgnoreCase(identifier))
                .orElseThrow(() -> new BadCredentialsException("İstifadəçi adı və ya parol düzgün deyil"));

        if (!user.isActive()) {
            throw new BadCredentialsException("Hesab deaktivləşdirilib");
        }

        return AuthResponse.of(jwtService.issue(user), jwtService.expiresInSeconds(), user);
    }

    private static String blankToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    /** Boş deyilsə boşluq/qısa xətt/sürgü simvollarını silir ki, unikallıq yoxlaması düzgün işləsin. */
    static String normalizePhone(String value) {
        String trimmed = blankToNull(value);
        if (trimmed == null) {
            return null;
        }
        String normalized = trimmed.replaceAll("[\\s\\-()]", "");
        return normalized.isEmpty() ? null : normalized;
    }
}