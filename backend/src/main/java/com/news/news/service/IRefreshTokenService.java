package com.news.news.service;

import java.util.Optional;

import com.news.news.model.RefreshToken;
import com.news.news.model.User;

import jakarta.servlet.http.Cookie;

public interface IRefreshTokenService {

    Optional<RefreshToken> findByToken(String token);

    RefreshToken generateRefreshToken(User user);

    void verifyExpiration(RefreshToken token);

    boolean deleteByUserId(long userId);

    Cookie createRTCookie(User user);
}
