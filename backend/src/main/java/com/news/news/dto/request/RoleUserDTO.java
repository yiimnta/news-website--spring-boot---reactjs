package com.news.news.dto.request;

import java.util.Set;

public class RoleUserDTO extends UserDTO {

    private Set<String> roles;

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}