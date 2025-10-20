package com.lawlink.backend_java.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.lawlink.backend_java.dto.CaseReportDTO;
import com.lawlink.backend_java.dto.ChatMessage;
import com.lawlink.backend_java.dto.ChatReponse;
import com.lawlink.backend_java.dto.ChatRequest;
import com.lawlink.backend_java.entity.CaseReport;
import com.lawlink.backend_java.entity.Chat;
import com.lawlink.backend_java.entity.User;
import com.lawlink.backend_java.repository.CaseReportRepository;
import com.lawlink.backend_java.repository.ChatRepository;
import com.lawlink.backend_java.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;


@Service
public class ChatService {
    private final UserRepository userRepository;
    private final ChatRepository chatRepository;
    private final ObjectMapper objectMapper;
    private final Client geminiClient;
    private final String systemPrompt;
    private final CaseReportService caseReportService;
//    private final WebClient aiWebClient;



    @Autowired
    public ChatService(UserRepository userRepository, ChatRepository chatRepository,  ObjectMapper objectMapper , Client geminiClient, @Value("classpath:prompts/chatbot_prompt.txt") Resource promptResource, CaseReportService caseReportService /* , WebClient aiWebClient*/) throws IOException {
        this.userRepository = userRepository;
        this.chatRepository = chatRepository;
        this.caseReportService = caseReportService;
        this.objectMapper = objectMapper;
        this.geminiClient = geminiClient;
        this.systemPrompt = new String(promptResource.getInputStream().readAllBytes());
//        this.aiWebClient = aiWebClient;
    }

    public ChatReponse handleNewMessage(ChatRequest chatRequest) throws Exception {
        User user = userRepository.findById(chatRequest.getUser().getUid())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Chat> historyEntities = chatRepository.findByUserUidOrderByTimestampAsc(chatRequest.getUser().getUid());

        List<ChatMessage> historyForAI = historyEntities.stream().map(chat -> {
            try {
                return objectMapper.readValue(chat.getMessage(), ChatMessage.class);
            } catch (JsonProcessingException e) {
                System.err.println("Failed to parse chat message from DB: " + e.getMessage());
                return null;
            }
        }).filter(Objects::nonNull).collect((Collectors.toList()));

        // Convert list to string for prompt
        String historyAsString = historyForAI.stream()
                .map(message -> message.getRole() + ": " + message.getContent())
                .collect(Collectors.joining("\n"));

        String fullPrompt = systemPrompt
                + "\n\n--- Conversation History ---\n"
                + historyAsString
                + "\n\nUser: " + chatRequest.getInput();

        GenerateContentResponse aiResponse = geminiClient.models.generateContent("gemini-2.5-flash", fullPrompt, null);

        if (aiResponse == null || aiResponse.text() == null) {
            throw new RuntimeException("Error: Invalid response from AI model.");
        }

        if (isFinalReport(aiResponse.text())) {
            CaseReportDTO caseReportDTO = objectMapper.readValue(aiResponse.text(), CaseReportDTO.class);

            caseReportService.createCaseReport(caseReportDTO, user);

            String finalMessage = "Thank you. Your case summary has been submitted and will be reviewed by our legal team shortly.";

            Chat finalChat = new Chat(user, objectMapper.writeValueAsString(new ChatMessage("agent", finalMessage)));
            chatRepository.save(finalChat);

            return new ChatReponse(finalMessage);

        } else {
            // save the user input and AI response into the db
            Chat userMessage = new Chat(user, objectMapper.writeValueAsString(new ChatMessage("user", chatRequest.getInput())));
            chatRepository.save(userMessage);

            Chat aiMessage = new Chat(user, objectMapper.writeValueAsString(new ChatMessage("agent", aiResponse.text())));
            chatRepository.save(aiMessage);

            System.out.println(aiResponse.text());
            return new ChatReponse(aiResponse.text());

        }
    }

    private boolean isFinalReport(String text) {
        // A simple check to see if the response is a JSON object matching our structure
        return text.trim().startsWith("{") && text.contains("\"clientInfo\"");
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
