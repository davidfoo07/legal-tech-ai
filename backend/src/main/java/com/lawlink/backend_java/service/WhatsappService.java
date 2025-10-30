package com.lawlink.backend_java.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lawlink.backend_java.dto.Whatsapp.ContactRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.lawlink.backend_java.dto.Whatsapp.WhatsappRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class WhatsappService {
    private static final Logger log = LoggerFactory.getLogger(WhatsappService.class);

    @Value("${whatsapp.phone.number.id}")
    private String WHATSAPP_PHONE_NUMBER_ID;

    @Value("${whatsapp.api.token}")
    private String WHATSAPP_API_TOKEN;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Autowired
    public WhatsappService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public void sendMessage(ContactRequest contactRequest) {
        String url = "https://graph.facebook.com/v22.0/" + WHATSAPP_PHONE_NUMBER_ID + "/messages";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(WHATSAPP_API_TOKEN);

        // 1. Get the phone number
        String phoneNumber = contactRequest.getPhoneNumber();

        // 2. Add the "+" if it's missing
        if (phoneNumber != null && !phoneNumber.startsWith("+")) {
            phoneNumber = "+" + phoneNumber;
        }

        // 4. Create the DTO as usual
        WhatsappRequest requestBody = WhatsappRequest.create(
                contactRequest.getCaseTitle(),
                contactRequest.getRecipientName(),
                phoneNumber,
                contactRequest.getLawyerName(),
                contactRequest.getFirmName()
        );

        try {
            // 5. Convert the DTO to a JSON String YOURSELF
            String jsonPayload = objectMapper.writeValueAsString(requestBody);

            // 6. Log the string you are about to send
            log.info("Sending to WhatsApp: {}", jsonPayload);

            // 7. Create an HttpEntity with the STRING, not the DTO object
            HttpEntity<String> entity = new HttpEntity<>(jsonPayload, headers);

            // 8. Post the entity. This now sends the raw string.
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Successfully sent Whatsapp message to {}. Response: {}",
                        contactRequest.getPhoneNumber(), response.getBody());
            } else {
                log.warn("Received non-OK response from WhatsApp: {}", response.getStatusCode());
            }
        } catch (Exception e) { // Catching generic Exception to get writeValueAsString
            log.error("Error sending Whatsapp message to {}. Response: {}",
                    contactRequest.getPhoneNumber(), e.getMessage());
            throw new RuntimeException("Failed to send WhatsApp message", e);
        }
    }
}
