package com.lawlink.backend_java.controller;


import com.lawlink.backend_java.dto.Chat.ChatHistoryReponse;
import com.lawlink.backend_java.dto.Chat.ChatReponse;
import com.lawlink.backend_java.dto.Chat.ChatRequest;
import com.lawlink.backend_java.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "api/v1/chat")
public class ChatController {

    private final ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping(path = "/send")
    public ChatReponse sendInput(@RequestBody ChatRequest chatRequest) throws Exception {
        return chatService.handleNewMessage(chatRequest);
    }

    @GetMapping(path = "/history/{userId}")
    public List<ChatHistoryReponse> getAllMessages(@PathVariable UUID userId) throws Exception {
        return chatService.getChatHistory(userId);
    }
}
