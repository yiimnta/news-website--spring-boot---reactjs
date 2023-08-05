package com.news.news.model;

public enum RoleEnum {
    MOD("ROLE_MOD"),
    MEMBER("ROLE_MEMBER"),
    ADMIN("ROLE_ADMIN");

    private String name;

    public String getName() {
        return name;
    }

    private RoleEnum(String name) {
        this.name = name;
    }

}
