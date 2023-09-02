package com.news.news.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "roles_tbl")
@NoArgsConstructor
public class Role {

    @Id
    @GeneratedValue
    private long id;
    private String name;
    private String color;

    public Role(String name) {
        this.name = name;
        this.color = "#000";
    }

    public Role(String name, String color) {
        this.name = name;
        this.color = color;
    }

    public Role(long id, String name, String color) {
        this.name = name;
        this.color = color;
        this.id = id;
    }

}
