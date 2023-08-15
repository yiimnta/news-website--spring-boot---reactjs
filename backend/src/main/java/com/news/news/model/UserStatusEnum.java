package com.news.news.model;

public enum UserStatusEnum {
    ACTIVE(0), // active
    INACTIVE(1), // inactive when the user has't actived their email yet
    BLOCK(2); // user has been blocked/banned.

    private int value;

    public int getValue() {
        return value;
    }

    private UserStatusEnum(int value) {
        this.value = value;
    }

}
