package com.lawlink.backend_java.controller;


import com.lawlink.backend_java.dto.ChatReponse;
import com.lawlink.backend_java.dto.ChatRequest;
import com.lawlink.backend_java.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "api/v1/chat")
public class ChatController {

    private final ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping(path = "/send")
    public ChatReponse sendInput(@RequestBody ChatRequest chatRequest)  {
        return chatService.handleNewMessage(chatRequest);
    }
}
