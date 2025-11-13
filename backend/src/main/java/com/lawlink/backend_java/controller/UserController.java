package com.lawlink.backend_java.controller;

import com.lawlink.backend_java.dto.User.LoginRequest;
import com.lawlink.backend_java.dto.User.LoginResponse;
import com.lawlink.backend_java.entity.User;
import com.lawlink.backend_java.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "api/v1/auth")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(path = "/register")
    public User createUser(@RequestBody User user) {
        return userService.createNewUser(user);
    }

    @PostMapping(path = "/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest) {
        return userService.login(loginRequest);
    }

    @PostMapping(path = "/login-as-guest")
    public LoginResponse login() {
        return userService.login_as_guest();
    }
}
