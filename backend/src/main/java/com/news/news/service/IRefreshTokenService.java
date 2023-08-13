package com.news.news.service;

import java.util.Optional;

import com.news.news.model.RefreshToken;
import com.news.news.model.User;

import jakarta.servlet.http.HttpServletResponse;

public interface IRefreshTokenService {

    Optional<RefreshToken> findByToken(String token);

    RefreshToken generateRefreshToken(User user);

    boolean verifyExpiration(RefreshToken token);

    boolean deleteByUserId(long userId);

    void addRTCookie(HttpServletResponse response, User user, boolean rememberMe);

    void addRTCookie(HttpServletResponse response, User user, String refreshToken, boolean rememberMe);
}
