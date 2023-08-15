package com.news.news.dto.response;

import org.springframework.beans.BeanUtils;
import com.news.news.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoleResponse {
    String name;
    String color;
    long id;

    public RoleResponse(Role role) {
        BeanUtils.copyProperties(role, this);
    }

    public RoleResponse(String name, String color) {
        this.name = name;
        this.color = color;
    }

}
