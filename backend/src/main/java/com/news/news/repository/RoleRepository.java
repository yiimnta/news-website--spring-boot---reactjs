package com.news.news.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.news.news.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long>, GeneralRepository {

    Optional<Role> findByName(String name);

    @Query(nativeQuery = true, value = "SELECT * FROM roles_tbl WHERE id IN (:ids)")
    List<Role> findAllByIds(List<Long> ids);
}
