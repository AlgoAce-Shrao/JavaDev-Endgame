package com.url_shortener.url_shortener.service;


import com.url_shortener.url_shortener.dto.RequestDto;
import com.url_shortener.url_shortener.dto.ResponseDto;
import com.url_shortener.url_shortener.entity.URLMapping;
import com.url_shortener.url_shortener.repository.URLRepository;
import com.url_shortener.url_shortener.utils.base62Util;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class urlServiceImplementation implements URLService {

    private final ModelMapper modelMapper;
    private final URLRepository urlrepo;
    private final base62Util base62Util;

    @Override
    public ResponseDto shortenUrl(RequestDto requestDto) {

        URLMapping urlMapping=modelMapper.map(requestDto,URLMapping.class);
        urlMapping.setHitCount(0L);
        urlMapping.setCreatedAt(LocalDateTime.now());

        URLMapping savedEntity=urlrepo.save(urlMapping);

        String shortCode=base62Util.encode(savedEntity.getId());
        savedEntity.setShortCode(shortCode);
        urlrepo.save(savedEntity);


        ResponseDto responseDto=modelMapper.map(savedEntity,ResponseDto.class);

        responseDto.setShortURL("http://localhost:8080/"+shortCode);

        return responseDto;
    }

    @Override
    public String getOriginalURL(String  shortcode) {
         URLMapping urlMapping = urlrepo.findByShortCode(shortcode)
                                        .orElseThrow(() -> new RuntimeException("URL not found"));

         urlMapping.setHitCount(urlMapping.getHitCount()+1);
         urlrepo.save(urlMapping);

         return urlMapping.getOriginalURL();

    }
}
