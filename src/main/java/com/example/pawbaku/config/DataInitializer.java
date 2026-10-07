package com.example.pawbaku.config;

import com.example.pawbaku.model.User;
import com.example.pawbaku.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Creates the first administrator account so a fresh database is immediately usable.
 * Idempotent: it never touches the account once someone with ADMIN already exists.
 */
@Component
@ConditionalOnProperty(prefix = "pawbaku.bootstrap", name = "enabled", havingValue = "true", matchIfMissing = true)
public class DataInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final BootstrapProperties properties;

    public DataInitializer(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           BootstrapProperties properties) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.properties = properties;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedAdmin();
    }

    private void seedAdmin() {
        if (userRepository.existsByRole(User.Role.ADMIN)) {
            return;
        }
        BootstrapProperties.Admin admin = properties.admin();
        User user = User.builder()
                .username(admin.username())
                .email(admin.email())
                .password(passwordEncoder.encode(admin.password()))
                .fullName("PawBaku Administratoru")
                .role(User.Role.ADMIN)
                .active(true)
                .build();
        userRepository.save(user);
        log.info("Başlanğıc admin hesabı yaradıldı: {}", admin.username());
    }

    /** Bootstrap settings bound from {@code pawbaku.bootstrap.*}. */
    @ConfigurationProperties(prefix = "pawbaku.bootstrap")
    public record BootstrapProperties(Admin admin) {

        public BootstrapProperties {
            if (admin == null) {
                throw new IllegalStateException("pawbaku.bootstrap.admin tələb olunur");
            }
            admin.validate();
        }

        public record Admin(String username, String password, String email) {

            private static final String DEFAULT_USERNAME = "admin";

            public Admin {
                if (username == null || username.isBlank()) {
                    username = DEFAULT_USERNAME;
                }
                if (email == null || email.isBlank()) {
                    email = username + "@pawbaku.az";
                }
                if (password == null || password.isBlank()) {
                    throw new IllegalStateException(
                            "pawbaku.bootstrap.admin.password tələb olunur (minimum 8 simvol)");
                }
            }

            void validate() {
                if (password().length() < 8) {
                    throw new IllegalStateException(
                            "Başlanğıc admin parolu ən azı 8 simvol olmalıdır");
                }
            }
        }
    }
}