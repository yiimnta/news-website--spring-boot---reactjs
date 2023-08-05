package com.news.news.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/public")
public class HelloController extends Controller {

    @GetMapping("/hello")
    public String hello() {
        return "Hallo";
    }
}