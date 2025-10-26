package com.lawlink.backend_java.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lawlink.backend_java.dto.CaseReportDTO;
import com.lawlink.backend_java.dto.CaseReportResponse;
import com.lawlink.backend_java.entity.CaseReport;
import com.lawlink.backend_java.entity.User;
import com.lawlink.backend_java.enums.CaseStatus;
import com.lawlink.backend_java.repository.CaseReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.stream.Collectors;

import java.util.List;

@Service
public class CaseReportService {
    private final CaseReportRepository caseReportRepository;
    private final ObjectMapper objectMapper;

    @Autowired
    public CaseReportService(CaseReportRepository caseReportRepository, ObjectMapper objectMapper) {
        this.caseReportRepository = caseReportRepository;
        this.objectMapper = objectMapper;
    }

    public void createCaseReport(CaseReportDTO dto, User user) throws JsonProcessingException {
        CaseReport caseReport = new CaseReport();
        caseReport.setUser(user);
        caseReport.setStatus(CaseStatus.NEW);
        caseReport.setPriority(dto.caseDetails.priority);
        caseReport.setAmount(dto.damages.estimatedAmount);
        caseReport.setReport(objectMapper.writeValueAsString(dto));

        caseReportRepository.save(caseReport);
    }

    public List<CaseReportResponse> getAllCaseReports() {
        return caseReportRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Helper method to map the entity to the DTO
    private CaseReportResponse convertToDto(CaseReport caseReport) {
        CaseReportResponse dto = new CaseReportResponse();
        dto.setId(caseReport.getId());
        dto.setStatus(caseReport.getStatus());
        dto.setPriority(caseReport.getPriority());
        dto.setAmountInvolved(caseReport.getAmount());
        dto.setCreatedAt(caseReport.getCreatedAt());
        dto.setReport(caseReport.getReport());

        // This triggers the lazy-loading safely within the service
        User user = caseReport.getUser();
        CaseReportResponse.UserDTO userDto = new CaseReportResponse.UserDTO();
        userDto.setUid(user.getUid());
        userDto.setEmail(user.getEmail());
        userDto.setPhone(user.getPhone());
        userDto.setUsername(user.getUsername());

        dto.setUser(userDto);
        return dto;
    }

    public CaseReportResponse getCaseReportById(UUID id) {
        return caseReportRepository.findByCaseId(id);
    }
}
