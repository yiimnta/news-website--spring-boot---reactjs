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
public class JwtAuthenticationResponse {

    public JwtAuthenticationResponse(User user) {
        BeanUtils.copyProperties(user, this);
        this.roles = new ArrayList<>();
        user.getRoles().stream().forEach(role -> {
            roles.add(new RoleResponse(role.getName(), role.getColor()));
        });
    }

    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private String avatar;
    private List<RoleResponse> roles;
    private String accessToken;
    private UserStatusEnum status;
}
