package com.lawlink.backend_java.service;

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

    @Autowired
    public WhatsappService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void sendMessage(ContactRequest contactRequest) {
        String url = "https://graph.facebook.com/v22.0/" + WHATSAPP_PHONE_NUMBER_ID + "/messages";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(WHATSAPP_API_TOKEN);

        WhatsappRequest requestBody = WhatsappRequest.create(contactRequest.getCaseTitle(), contactRequest.getRecipientName(), contactRequest.getPhone(), contactRequest.getLawyerName(), contactRequest.getFirmName());

        HttpEntity<WhatsappRequest> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Successfully sent Whatsapp message to {}. Response: {}",
                        contactRequest.getPhone(), response.getBody());
            } else {
                log.warn("Received non-OK response from WhatsApp: {}", response.getStatusCode());
            }
        } catch (RestClientException e) {
                log.error("Error sending Whatsapp message to {}. Response: {}",
                        contactRequest.getPhone(), e.getMessage());
                throw new RuntimeException("Failed to send WhatsApp message", e);
            }

    }
}
