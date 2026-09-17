package com.miniaws.miniaws.controller;

import com.miniaws.miniaws.dto.LoginRequestDTO;
import com.miniaws.miniaws.dto.LoginResponseDTO;
import com.miniaws.miniaws.dto.SignUpRequestDTO;
import com.miniaws.miniaws.dto.SignUpResponseDTO;
import com.miniaws.miniaws.security.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<SignUpResponseDTO> signupUser(@RequestBody SignUpRequestDTO signUpRequestDTO){

        return ResponseEntity.ok(authService.signUp(signUpRequestDTO));
    }



    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> loginUser(@RequestBody LoginRequestDTO loginRequestDTO){
        return ResponseEntity.ok(authService.login(loginRequestDTO));
    }

}
