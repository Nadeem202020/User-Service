package com.assessment.user_service.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.assessment.user_service.config.JwtService;
import com.assessment.user_service.dto.AuthRequest;
import com.assessment.user_service.dto.AuthResponse;
import com.assessment.user_service.dto.CreateUserRequest;
import com.assessment.user_service.model.User;
import com.assessment.user_service.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public AuthResponse login(AuthRequest request) {
        // Find the user by email. Throws exception if not found, which is handled
        // globally.
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String jwtToken = jwtService.generateToken(userDetails);
        return AuthResponse.builder().token(jwtToken).build();
    }
}
