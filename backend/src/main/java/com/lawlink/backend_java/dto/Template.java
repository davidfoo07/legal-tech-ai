package com.lawlink.backend_java.dto;

import org.apache.commons.codec.language.bm.Lang;

import java.util.List;

public record Template (
        String name,
        Language language,
        List<Component> components
) {}

