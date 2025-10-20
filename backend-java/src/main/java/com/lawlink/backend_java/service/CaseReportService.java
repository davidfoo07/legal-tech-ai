package com.lawlink.backend_java.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lawlink.backend_java.dto.CaseReportDTO;
import com.lawlink.backend_java.entity.CaseReport;
import com.lawlink.backend_java.entity.User;
import com.lawlink.backend_java.enums.CaseStatus;
import com.lawlink.backend_java.repository.CaseReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public List<CaseReport> getAllCaseReports() {
        return caseReportRepository.findAll();
    }
}
