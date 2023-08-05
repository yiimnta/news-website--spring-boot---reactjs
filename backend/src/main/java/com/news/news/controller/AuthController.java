package com.news.news.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.news.news.dto.request.UserDTO;
import com.news.news.dto.response.JwtAuthenticationResponse;
import com.news.news.dto.response.ResponseMessage;
import com.news.news.model.Role;
import com.news.news.model.RoleEnum;
import com.news.news.model.User;
import com.news.news.service.impl.JWTService;
import com.news.news.service.impl.RoleService;
import com.news.news.service.impl.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController extends Controller {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private JWTService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> signup(@RequestBody @Valid UserDTO userDTO) throws Exception {
        if (userService.existsByEmail(userDTO.getEmail())) {
            return new ResponseEntity<>(new ResponseMessage("Email have already existed"), HttpStatus.CONFLICT);
        } else {

            User newUser = userService.saveUserRequest(userDTO);
            Role memberRole = roleService.findByName(RoleEnum.MEMBER).orElse(null);
            if (memberRole == null) {
                throw new Exception("Can not find Member role!");
            } else {
                newUser.addRole(memberRole);
                userService.save(newUser);
            }

            String jwt = jwtService.generateToken(newUser);

            return ResponseEntity.ok(JwtAuthenticationResponse.builder().token(jwt).build());
        }
    }

}
