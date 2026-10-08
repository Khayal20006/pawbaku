package com.example.pawbaku.service;

import com.example.pawbaku.dto.OtpSendResponse;
import com.example.pawbaku.exception.BadRequestException;
import com.example.pawbaku.exception.ConflictException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.HexFormat;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Email doğrulama kodu (OTP) xidməti.
 *
 * <p>Kod 10 dəqiqə etibarlıdır, 5 yanlış cəhddən sonra ləğv edilir və yalnız SHA-256 hashi
 * yaddaşda saxlanılır (tək-prosesli quraşdırma üçün). {@code pawbaku.mail.enabled=true} isə
 * kod email-lə göndərilir və heç vaxt API-dən qaytarılmır; əks halda "demo rejimi" aktivdir —
 * lokal mühitdə axını sınamaq üçün kod cavabda {@code previewCode} kimi göstərilir.
 */
@Service
public class EmailOtpService {

    private static final Logger log = LoggerFactory.getLogger(EmailOtpService.class);

    private static final long EXPIRY_MILLIS = 10 * 60 * 1000L;
    private static final long COOLDOWN_MILLIS = 60 * 1000L;
    private static final int MAX_ATTEMPTS = 5;

    private final boolean mailEnabled;
    private final String mailFrom;
    private final ObjectProvider<JavaMailSender> mailSender;
    private final SecureRandom random = new SecureRandom();
    private final ConcurrentMap<String, OtpEntry> entries = new ConcurrentHashMap<>();

    public EmailOtpService(@Value("${pawbaku.mail.enabled:false}") boolean mailEnabled,
                           @Value("${pawbaku.mail.from:noreply@pawbaku.az}") String mailFrom,
                           ObjectProvider<JavaMailSender> mailSender) {
        this.mailEnabled = mailEnabled;
        this.mailFrom = mailFrom;
        this.mailSender = mailSender;
        if (mailEnabled && mailSender.getIfAvailable() == null) {
            throw new IllegalStateException(
                    "pawbaku.mail.enabled=true, lakin spring.mail.* (SMTP_HOST, SMTP_PORT, ...) konfiqurasiya edilməyib");
        }
    }

    /** Yeni kod yaradır və email-lə göndərir (SMTP söndürülübsə kodun özünü qaytarır). */
    public OtpSendResponse send(String rawEmail) {
        String email = normalize(rawEmail);
        long now = System.currentTimeMillis();

        OtpEntry existing = entries.get(email);
        if (existing != null && now - existing.sentAt() < COOLDOWN_MILLIS) {
            throw new ConflictException("Yeni kod üçün 60 saniyə gözləyin");
        }

        String code = String.format("%06d", random.nextInt(1_000_000));
        OtpEntry entry = new OtpEntry(digest(code), now + EXPIRY_MILLIS, 0, System.currentTimeMillis());

        if (mailEnabled) {
            sendMail(email, code);
            entries.put(email, entry);
            log.info("OTP email-lə göndərildi: {}", email);
            return new OtpSendResponse((int) (EXPIRY_MILLIS / 1000), false, null);
        }

        entries.put(email, entry);
        log.info("OTP (demo rejimi, email göndərilmir): {} -> {}", email, code);
        return new OtpSendResponse((int) (EXPIRY_MILLIS / 1000), true, code);
    }

    /** Kodu yoxlayıb istehlak edir; yanlış/daralmış kodda xəta atır. */
    public void verify(String rawEmail, String rawCode) {
        String email = normalize(rawEmail);
        String code = rawCode == null ? "" : rawCode.trim();
        OtpEntry entry = entries.get(email);

        if (entry == null || entry.expiresAt() < System.currentTimeMillis()) {
            entries.remove(email);
            throw new BadRequestException("Kodun müddəti keçib — yenidən göndərin");
        }
        if (entry.attempts() >= MAX_ATTEMPTS) {
            entries.remove(email);
            throw new BadRequestException("Çox sayda yanlış cəhd — yeni kod göndərin");
        }
        if (!constantTimeEquals(entry.digest(), digest(code))) {
            int left = MAX_ATTEMPTS - entry.attempts() - 1;
            entries.replace(email, entry, entry.withAttempts(entry.attempts() + 1));
            throw new BadRequestException(left > 0
                    ? "Kod yanlışdır — " + left + " cəhd qalıb"
                    : "Kod yanlışdır — yeni kod göndərin");
        }

        entries.remove(email);
    }

    private void sendMail(String email, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailFrom);
        message.setTo(email);
        message.setSubject("PawBaku — email doğrulama");
        message.setText("PawBaku-da hesabınızı doğrulamaq üçün kodunuz:" + System.lineSeparator()
                + code
                + System.lineSeparator() + System.lineSeparator()
                + "Kod 10 dəqiqə etibarlıdır. Bu sorğunu siz etməmisinizsə, məktubu nəzərə almayın.");
        try {
            mailSender.getObject().send(message);
        } catch (RuntimeException ex) {
            log.error("OTP məktubu göndərilmədi: {}", email, ex);
            throw new ConflictException("Təsdiq məktubu göndərilə bilmədi — SMTP parametrlərini yoxlayın");
        }
    }

    private static String normalize(String email) {
        return (email == null ? "" : email).trim().toLowerCase();
    }

    private static String digest(String value) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(md.digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 mövcud deyil", e);
        }
    }

    private static boolean constantTimeEquals(String a, String b) {
        return MessageDigest.isEqual(
                a.getBytes(StandardCharsets.UTF_8), b.getBytes(StandardCharsets.UTF_8));
    }

    /** SHA-256 hashı saxlanılır — düz kod heç vaxt yaddaşda tutulmur. */
    private record OtpEntry(String digest, long expiresAt, int attempts, long sentAt) {
        private OtpEntry withAttempts(int attempts) {
            return new OtpEntry(digest(), expiresAt(), attempts, sentAt());
        }
    }
}