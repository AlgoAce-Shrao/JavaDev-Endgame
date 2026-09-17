package com.url_shortener.url_shortener.controller;


import com.url_shortener.url_shortener.dto.RequestDto;
import com.url_shortener.url_shortener.dto.ResponseDto;
import com.url_shortener.url_shortener.service.URLService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class URLController {

    private final URLService urlService;


    @PostMapping("/shorten")
    public ResponseEntity<ResponseDto> shortenURl(@RequestBody RequestDto requestDto) {
        ResponseDto responseDto = urlService.shortenUrl(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @GetMapping("/{shortcode}")
    public ResponseEntity<ResponseDto> getUrl(@PathVariable String shortcode ){
        String originalURL=urlService.getOriginalURL(shortcode);
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(originalURL)).build();
    }
}
