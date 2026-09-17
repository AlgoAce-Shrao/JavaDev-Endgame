package com.devflow.service;

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
import com.devflow.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private EntityMapper entityMapper;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User sampleUser;
    private UserResponse sampleUserResponse;

    @BeforeEach
    void setUp() {
        registerRequest = RegisterRequest.builder()
                .name("John Doe")
                .email("john@example.com")
                .password("Password123")
                .build();

        loginRequest = LoginRequest.builder()
                .email("john@example.com")
                .password("Password123")
                .build();

        sampleUser = User.builder()
                .id(1L)
                .name("John Doe")
                .email("john@example.com")
                .password("encoded_password")
                .role(Role.DEVELOPER)
                .build();

        sampleUserResponse = UserResponse.builder()
                .id(1L)
                .name("John Doe")
                .email("john@example.com")
                .role(Role.DEVELOPER)
                .build();
    }

    @Test
    @DisplayName("Should successfully register a new user with DEVELOPER role")
    void register_Success() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(entityMapper.toUserResponse(any(User.class))).thenReturn(sampleUserResponse);

        UserResponse response = authService.register(registerRequest);

        assertThat(response).isNotNull();
        assertThat(response.getEmail()).isEqualTo("john@example.com");
        assertThat(response.getRole()).isEqualTo(Role.DEVELOPER);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when email is already registered")
    void register_DuplicateEmail_ThrowsException() {
        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("User already exists with email");

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should successfully authenticate user and return JWT token")
    void login_Success() {
        UserPrincipal userPrincipal = UserPrincipal.create(sampleUser);
        Authentication authentication = mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(tokenProvider.generateToken(authentication)).thenReturn("mock_jwt_token");

        AuthResponse response = authService.login(loginRequest);

        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("mock_jwt_token");
        assertThat(response.getUserId()).isEqualTo(1L);
        assertThat(response.getEmail()).isEqualTo("john@example.com");
        assertThat(response.getRole()).isEqualTo(Role.DEVELOPER);
    }
}
