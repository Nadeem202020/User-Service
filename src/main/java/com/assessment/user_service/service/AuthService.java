package com.assessment.user_service.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.assessment.user_service.config.JwtService;
import com.assessment.user_service.dto.AuthRequest;
import com.assessment.user_service.dto.AuthResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public AuthResponse login(AuthRequest request) {

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String jwtToken = jwtService.generateToken(userDetails);
        return AuthResponse.builder().token(jwtToken).build();
    }
}
