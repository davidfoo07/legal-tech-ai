package com.lawlink.backend_java.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.lawlink.backend_java.dto.Case.CaseReportDTO;
import com.lawlink.backend_java.dto.Case.PitchCaseDTO;
import com.lawlink.backend_java.dto.Chat.ChatHistoryReponse;
import com.lawlink.backend_java.dto.Chat.ChatMessage;
import com.lawlink.backend_java.dto.Chat.ChatReponse;
import com.lawlink.backend_java.dto.Chat.ChatRequest;
import com.lawlink.backend_java.entity.Chat;
import com.lawlink.backend_java.entity.User;
import com.lawlink.backend_java.repository.ChatRepository;
import com.lawlink.backend_java.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
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
    public ChatService(UserRepository userRepository, ChatRepository chatRepository,  ObjectMapper objectMapper , Client geminiClient, @Value("classpath:prompts/pitch_night_prompt.txt") Resource promptResource, CaseReportService caseReportService /* , WebClient aiWebClient*/) throws IOException {
        this.userRepository = userRepository;
        this.chatRepository = chatRepository;
        this.caseReportService = caseReportService;
        this.objectMapper = objectMapper;
        this.geminiClient = geminiClient;
        this.systemPrompt = new String(promptResource.getInputStream().readAllBytes());
//        this.aiWebClient = aiWebClient;
    }
    public ChatReponse handleNewMessage(ChatRequest chatRequest) throws Exception {

        User user = userRepository.findById(chatRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String userLanguage = user.getLanguage(); // e.g., "en", "zh", "de"

        String languageInstruction = "--- CONTEXT ---\n"
                + "The user's preferred language is: " + userLanguage + "\n"
                + "You MUST conduct the entire conversation in this language.\n"
                + "The final JSON report MUST be in English, but the human-readable summary (clientFacingSummary) MUST be in " + userLanguage + ".\n"
                + "--- END CONTEXT ---\n\n";

        List<Chat> historyEntities = chatRepository.findByUserUidOrderByCreatedAtAsc(chatRequest.getUserId());

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

        String fullPrompt = languageInstruction + systemPrompt
                + "\n\n--- Conversation History ---\n"
                + historyAsString
                + "\n\nUser: " + chatRequest.getInput();

        GenerateContentResponse aiResponse = geminiClient.models.generateContent("gemini-2.5-flash", fullPrompt, null);

        if (aiResponse == null || aiResponse.text() == null) {
            throw new RuntimeException("Error: Invalid response from AI model.");
        }

        if (isFinalReport(aiResponse.text())) {
            String jsonReport = extractJsonFromReport(aiResponse.text());

            System.out.println("--- RAW JSON FROM AI (BEFORE PARSING) ---");
            System.out.println(jsonReport);
            System.out.println("------------------------------------------");

            PitchCaseDTO caseReportDTO = objectMapper.readValue(jsonReport, PitchCaseDTO.class);

            caseReportService.createPitchCaseReport(caseReportDTO, user);

            String finalMessage = switch (userLanguage) {
                case "de" ->
                        "Vielen Dank. Ihre Fallzusammenfassung wurde übermittelt und wird in Kürze von unserem Rechtsteam geprüft.";
                case "zh" -> "谢谢您。您的案件摘要已提交，我们的法律团队将尽快审阅。";
                default ->
                        "Thank you. Your case summary has been submitted and will be reviewed by our legal team shortly.";
            };

            Chat userMessage = new Chat(user, objectMapper.writeValueAsString(new ChatMessage("user", chatRequest.getInput())));
            chatRepository.save(userMessage);

            Chat finalAssistantMessage = new Chat(user, objectMapper.writeValueAsString(new ChatMessage("assistant", finalMessage)));
            chatRepository.save(finalAssistantMessage);

            return new ChatReponse(finalMessage);

        } else {
            // save the user input and AI response into the db
            Chat userMessage = new Chat(user, objectMapper.writeValueAsString(new ChatMessage("user", chatRequest.getInput())));
            chatRepository.save(userMessage);

            Chat aiMessage = new Chat(user, objectMapper.writeValueAsString(new ChatMessage("assistant", aiResponse.text())));
            chatRepository.save(aiMessage);

            System.out.println(aiResponse.text());
            return new ChatReponse(aiResponse.text());

        }
    }

    private boolean isFinalReport(String text) {
        return text.trim().contains("<FINAL_REPORT>");
    }

    private String extractJsonFromReport(String text) {
        try {
            int startIndex = text.indexOf("{");
            int endIndex = text.lastIndexOf("}");
            if (startIndex != -1 && endIndex != -1) {
                return text.substring(startIndex, endIndex + 1);
            }
        } catch (Exception e) {
            // Handle cases where the extraction might fail
            System.err.println("Failed to extract JSON from final report: " + e.getMessage());
        }
        // Return the original text if extraction fails, to allow for debugging
        return text;
    }

    public List<ChatHistoryReponse> getChatHistory(UUID userId) {
        List<Chat> historyEntities = chatRepository.findByUserUidOrderByCreatedAtAsc(userId);

        return historyEntities.stream().map(chat -> {
            try {
                ChatMessage message = objectMapper.readValue(chat.getMessage(), ChatMessage.class);
                return new ChatHistoryReponse(
                        chat.getId(),
                        message.getRole(),
                        message.getContent(),
                        chat.getCreatedAt()
                );
            } catch (JsonProcessingException e) {
                System.err.println("Failed to parse chat message from DB: " + e.getMessage());
                return null;
            }
        }).filter(Objects::nonNull).collect((Collectors.toList()));
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
