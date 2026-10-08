package com.example.pawbaku.security;

import com.example.pawbaku.exception.ResourceNotFoundException;
import com.example.pawbaku.model.User;
import com.example.pawbaku.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PawUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public PawUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return new AppUserDetails(loadEntity(username));
    }

    @Transactional(readOnly = true)
    public User loadEntity(String identifier) throws UsernameNotFoundException {
        return userRepository.findByEmailIgnoreCase(identifier)
                .or(() -> userRepository.findByUsernameIgnoreCase(identifier))
                .orElseThrow(() -> new UsernameNotFoundException("İstifadəçi tapılmadı: " + identifier));
    }

    /**
     * Not part of the {@link UserDetailsService} contract, so a missing id is reported as
     * a 404 instead of an authentication failure.
     */
    @Transactional(readOnly = true)
    public User loadEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("İstifadəçi", id));
    }
}