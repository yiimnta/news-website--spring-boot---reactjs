package com.news.news;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.news.news.model.Role;
import com.news.news.model.RoleEnum;
import com.news.news.service.impl.RoleService;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class NewsApplication {

    @Autowired
    private RoleService roleService;

    public static void main(String[] args) {
        SpringApplication.run(NewsApplication.class, args);
    }

    @PostConstruct
    public void init() {

        List<Role> roles = (List<Role>) roleService.findAll();

        if (roles.isEmpty()) {
            Role adminRole = new Role(RoleEnum.ADMIN.getName());
            roleService.save(adminRole);

            Role modRole = new Role(RoleEnum.MOD.getName());
            roleService.save(modRole);

            Role memberRole = new Role(RoleEnum.MEMBER.getName());
            roleService.save(memberRole);
        }
    }
}
