package com.news.news.dto.response;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JwtAuthenticationResponse {

    public JwtAuthenticationResponse(UserDetails user) {
        BeanUtils.copyProperties(user, this);
        this.roles = new ArrayList<>();
        user.getAuthorities().stream().forEach(role -> {
            roles.add(role.getAuthority());
        });
    }

    private String firstname;
    private String lastname;
    private String email;
    private List<String> roles;
    private String accessToken;
}
