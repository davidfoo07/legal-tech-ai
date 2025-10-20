package com.lawlink.backend_java.dto;


import com.lawlink.backend_java.entity.User;

public class ChatRequest {
    private User user;
    private String input;

    public ChatRequest() {}

    public ChatRequest(User user, String input) {
        this.user = user;
        this.input = input;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getInput() {
        return input;
    }

    public void setInput(String input) {
        this.input = input;
    }
}
