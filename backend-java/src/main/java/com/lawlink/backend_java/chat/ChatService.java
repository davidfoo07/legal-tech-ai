package com.lawlink.backend_java.chat;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;


import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChatService {
    private final ChatRepository chatRepository;
    private final WebClient aiWebClient;
    private final ObjectMapper objectMapper;


    @Autowired
    public ChatService(ChatRepository chatRepository, WebClient aiWebClient, ObjectMapper objectMapper) {
        this.aiWebClient = aiWebClient;
        this.chatRepository = chatRepository;
        this.objectMapper = objectMapper;
    }

    public String handleNewMessage(String input, UUID userId) {
        // Fetch chat history for this user
        List<Chat> historyEntities = chatRepository.findByUserIdOrderByTimestampAsc(userId);

        List<ChatMessage> historyForAI = historyEntities.stream().map(chat -> {
            try {
                return objectMapper.readValue(chat.getMessage(), ChatMessage.class);
            } catch (JsonProcessingException e) {
                System.err.println("Failed to parse chat message from DB: " + e.getMessage());
                return null;
            }
        }).filter(Objects::nonNull).collect((Collectors.toList()));

        AIRequest aiRequest = new AIRequest(historyForAI, input);

        // Make the HTTP POST request and wait for the response
        AIResponse aiResponse = aiWebClient.post()
            .uri("/invoke") // The endpoint on your Python service
            .bodyValue(aiRequest)
            .retrieve() // Execute the request
            .bodyToMono(AIResponse.class) // Expect a response of this type
            .block(); // Wait for the response to arrive

        if (aiResponse == null || aiResponse.getAgent() == null) {
            throw new RuntimeException("Error: Invalid response from AI model.");
        }

        try {
            // save the AI response appended to the chat history into the db
            Chat userMessage = new Chat();
            userMessage.setUserId(userId);
            userMessage.setMessage(objectMapper.writeValueAsString(new ChatMessage("user", input)));
            chatRepository.save(userMessage);

            Chat aiMessage = new Chat();
            aiMessage.setUserId(userId);
            aiMessage.setMessage(objectMapper.writeValueAsString(new ChatMessage("agent", aiResponse.getAgent())));
            chatRepository.save(aiMessage);

        } catch (JsonProcessingException e) {
            // This code runs if the conversion to a string fails
            System.err.println("Error saving chat message to database: " + e.getMessage());
            throw new RuntimeException("Could not process chat message", e);
        }

        return aiResponse.getAgent();
    }

}
