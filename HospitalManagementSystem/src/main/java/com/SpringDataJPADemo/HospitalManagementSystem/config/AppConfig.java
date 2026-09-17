package com.SpringDataJPADemo.HospitalManagementSystem.config;


import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

@Configuration
public class AppConfig {


    @Bean
    public ModelMapper modelMapper(){
        return new ModelMapper();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }


    /*
    @Bean
    UserDetailsService userDetailsService() {
        UserDetails user1= User.withUsername("admin")
                .password(passwordEncoder().encode("pass"))
                .roles("ADMIN")
                .build();

        UserDetails user2= User.withUsername("patient")
                .password(passwordEncoder().encode("pass"))
                .roles("PATIENT")
                .build();

        return new InMemoryUserDetailsManager(user1,user2);
    }

     */
}
