package com.news.news.service;

import java.util.List;
import java.util.Optional;

public interface CRUDService<T> {

    List<T> findAll();

    Optional<T> findById(long id);

    T save(T t);

    void delete(long id);
}
