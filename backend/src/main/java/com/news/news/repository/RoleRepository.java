package com.news.news.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.news.news.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(String name);

}
