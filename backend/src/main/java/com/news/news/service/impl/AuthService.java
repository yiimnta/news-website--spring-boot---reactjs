package com.news.news.service.impl;

import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import io.micrometer.common.util.StringUtils;

import com.news.news.dto.request.AuthDTO;
import com.news.news.model.Role;
import com.news.news.model.User;
import com.news.news.model.UserStatusEnum;
import com.news.news.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${user.default.avatar.link}")
    private String defaultAvatarLink;

    public User register(AuthDTO authRequest, Set<Role> roles) {

        String hashedPassword = passwordEncoder.encode(authRequest.getPassword());

        if (StringUtils.isEmpty(authRequest.getAvatar())) {
            authRequest.setAvatar(defaultAvatarLink);
        }

        User newUser = new User(authRequest.getFirstname(), authRequest.getLastname(), authRequest.getEmail(),
                authRequest.getAvatar(), authRequest.getAge(), authRequest.getGender(), hashedPassword,
                UserStatusEnum.INACTIVE);

        newUser.setRoles(roles);

        return userRepository.save(newUser);
    }
}
