package com.url_shortener.url_shortener.utils;


import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class base62Util {

    public static String elements = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    public static String encode(Long id) {
        StringBuilder sb = new StringBuilder();
        while (id != 0) {
            sb.insert(0, elements.charAt((int) (id % 62)));
            id /= 62;
        }
        // while (sb.length() != 7) {
        //     sb.insert(0, '0');
        // }
        return sb.toString();
    }
}
