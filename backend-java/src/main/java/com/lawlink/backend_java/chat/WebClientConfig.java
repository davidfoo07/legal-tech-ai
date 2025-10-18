package com.lawlink.backend_java.chat;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;


@Configuration
public class WebClientConfig {

    @Bean
    public WebClient aiWebClient() {
        return WebClient.builder().baseUrl("http://localhost:8082").build();
    }
}
