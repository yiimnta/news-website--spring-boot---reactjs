package com.news.news.repository;

import java.util.List;

public interface GeneralRepository {
    void deleteByIdIn(List<Long> ids);
}
