package com.lawlink.backend_java.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class ChatHistoryReponse {
    private UUID id;
    private String role;
    private String content;
    private LocalDateTime timestamp;

    public ChatHistoryReponse(UUID id, String role, String content, LocalDateTime timestamp) {
        this.id = id;
        this.role = role;
        this.content = content;
        this.timestamp = timestamp;
    }
}
