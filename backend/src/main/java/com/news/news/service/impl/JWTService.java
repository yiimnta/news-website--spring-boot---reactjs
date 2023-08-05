package com.news.news.service.impl;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.news.news.service.IJWTService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JWTService implements IJWTService {

    @Value("${token.signing.key}")
    private String jwtSigningKey;

    @Value("${token.expiration.time}")
    private long expirationTime;

    @Override
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    @Override
    public String generateToken(UserDetails userdetails) {

        return Jwts.builder()
                .setSubject(userdetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    @Override
    public boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    @Override
    public boolean isTokenValid(String token, UserDetails userdetails) {

        boolean isAccountRight = extractEmail(token).equals(userdetails.getUsername());
        return this.isTokenExpired(token) && isAccountRight;
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolvers) {
        Claims claims = extractAllClaims(token);
        return claimResolvers.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(getSignInKey()).build().parseClaimsJws(token).getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSigningKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

}
