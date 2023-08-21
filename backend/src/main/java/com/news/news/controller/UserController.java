package com.news.news.controller;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.news.news.dto.request.UserDTO;
import com.news.news.dto.request.AuthDTO;
import com.news.news.dto.response.ResponseMessage;
import com.news.news.dto.response.UserResponse;
import com.news.news.model.Role;
import com.news.news.model.User;
import com.news.news.service.impl.RoleService;
import com.news.news.service.impl.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserController extends Controller {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @PostMapping
    public ResponseEntity<?> signup(@RequestBody @Valid UserDTO userDTO) {
        if (userService.existsByEmail(userDTO.getEmail())) {
            return new ResponseEntity<>(new ResponseMessage("Email have already existed"), HttpStatus.CONFLICT);
        } else {
            List<Role> roles = new ArrayList<>();

            if (!userDTO.getRoles().isEmpty()) {
                roles = roleService.findAllByIds(userDTO.getRoles());
            }

            User newUser = userService.saveUserRequest(userDTO, new HashSet<>(roles));
            return new ResponseEntity<>(new UserResponse(newUser), HttpStatus.CREATED);
        }
    }

    @GetMapping
    ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll().stream().map(user -> new UserResponse(user)).toList());
    }

    @GetMapping("/{id}")
    ResponseEntity<UserResponse> getUser(@PathVariable Long id) {

        User user = userService.findById(id).orElse(null);
        if (user != null) {
            return ResponseEntity.ok(new UserResponse(user));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> deleteUsers(@PathVariable("id") Long id) {

        if (userService.exists(id)) {
            userService.delete(id);

            return ResponseEntity.ok().build();

        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody AuthDTO userDTO) {

        User updatedUser = userService.updateUser(id, userDTO);

        if (updatedUser != null) {
            return ResponseEntity.ok(new UserResponse(updatedUser));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
