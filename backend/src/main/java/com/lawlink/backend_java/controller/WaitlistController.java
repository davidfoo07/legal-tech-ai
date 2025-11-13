package com.lawlink.backend_java.controller;

import com.lawlink.backend_java.entity.Waitlist;
import com.lawlink.backend_java.service.WaitlistService;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/waitlist")
public class WaitlistController {

    private final WaitlistService waitlistService;

    @Autowired
    public WaitlistController(WaitlistService waitlistService) {
        this.waitlistService = waitlistService;
    }

    @PostMapping(path = "/signup-newsletter")
    public Waitlist signupNewsletter(@RequestBody String email) {
        return waitlistService.signUpNewsletter(email);
    }

    @GetMapping(path = "/get-all-waitlists")
    public List<Waitlist> getAllWaitlists() {
        return waitlistService.getAllWaitlists();
    }
}
