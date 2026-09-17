package com.url_shortener.url_shortener.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ResponseDto {

    private String originalURL;
    private String shortURL;
    private Long hitCount;
}
