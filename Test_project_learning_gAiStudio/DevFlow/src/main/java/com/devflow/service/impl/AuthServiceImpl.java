package com.devflow.service.impl;

import com.devflow.dto.request.LoginRequest;
import com.devflow.dto.request.RegisterRequest;
import com.devflow.dto.response.AuthResponse;
import com.devflow.dto.response.UserResponse;
import com.devflow.entity.User;
import com.devflow.enums.Role;
import com.devflow.exception.DuplicateResourceException;
import com.devflow.mapper.EntityMapper;
import com.devflow.repository.UserRepository;
import com.devflow.security.JwtTokenProvider;
import com.devflow.security.UserPrincipal;
import com.devflow.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final EntityMapper entityMapper;

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User already exists with email: " + request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.DEVELOPER) // Default role assignment
                .build();

        User savedUser = userRepository.save(user);
        log.info("Successfully registered user with ID: {}", savedUser.getId());

        return entityMapper.toUserResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        log.info("Attempting login for email: {}", request.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        return AuthResponse.builder()
                .token(jwt)
                .tokenType("Bearer")
                .userId(userPrincipal.getId())
                .name(userPrincipal.getName())
                .email(userPrincipal.getEmail())
                .role(userPrincipal.getRole())
                .build();
    }
}
