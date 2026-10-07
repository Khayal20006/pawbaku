package com.example.pawbaku.service;

import java.util.List;

import com.example.pawbaku.dto.AuthResponse;
import com.example.pawbaku.dto.PageResponse;
import com.example.pawbaku.dto.UserUpdateRequest;
import com.example.pawbaku.exception.ConflictException;
import com.example.pawbaku.exception.ForbiddenException;
import com.example.pawbaku.exception.ResourceNotFoundException;
import com.example.pawbaku.model.User;
import com.example.pawbaku.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Account administration and the moderator directory. */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    public UserService(UserRepository userRepository,
                       CurrentUserService currentUserService) {
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional(readOnly = true)
    public PageResponse<AuthResponse.UserResponse> findAll(String usernameFilter, User.Role role,
                                                           Pageable pageable) {
        currentUserService.requireStaff();
        Page<User> page = userRepository.search(blankToNull(usernameFilter), role, pageable);
        return PageResponse.of(page.map(AuthResponse.UserResponse::of));
    }

    @Transactional(readOnly = true)
    public AuthResponse.UserResponse findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("İstifadəçi", id));
        User current = currentUserService.require();
        if (!current.getId().equals(id) && !current.isStaff()) {
            throw new ForbiddenException("Bu profilə giriş icazəniz yoxdur");
        }
        return AuthResponse.UserResponse.of(user);
    }

    /** Self-service profile update. Role and active flags are admin-only. */
    @Transactional
    public AuthResponse.UserResponse updateProfile(Long id, UserUpdateRequest request) {
        User current = currentUserService.require();
        boolean isSelf = current.getId().equals(id);
        if (!isSelf) {
            currentUserService.requireAdmin();
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("İstifadəçi", id));

        if (request.email() != null && !request.email().isBlank()) {
            String email = request.email().trim().toLowerCase();
            userRepository.findByEmailIgnoreCase(email)
                    .filter(existing -> !existing.getId().equals(id))
                    .ifPresent(existing -> {
                        throw new ConflictException("Bu email artıq istifadə olunub: " + email);
                    });
            user.setEmail(email);
        }
        if (request.fullName() != null) {
            user.setFullName(blankToNull(request.fullName()));
        }
        if (request.phoneNumber() != null) {
            user.setPhoneNumber(blankToNull(request.phoneNumber()));
        }

        if (current.getRole() == User.Role.ADMIN) {
            if (request.role() != null) {
                user.setRole(request.role());
            }
            if (request.active() != null) {
                if (!request.active() && user.getId().equals(current.getId())) {
                    throw new ConflictException("Öz hesabınızı deaktivləşdirə bilməzsiniz");
                }
                user.setActive(request.active());
            }
        }

        return AuthResponse.UserResponse.of(userRepository.save(user));
    }

    /** Directory used by moderators and assignment flows. */
    @Transactional(readOnly = true)
    public List<AuthResponse.UserResponse> findByRole(User.Role role) {
        currentUserService.requireStaff();
        return userRepository.findAllByRole(role).stream()
                .map(AuthResponse.UserResponse::of)
                .toList();
    }

    @Transactional(readOnly = true)
    public long countByRole(User.Role role) {
        return userRepository.countByRole(role);
    }

    private static String blankToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}