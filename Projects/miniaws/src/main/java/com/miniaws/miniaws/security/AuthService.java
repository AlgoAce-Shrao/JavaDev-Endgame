package com.miniaws.miniaws.security;

import com.miniaws.miniaws.dto.LoginRequestDTO;
import com.miniaws.miniaws.dto.LoginResponseDTO;
import com.miniaws.miniaws.dto.SignUpRequestDTO;
import com.miniaws.miniaws.dto.SignUpResponseDTO;
import com.miniaws.miniaws.entity.AppUser;
import com.miniaws.miniaws.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private  final AuthUtil authUtil;


    public SignUpResponseDTO signUp(SignUpRequestDTO signUpRequestDTO){
        AppUser appUser =userRepository.findUserByUsername(signUpRequestDTO.getUsername()).orElse(null);

        if(appUser !=null) throw new IllegalArgumentException("AppUser already exists");

        appUser =userRepository.save(AppUser.builder()
                .email(signUpRequestDTO.getEmail())
                .password(passwordEncoder.encode(signUpRequestDTO.getPassword()))
                .username(signUpRequestDTO.getUsername())
                .build()
        );

        return modelMapper.map(appUser,SignUpResponseDTO.class);



    }

    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {

        Authentication authentication=authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginRequestDTO.getUsername(),loginRequestDTO.getPassword())
                );

        AppUser appUser =(AppUser)authentication.getPrincipal();

        String token= null;
        if (appUser != null) {
            token = authUtil.generateToken(appUser);
        }

        return new LoginResponseDTO(token, appUser.getId());
    }
}


