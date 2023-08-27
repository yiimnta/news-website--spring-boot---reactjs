package com.news.news.dto.request.user;

import java.util.Set;

import com.news.news.dto.request.auth.AuthDTO;

public class RoleUserDTO extends AuthDTO {

    private Set<String> roles;

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}