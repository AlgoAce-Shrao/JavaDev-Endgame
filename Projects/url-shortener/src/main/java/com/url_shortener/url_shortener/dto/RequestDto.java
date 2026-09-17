package com.url_shortener.url_shortener.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RequestDto {

    private String originalURL;
}
