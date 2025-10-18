package com.lawlink.backend_java.chat;

import com.google.genai.Client;
import com.google.genai.types.HttpOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GeminiConfig {

    // This method runs once at startup to create the Gemini Client object.
    @Bean
    public Client geminiClient() {
        return Client.builder()
                .location("global")
                .vertexAI(true)
                .httpOptions(HttpOptions.builder().apiVersion("v1").build())
                .build();
    }
}