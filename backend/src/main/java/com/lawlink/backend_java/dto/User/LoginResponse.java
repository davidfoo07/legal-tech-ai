package com.lawlink.backend_java.dto.User;

import com.lawlink.backend_java.enums.Role;

import java.util.UUID;

public class LoginResponse {
    private UUID uid;
    private String username;
    private String email;
    private Role role;

    public LoginResponse(UUID uid, String username, String email, Role role) {
        this.uid = uid;
        this.username = username;
        this.email = email;
        this.role = role;
    }

    public UUID getUid() {
        return uid;
    }

    public void setUid(UUID uid) {
        this.uid = uid;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
