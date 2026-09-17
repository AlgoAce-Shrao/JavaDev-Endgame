package com.devflow.controller;

import com.devflow.dto.request.LoginRequest;
import com.devflow.dto.request.RegisterRequest;
import com.devflow.dto.response.AuthResponse;
import com.devflow.dto.response.UserResponse;
import com.devflow.enums.Role;
import com.devflow.exception.DuplicateResourceException;
import com.devflow.exception.GlobalExceptionHandler;
import com.devflow.security.JwtAuthenticationFilter;
import com.devflow.security.JwtTokenProvider;
import com.devflow.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private RegisterRequest validRegisterRequest;
    private LoginRequest validLoginRequest;

    @BeforeEach
    void setUp() {
        validRegisterRequest = RegisterRequest.builder()
                .name("Alice")
                .email("alice@devflow.com")
                .password("Password123")
                .build();

        validLoginRequest = LoginRequest.builder()
                .email("alice@devflow.com")
                .password("Password123")
                .build();
    }

    @Test
    @DisplayName("POST /api/auth/register should return 201 Created on valid request")
    void register_Success() throws Exception {
        UserResponse response = UserResponse.builder()
                .id(1L)
                .name("Alice")
                .email("alice@devflow.com")
                .role(Role.DEVELOPER)
                .build();

        when(authService.register(any(RegisterRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRegisterRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("alice@devflow.com"))
                .andExpect(jsonPath("$.role").value("DEVELOPER"));
    }

    @Test
    @DisplayName("POST /api/auth/register should return 400 Bad Request on invalid email/password")
    void register_ValidationError() throws Exception {
        RegisterRequest invalidRequest = RegisterRequest.builder()
                .name("")
                .email("invalid-email")
                .password("123")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.errors.email").exists())
                .andExpect(jsonPath("$.errors.password").exists());
    }

    @Test
    @DisplayName("POST /api/auth/login should return 200 OK with JWT token")
    void login_Success() throws Exception {
        AuthResponse response = AuthResponse.builder()
                .token("jwt_token_example")
                .tokenType("Bearer")
                .userId(1L)
                .name("Alice")
                .email("alice@devflow.com")
                .role(Role.DEVELOPER)
                .build();

        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validLoginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt_token_example"))
                .andExpect(jsonPath("$.role").value("DEVELOPER"));
    }
}
