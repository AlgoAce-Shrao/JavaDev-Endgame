package com.miniaws.miniaws.dto;

import lombok.Data;

@Data
public class SignUpRequestDTO {

    private String username;

    private String email;

    private String password;
}
