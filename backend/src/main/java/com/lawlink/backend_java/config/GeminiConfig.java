package com.lawlink.backend_java.config;

import com.google.genai.Client;
import com.google.genai.types.HttpOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GeminiConfig {

    @Value("${spring.profiles.active}")
    private String activeProfile;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${google.project.id}")
    private String googleCloudProject;

    @Value("${google.cloud.location}")
    private String googleCloudLocation;

    @Value("${google.genai.use.vertex}")
    private boolean useVertex;

    @Bean
    public Client geminiClient() {
        if (activeProfile.equals("dev")) {
            return Client.builder()
                    .apiKey(apiKey)
                    .build();
        } else {
            return Client.builder()
                    .project(googleCloudProject)
                    .location(googleCloudLocation)
                    .vertexAI(useVertex)
                    .httpOptions(HttpOptions.builder().apiVersion("v1").build())
                    .build();
        }
    }
}