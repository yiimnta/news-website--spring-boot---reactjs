package com.news.news.model;

public enum RoleEnum {
    MOD("MOD"),
    MEMBER("MEMBER"),
    ADMIN("ADMIN");

    private String name;

    public String getName() {
        return name;
    }

    private RoleEnum(String name) {
        this.name = name;
    }

}
