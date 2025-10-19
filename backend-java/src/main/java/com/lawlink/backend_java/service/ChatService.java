package com.lawlink.backend_java.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lawlink.backend_java.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;


@Service
public class ChatService {
    private final ChatRepository chatRepository;
    private final ObjectMapper objectMapper;
//    private final Client geminiClient;
//    private final WebClient aiWebClient;


    @Autowired
    public ChatService(ChatRepository chatRepository, ObjectMapper objectMapper /*, Client geminiClient, WebClient aiWebClient*/) {
        this.chatRepository = chatRepository;
        this.objectMapper = objectMapper;
//        this.geminiClient = geminiClient;
//        this.aiWebClient = aiWebClient;
    }

    public String handleNewMessage(String input, UUID userId) {
        return "test";
//        List<Chat> historyEntities = chatRepository.findByUserIdOrderByTimestampAsc(userId);
//
//        List<ChatMessage> historyForAI = historyEntities.stream().map(chat -> {
//            try {
//                return objectMapper.readValue(chat.getMessage(), ChatMessage.class);
//            } catch (JsonProcessingException e) {
//                System.err.println("Failed to parse chat message from DB: " + e.getMessage());
//                return null;
//            }
//        }).filter(Objects::nonNull).collect((Collectors.toList()));
//
//        // Convert list to string for prompt
//        String historyAsString = historyForAI.stream()
//                .map(message -> message.getRole() + ": " + message.getContent())
//                .collect(Collectors.joining("\n"));
//
//        String fullPrompt = historyAsString + "\nUser: " + input;
//
//        GenerateContentResponse aiResponse = geminiClient.models.generateContent("gemini-2.5-flash", fullPrompt, null);
//
//        if (aiResponse == null) {
//            throw new RuntimeException("Error: Invalid response from AI model.");
//        }
//
//        try {
//            // save the user input and AI response into the db
//            Chat userMessage = new Chat();
//            userMessage.setUserId(userId);
//            userMessage.setMessage(objectMapper.writeValueAsString(new ChatMessage("user", input)));
//            chatRepository.save(userMessage);
//
//            Chat aiMessage = new Chat();
//            aiMessage.setUserId(userId);
//            aiMessage.setMessage(objectMapper.writeValueAsString(new ChatMessage("agent", aiResponse.text())));
//            chatRepository.save(aiMessage);
//
//        } catch (JsonProcessingException e) {
//            // This code runs if the conversion to a string fails
//            System.err.println("Error saving chat message to database: " + e.getMessage());
//            throw new RuntimeException("Could not process chat message", e);
//        }
//
//        System.out.println(aiResponse.text());
//        return aiResponse.text();
    }

    // For future use when we host our ai model as another service
//    public String handleNewMessage(String input, UUID userId) {
//        // Fetch chat history for this user
//        List<Chat> historyEntities = chatRepository.findByUserIdOrderByTimestampAsc(userId);
//
//        List<ChatMessage> historyForAI = historyEntities.stream().map(chat -> {
//            try {
//                return objectMapper.readValue(chat.getMessage(), ChatMessage.class);
//            } catch (JsonProcessingException e) {
//                System.err.println("Failed to parse chat message from DB: " + e.getMessage());
//                return null;
//            }
//        }).filter(Objects::nonNull).collect((Collectors.toList()));
//
//        AIRequest aiRequest = new AIRequest(historyForAI, input);
//
//        // Make the HTTP POST request and wait for the response
//        AIResponse aiResponse = aiWebClient.post()
//            .uri("/invoke") // The endpoint on your Python service
//            .bodyValue(aiRequest)
//            .retrieve() // Execute the request
//            .bodyToMono(AIResponse.class) // Expect a response of this type
//            .block(); // Wait for the response to arrive
//
//        if (aiResponse == null || aiResponse.getAgent() == null) {
//            throw new RuntimeException("Error: Invalid response from AI model.");
//        }
//
//        try {
//            // save the AI response appended to the chat history into the db
//            Chat userMessage = new Chat();
//            userMessage.setUserId(userId);
//            userMessage.setMessage(objectMapper.writeValueAsString(new ChatMessage("user", input)));
//            chatRepository.save(userMessage);
//
//            Chat aiMessage = new Chat();
//            aiMessage.setUserId(userId);
//            aiMessage.setMessage(objectMapper.writeValueAsString(new ChatMessage("agent", aiResponse.getAgent())));
//            chatRepository.save(aiMessage);
//
//        } catch (JsonProcessingException e) {
//            // This code runs if the conversion to a string fails
//            System.err.println("Error saving chat message to database: " + e.getMessage());
//            throw new RuntimeException("Could not process chat message", e);
//        }
//
//        return aiResponse.getAgent();
//    }

}
