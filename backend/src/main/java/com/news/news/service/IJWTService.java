package com.news.news.service;

import org.springframework.security.core.userdetails.UserDetails;

public interface IJWTService {

    String extractEmail(String token);

    String generateToken(UserDetails userdetails);

    boolean isTokenValid(String token, UserDetails userdetails);

    boolean isTokenExpired(String token);
}
