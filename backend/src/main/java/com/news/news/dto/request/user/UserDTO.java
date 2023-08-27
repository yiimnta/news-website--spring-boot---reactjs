package com.news.news.dto.request.user;

import java.util.List;

import com.news.news.annotation.GenderTypeSubSet;
import com.news.news.model.Gender;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    private Long id;

    @NotEmpty
    private String firstname;

    @NotEmpty
    private String lastname;

    @Email
    @NotEmpty
    private String email;
    private String avatar;

    @Min(value = 18, message = "Age should not be less than 18")
    @Max(value = 100, message = "Age should not be greater than 100")
    private int age;

    @NotNull
    @GenderTypeSubSet(anyOf = { Gender.F, Gender.M, Gender.N })
    private Gender gender;

    @NotEmpty
    private List<Long> roles;

    @Min(0)
    @Max(2)
    private int status;
}