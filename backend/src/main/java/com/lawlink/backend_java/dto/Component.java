package com.lawlink.backend_java.dto;

import java.util.List;

public record Component(String type, List<Parameter> parameters) {
}
