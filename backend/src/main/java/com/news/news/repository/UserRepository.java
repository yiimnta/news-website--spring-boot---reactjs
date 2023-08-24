package com.news.news.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.news.news.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>, GeneralRepository {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

}
