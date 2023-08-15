package com.news.news.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.news.news.dto.response.RoleResponse;
import com.news.news.service.impl.RoleService;

@RestController
@RequestMapping("/roles")
public class RoleController extends Controller {

    @Autowired
    private RoleService roleService;

    @GetMapping
    ResponseEntity<List<RoleResponse>> getAllRoles() {
        return ResponseEntity.ok(roleService.findAll().stream().map(role -> new RoleResponse(role)).toList());
    }

}
