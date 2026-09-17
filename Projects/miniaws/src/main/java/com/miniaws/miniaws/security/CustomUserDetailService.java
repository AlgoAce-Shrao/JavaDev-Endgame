package com.miniaws.miniaws.security;

import com.miniaws.miniaws.entity.AppUser;
import com.miniaws.miniaws.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        AppUser appUser =userRepository.findUserByUsername(username).orElseThrow(()->new IllegalArgumentException("AppUser not found"));

        return appUser;
    }
}
