package com.example.pawbaku.service;

import com.example.pawbaku.exception.ForbiddenException;
import com.example.pawbaku.exception.ResourceNotFoundException;
import com.example.pawbaku.model.User;
import com.example.pawbaku.repository.UserRepository;
import com.example.pawbaku.security.AppUserDetails;
import com.example.pawbaku.security.JwtService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Single place that answers "who is calling?" so authorisation rules stay consistent
 * between the controller and service layers.
 */
@Service
public class CurrentUserService {

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public User require() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ForbiddenException("İstifadəçi kimliyi tələb olunur");
        }
        if (authentication.getPrincipal() instanceof AppUserDetails details) {
            return userRepository.findById(details.getId())
                    .orElseThrow(() -> ResourceNotFoundException.of("İstifadəçi", details.getId()));
        }
        if (authentication.getPrincipal() instanceof Jwt jwt) {
            long id = -1L;
            Object raw = jwt.getClaim(JwtService.CLAIM_USER_ID);
            if (raw instanceof Number number) {
                id = number.longValue();
            }
            if (id <= 0) {
                throw new ForbiddenException("Token-də istifadəçi identifikatoru yoxdur");
            }
            final long finalId = id;
            return userRepository.findById(finalId)
                    .orElseThrow(() -> ResourceNotFoundException.of("İstifadəçi", finalId));
        }
        throw new ForbiddenException("İstifadəçi kimliyi tələb olunur");
    }

    @Transactional(readOnly = true)
    public User requireAdmin() {
        User user = require();
        if (user.getRole() != User.Role.ADMIN) {
            throw new ForbiddenException("Bu əməliyyat yalnız administrator üçündür");
        }
        return user;
    }

    @Transactional(readOnly = true)
    public User requireStaff() {
        User user = require();
        if (!user.isStaff()) {
            throw new ForbiddenException("Bu əməliyyat yalnız personal üçündür");
        }
        return user;
    }

    /** Rejects an inactive account, e.g. when a volunteer is assigned a report. */
    @Transactional(readOnly = true)
    public User requireAssignable(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.of("İstifadəçi", userId));
        if (!user.isActive()) {
            throw new ForbiddenException("Deaktiv istifadəçiyə təyinat edilə bilməz: " + user.getUsername());
        }
        return user;
    }
}