package com.devflow.service;

import com.devflow.dto.request.LoginRequest;
import com.devflow.dto.request.RegisterRequest;
import com.devflow.dto.response.AuthResponse;
import com.devflow.dto.response.UserResponse;

public interface AuthService {
    UserResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
