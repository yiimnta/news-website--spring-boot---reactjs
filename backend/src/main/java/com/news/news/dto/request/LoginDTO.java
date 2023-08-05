package com.news.news.dto.request;

import org.springframework.beans.factory.annotation.Value;

import com.news.news.annotation.GenderTypeSubSet;
import com.news.news.model.Gender;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginDTO {

    @Email
    @NotEmpty
    private String email;

    @NotEmpty
    @Size(min = 6)
    private String password;

    private Boolean savesPassword;
}