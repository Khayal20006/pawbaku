package com.example.pawbaku.controller;

import java.util.List;

import com.example.pawbaku.dto.AuthResponse;
import com.example.pawbaku.dto.PageResponse;
import com.example.pawbaku.dto.UserUpdateRequest;
import com.example.pawbaku.model.User;
import com.example.pawbaku.service.CurrentUserService;
import com.example.pawbaku.service.UserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final CurrentUserService currentUserService;

    public UserController(UserService userService, CurrentUserService currentUserService) {
        this.userService = userService;
        this.currentUserService = currentUserService;
    }

    /** Who am I - used by the frontend right after login. */
    @GetMapping("/me")
    public AuthResponse.UserResponse me() {
        return AuthResponse.UserResponse.of(currentUserService.require());
    }

    @GetMapping("/{id}")
    public AuthResponse.UserResponse findById(@PathVariable Long id) {
        return userService.findById(id);
    }

    @PutMapping("/{id}")
    public AuthResponse.UserResponse update(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest request) {
        return userService.updateProfile(id, request);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public PageResponse<AuthResponse.UserResponse> findAll(@RequestParam(required = false) String username,
                                                          @RequestParam(required = false) User.Role role,
                                                          @RequestParam(defaultValue = "0") int page,
                                                          @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 200),
                Sort.by(Sort.Direction.ASC, "username"));
        return userService.findAll(username, role, pageable);
    }

    /** Directory used by the moderation and assignment pickers. */
    @GetMapping("/by-role/{role}")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public List<AuthResponse.UserResponse> byRole(@PathVariable User.Role role) {
        return userService.findByRole(role);
    }
}