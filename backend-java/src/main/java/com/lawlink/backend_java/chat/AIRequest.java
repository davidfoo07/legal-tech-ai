package com.lawlink.backend_java.chat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class AIRequest {
    private List<ChatMessage> history;
    private String input;

    public AIRequest(List<ChatMessage> history, String input) {
        this.history = history;
        this.input = input;
    }
}


