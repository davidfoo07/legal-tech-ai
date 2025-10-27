package com.lawlink.backend_java.controller;

import com.lawlink.backend_java.dto.Whatsapp.ContactRequest;
import com.lawlink.backend_java.service.WhatsappService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/v1/admin/whatsappApi")
public class WhatsappController {
    private WhatsappService whatsappService;

    @Autowired
    public WhatsappController(WhatsappService whatsappService) {
        this.whatsappService = whatsappService;
    }

    @PostMapping
    public void sendMessage(@RequestBody ContactRequest contactRequest) {
        whatsappService.sendMessage(contactRequest);

    }


}
