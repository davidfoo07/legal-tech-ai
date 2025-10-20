package com.lawlink.backend_java.dto;

public class ChatReponse {
    private String message;

    public ChatReponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
