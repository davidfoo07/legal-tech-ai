package com.lawlink.backend_java.dto;


import com.lawlink.backend_java.entity.User;

import java.util.UUID;

public class ChatRequest {
    private UUID userId;
    private String input;

    public ChatRequest() {}

    public ChatRequest(UUID userId, String input) {
        this.userId = userId;
        this.input = input;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getInput() {
        return input;
    }

    public void setInput(String input) {
        this.input = input;
    }
}
