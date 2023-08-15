package com.news.news.dto.response;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;

import com.news.news.model.User;
import com.news.news.model.UserStatusEnum;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {

    public UserResponse(User user) {
        BeanUtils.copyProperties(user, this);
        this.roles = new ArrayList<>();
        user.getRoles().stream().forEach(role -> {
            roles.add(new RoleResponse(role));
        });
    }

    private long id;
    private String firstname;
    private String lastname;
    private String email;
    private String avatar;
    private List<RoleResponse> roles;
    private UserStatusEnum status;
    private int age;
}
