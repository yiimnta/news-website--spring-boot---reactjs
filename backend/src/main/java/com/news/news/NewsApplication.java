package com.news.news;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.news.news.model.Gender;
import com.news.news.model.Role;
import com.news.news.model.RoleEnum;
import com.news.news.model.User;
import com.news.news.model.UserStatusEnum;
import com.news.news.service.impl.RoleService;
import com.news.news.service.impl.UserService;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class NewsApplication {

    @Autowired
    private RoleService roleService;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${user.default.avatar.link}")
    private String defaultAvatarLink;

    @Value("${admin.email}")
    private String adminMail;

    @Value("${admin.password}")
    private String adminPass;

    @Value("${admin.fname}")
    private String adminFname;

    @Value("${admin.lname}")
    private String adminLname;

    public static void main(String[] args) {

        SpringApplication.run(NewsApplication.class, args);
    }

    @PostConstruct
    public void init() {

        List<Role> roles = (List<Role>) roleService.findAll();
        User admin = userService.findByEmail(adminMail).orElse(null);

        if (roles.isEmpty()) {
            Role adminRole = new Role(1, RoleEnum.ADMIN.getName(), "#ff7782");
            roleService.save(adminRole);

            Role modRole = new Role(2, RoleEnum.MOD.getName(), "#74f1b6");
            roleService.save(modRole);

            Role memberRole = new Role(3, RoleEnum.MEMBER.getName(), "#363949");
            roleService.save(memberRole);
        }

        if (admin == null) {
            String hashedPassword = passwordEncoder.encode(adminPass);

            Role adm_role = roleService.findById(1).get();
            Set<Role> adm_roles = new HashSet<>();
            adm_roles.add(adm_role);

            Long id = 1l;
            User user = new User(id, adminFname, adminLname, adminMail, defaultAvatarLink, 99,
                    Gender.M, hashedPassword, UserStatusEnum.ACTIVE);

            user.setRoles(adm_roles);
            userService.save(user);
        }
    }
}
