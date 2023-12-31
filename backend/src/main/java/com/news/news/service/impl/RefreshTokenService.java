package com.news.news.service.impl;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.news.news.model.RefreshToken;
import com.news.news.model.User;
import com.news.news.repository.RefreshTokenRepository;
import com.news.news.repository.UserRepository;
import com.news.news.service.CRUDService;
import com.news.news.service.IRefreshTokenService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;

@Service
public class RefreshTokenService implements IRefreshTokenService, CRUDService<RefreshToken> {

    public static final String COOKIE_REFRESH_TOKEN = "refresh_token";
    public static final String COOKIE_REMEMBER_ME = "rememberme";

    @Value("${refreshtoken.expiration.ms}")
    private int refreshTokenExpiryTimeMS;

    @Value("${cookie.expiration.sec}")
    private int cookieExpriyTimeSec;

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

        RefreshToken refreshToken = refreshTokenRepository.findByUser(user).orElse(null);

        if (refreshToken == null || this.verifyExpiration(refreshToken)) {
            String token = UUID.randomUUID().toString();
            Instant expiryDate = Instant.now().plusMillis(refreshTokenExpiryTimeMS);
            refreshToken = new RefreshToken(token, user, expiryDate);
            refreshTokenRepository.save(refreshToken);
        }

        return refreshToken;
    }

    public RefreshToken generateRefreshToken(long userId) {
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            throw new RuntimeException("User can be not found");
        }

        return generateRefreshToken(user);
    }

    @Override
    public boolean verifyExpiration(RefreshToken token) {

        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            return true;
        }

        return false;
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

    // public Cookie createRTCookie(User user, int age) {
    // String refreshToken = this.generateRefreshToken(user.getId()).getToken();
    // return createRTCookie(user, refreshToken, age);
    // }

    // public Cookie createRTCookie(User user) {
    // String refreshToken = this.generateRefreshToken(user.getId()).getToken();
    // return createRTCookie(user, refreshToken, cookieExpriyTimeSec);
    // }

    // public Cookie createRTCookie(User user, String refreshToken, int age) {
    // Cookie rfTokenCookie = new Cookie(COOKIE_REFRESH_TOKEN, refreshToken);
    // rfTokenCookie.setHttpOnly(true);
    // rfTokenCookie.setMaxAge(cookieExpriyTimeSec);
    // rfTokenCookie.setSecure(true);

    // return rfTokenCookie;
    // }

    public void addRTCookie(HttpServletResponse response, User user, boolean rememberMe) {
        String refreshToken = this.generateRefreshToken(user.getId()).getToken();
        addRTCookie(response, user, refreshToken, rememberMe);
    }

    public void addRTCookie(HttpServletResponse response, User user, String refreshToken, boolean rememberMe) {

        int expiryAge = rememberMe ? cookieExpriyTimeSec : -1; // -1 means that cookie will be stored in session (will
                                                               // be clear after closing browser)
        Cookie rfTokenCookie = new Cookie(COOKIE_REFRESH_TOKEN, refreshToken);
        rfTokenCookie.setHttpOnly(true);
        rfTokenCookie.setMaxAge(expiryAge);
        rfTokenCookie.setSecure(true);

        response.addCookie(rfTokenCookie);

        Cookie rememberMeCookie = new Cookie(COOKIE_REMEMBER_ME, String.valueOf(rememberMe));
        rememberMeCookie.setHttpOnly(true);
        rememberMeCookie.setMaxAge(expiryAge);
        rememberMeCookie.setSecure(true);

        response.addCookie(rememberMeCookie);
    }

    public void removeRTCookie(HttpServletResponse response) {

        Cookie rfTokenCookie = new Cookie(COOKIE_REFRESH_TOKEN, "");
        rfTokenCookie.setHttpOnly(true);
        rfTokenCookie.setMaxAge(0);
        rfTokenCookie.setSecure(true);

        response.addCookie(rfTokenCookie);

        Cookie rememberMeCookie = new Cookie(COOKIE_REMEMBER_ME, "");
        rememberMeCookie.setHttpOnly(true);
        rememberMeCookie.setMaxAge(0);
        rememberMeCookie.setSecure(true);

        response.addCookie(rememberMeCookie);
    }

    @Override
    public void deleteByIdIn(List<Long> ids) {
        refreshTokenRepository.deleteByIdIn(ids);
    }
}
