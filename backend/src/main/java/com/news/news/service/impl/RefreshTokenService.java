package com.news.news.service.impl;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.news.news.exception.RefreshTokenException;
import com.news.news.model.RefreshToken;
import com.news.news.model.User;
import com.news.news.repository.RefreshTokenRepository;
import com.news.news.repository.UserRepository;
import com.news.news.service.CRUDService;
import com.news.news.service.IRefreshTokenService;

import jakarta.servlet.http.Cookie;
import jakarta.transaction.Transactional;

@Service
public class RefreshTokenService implements IRefreshTokenService, CRUDService<RefreshToken> {

    public static final String COOKIE_REFRESH_TOKEN = "refresh_token";

    @Value("${refreshtoken.expiration.time}")
    private int refreshTokenExpiryTime;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Override
    public RefreshToken generateRefreshToken(User user) {
        String token = UUID.randomUUID().toString();
        Instant expiryDate = Instant.now().plusMillis(refreshTokenExpiryTime * 1000);
        RefreshToken refreshToken = new RefreshToken(token, user, expiryDate);

        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken generateRefreshToken(long userId) {
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            throw new RuntimeException("User can be not found");
        }

        return generateRefreshToken(user);
    }

    @Override
    public RefreshToken verifyExpiration(RefreshToken token) {

        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new RefreshTokenException(token.getToken(), "Refresh token was expired!");
        }

        return token;
    }

    @Override
    public List<RefreshToken> findAll() {
        return refreshTokenRepository.findAll();
    }

    @Override
    public Optional<RefreshToken> findById(long id) {
        return refreshTokenRepository.findById(id);
    }

    @Override
    public RefreshToken save(RefreshToken t) {
        return refreshTokenRepository.save(t);
    }

    @Override
    public void delete(long id) {
        refreshTokenRepository.deleteById(id);
    }

    @Transactional
    @Override
    public boolean deleteByUserId(long userId) {

        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            throw new RuntimeException("User can be not found");
        }

        return refreshTokenRepository.deleteByUser(user);
    }

    public Cookie createRTCookie(User user) {
        String refreshToken = this.generateRefreshToken(user.getId()).getToken();
        Cookie rfTokenCookie = new Cookie(COOKIE_REFRESH_TOKEN, refreshToken);
        rfTokenCookie.setHttpOnly(true);
        rfTokenCookie.setMaxAge(refreshTokenExpiryTime);
        // rfTokenCookie.setSecure(true);

        return rfTokenCookie;
    }

}
