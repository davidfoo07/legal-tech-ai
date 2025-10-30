package com.lawlink.backend_java.dto.Whatsapp;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class WhatsappRequest {

    @JsonProperty("messaging_product")
    private String messagingProduct;

    @JsonProperty("recipient_type")
    String recipientType;

    @JsonProperty("to")
    private String phoneNumber;

    private String type;
    private Template template;

    // Constructor
    public WhatsappRequest(String messagingProduct, String recipientType, String phoneNumber, String type, Template template) {
        this.messagingProduct = messagingProduct;
        this.recipientType = recipientType;
        this.phoneNumber = phoneNumber;
        this.type = type;
        this.template = template;
    }

    // --- GETTERS (CRITICAL FOR SERIALIZATION) ---
    public String getMessagingProduct() { return messagingProduct; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getRecipientType() {
        return recipientType;
    }
    public String getType() { return type; }
    public Template getTemplate() { return template; }

    // Your static create method remains the same
    public static WhatsappRequest create(String caseTitle, String recipientName, String phoneNumber, String lawyerName, String firmName) {
        Parameter param1 = new Parameter("text", "recipient_name", recipientName);
        Parameter param2 = new Parameter("text", "lawyer_name", lawyerName);
        Parameter param3 = new Parameter("text","firm_name", firmName);
        Parameter param4 = new Parameter("text", "case_title", caseTitle);

        Component component = new Component("body", List.of(param1, param2, param3, param4));
        Language language = new Language("en");
        Template template = new Template("lawyer_booking_request", language, List.of(component));

        return new WhatsappRequest("whatsapp","individual", phoneNumber , "template", template);
    }
}

