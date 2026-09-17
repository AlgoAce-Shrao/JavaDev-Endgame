package com.miniaws.miniaws.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.util.Base64;

public class GenerateKey {
    public static void main(String[] args) {
        String key = Base64.getEncoder()
                .encodeToString(Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS256)
                        .getEncoded());

        System.out.println(key);
    }
}