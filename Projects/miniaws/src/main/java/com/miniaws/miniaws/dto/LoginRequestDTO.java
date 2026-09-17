package com.miniaws.miniaws.dto;

import lombok.Data;

@Data
public class LoginRequestDTO {

    private Long id;
    private String username;

    private String password;
}
