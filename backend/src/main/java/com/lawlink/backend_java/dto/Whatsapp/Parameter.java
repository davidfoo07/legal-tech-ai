package com.lawlink.backend_java.dto.Whatsapp;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Parameter {
    private String type;

    @JsonProperty("parameter_name")
    private String parameterName;
    private String text;

    public Parameter(String type, String parameterName, String text) {
        this.type = type;
        this.parameterName = parameterName;
        this.text = text;
    }

    public String getType() {
        return type;
    }

    public String getParameterName() {
        return parameterName;
    }

    public String getText() {
        return text;
    }
}