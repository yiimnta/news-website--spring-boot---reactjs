package com.news.news.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import com.news.news.model.RefreshToken;
import com.news.news.model.User;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    @Modifying
    boolean deleteByUser(User user);

    Optional<RefreshToken> findByUser(User user);
}
