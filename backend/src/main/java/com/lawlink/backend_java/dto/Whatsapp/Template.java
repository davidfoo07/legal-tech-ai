package com.lawlink.backend_java.dto.Whatsapp;

import java.util.List;

public class Template {
    private String name;
    private Language language;
    private List<Component> components;

    public Template(String name, Language language, List<Component> components) {
        this.name = name;
        this.language = language;
        this.components = components;
    }

    public String getName() {
        return name;
    }

    public Language getLanguage() {
        return language;
    }

    public List<Component> getComponents() {
        return components;
    }
}