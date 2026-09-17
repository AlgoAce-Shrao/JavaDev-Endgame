package com.SpringDataJPADemo.HospitalManagementSystem.controller;

import com.SpringDataJPADemo.HospitalManagementSystem.dto.LoginRequestDTO;
import com.SpringDataJPADemo.HospitalManagementSystem.dto.LoginResponseDTO;
import com.SpringDataJPADemo.HospitalManagementSystem.dto.SignupResponseDTO;
import com.SpringDataJPADemo.HospitalManagementSystem.security.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

        private final AuthService authService;

        //will create the login endpoint here

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequestDTO){
        return ResponseEntity.ok(authService.login(loginRequestDTO));
    }

    @PostMapping("/signup")
    public ResponseEntity<SignupResponseDTO> signup(@RequestBody LoginRequestDTO signupRequestDTO){
        return ResponseEntity.ok(authService.signup(signupRequestDTO));
    }


}


