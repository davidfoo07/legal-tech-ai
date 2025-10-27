package com.lawlink.backend_java.dto.Whatsapp;

import java.util.List;

public record Template (
        String name,
        Language language,
        List<Component> components
) {}

