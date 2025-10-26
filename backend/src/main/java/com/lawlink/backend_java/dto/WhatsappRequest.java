package com.lawlink.backend_java.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

public record WhatsappRequest (
        @JsonProperty("messaging_product")
        String messagingProduct,
        String recipientPhoneNumber,
        String type,
        Template template
) {

    public static WhatsappRequest create(String caseTitle, String recipientName, String phoneNumber, String lawyerName, String firmName) {
        Parameter param1 = new Parameter("text", caseTitle);
        Parameter param2 = new Parameter("text", recipientName);
        Parameter param3 = new Parameter("text", phoneNumber);
        Parameter param4 = new Parameter("text", lawyerName);
        Parameter param5 = new Parameter("text", firmName);

        Component component = new Component("body", List.of(param1, param2, param3, param4, param5));

        Language language = new Language("en_US");

        Template template = new Template("lawyer_booking_request", language, List.of(component));

        return new WhatsappRequest("whatsapp", phoneNumber, lawyerName, template);


    }

}
