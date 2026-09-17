package com.url_shortener.url_shortener.service;


import com.url_shortener.url_shortener.dto.RequestDto;
import com.url_shortener.url_shortener.dto.ResponseDto;
import org.springframework.stereotype.Service;

@Service
public interface URLService {
    ResponseDto shortenUrl(RequestDto requestDto);

    String getOriginalURL(String shortcode);
}
