package com.lawlink.backend_java.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.lawlink.backend_java.enums.CasePriority;

import java.math.BigDecimal;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CaseReportDTO {
    public ClientInfo clientInfo;
    public EmploymentDetails employmentDetails;
    public CaseDetails caseDetails;
    public Damages damages;
    public Evidence evidence;

    // Nested classes that match the JSON structure
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ClientInfo {
        public String fullName;
        public String email;
        public String phone;
    }
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class EmploymentDetails {
        public String employerName;
        public String jobTitle;
        public String startDate;
        public String endDate;
    }
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CaseDetails {
        public String caseType;
        public CasePriority priority;
        public String incidentSummary;
        public List<String> keyFacts;
    }
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Damages {
        public BigDecimal estimatedAmount;
        public String desiredOutcome;
    }
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Evidence {
        public List<String> documentsMentioned;
    }
}