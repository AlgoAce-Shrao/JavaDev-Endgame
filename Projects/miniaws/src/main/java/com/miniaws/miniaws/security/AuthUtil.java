package com.miniaws.miniaws.security;

import com.miniaws.miniaws.entity.AppUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class AuthUtil {

        @Value("${jwt.secretKey}")
        private String jwtSecretKey;

        private SecretKey getSecretKey(){
            byte[] keyBytes= Decoders.BASE64.decode(jwtSecretKey);
            return Keys.hmacShaKeyFor(keyBytes);
        }

        public String generateToken(AppUser appUser){
            return Jwts.builder()
                    .subject(appUser.getUsername())
                    .claim("userId", appUser.getId().toString())
                    .signWith(getSecretKey())
                    .issuedAt(new Date())
                    .expiration(new Date(System.currentTimeMillis() + 1000*60*2)) // Token valid for 2 minutes
                    .compact();
        }




        @PostConstruct
        public void ValidateKey(){

            byte[] keyBytes= Decoders.BASE64.decode(jwtSecretKey);

            if(keyBytes.length < 32) {
                throw new IllegalStateException(
                        "JWT secret key must be at least 32 bytes (256 bits)"
                );
            }
        }

        public String getUsernameFromToken(String token) {
            Claims claims = null;
            try {
                claims = Jwts.parser()
                        .verifyWith(getSecretKey())
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();
            } catch (IllegalArgumentException | JwtException e) {
                return null;
            }

            return claims.getSubject();
        }


}
