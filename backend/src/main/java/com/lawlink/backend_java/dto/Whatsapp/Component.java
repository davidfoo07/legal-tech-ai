package com.lawlink.backend_java.dto.Whatsapp;

import java.util.List;

public class Component {
    private String type;
    private List<Parameter> parameters;

    public Component(String type, List<Parameter> parameters) {
        this.type = type;
        this.parameters = parameters;
    }

    public String getType() {
        return type;
    }

    public List<Parameter> getParameters() {
        return parameters;
    }
}