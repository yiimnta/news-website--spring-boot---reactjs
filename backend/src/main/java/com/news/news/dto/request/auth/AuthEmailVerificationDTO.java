package com.news.news.dto.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthEmailVerificationDTO {

    @Email
    @NotEmpty
    private String email;

    @NotEmpty
    private String token;
}