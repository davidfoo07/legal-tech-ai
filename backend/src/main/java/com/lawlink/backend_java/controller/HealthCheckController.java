package com.lawlink.backend_java.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheckController {
    @GetMapping("/")
    public String healthCheck() {
        System.out.println("Tomcat started on port 8081");
        return "Application is up and running ";
    }
}
