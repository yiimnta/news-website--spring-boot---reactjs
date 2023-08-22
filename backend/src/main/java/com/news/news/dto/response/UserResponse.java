package com.news.news.dto.response;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;

import com.news.news.model.Gender;
import com.news.news.model.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {

    public UserResponse(User user) {
        BeanUtils.copyProperties(user, this);
        this.roles = new ArrayList<>();
        user.getRoles().stream().forEach(role -> {
            roles.add(new RoleResponse(role));
        });

        this.status = user.getStatus().getValue();
    }

    private long id;
    private String firstname;
    private String lastname;
    private String email;
    private String avatar;
    private List<RoleResponse> roles;
    private int status;
    private int age;
    private Gender gender;

    public String getName() {
        return String.format("%s %s", firstname, lastname);
    }
}
