package com.lawlink.backend_java.controller;

import com.lawlink.backend_java.dto.CaseReportResponse;
import com.lawlink.backend_java.entity.CaseReport;
import com.lawlink.backend_java.service.CaseReportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "api/v1/admin/case-reports")
public class CaseReportController {
    private final CaseReportService caseReportService;

    public CaseReportController(CaseReportService caseReportService) {
        this.caseReportService = caseReportService;
    }

    @GetMapping
    public List<CaseReportResponse> getAllCaseReports() {
        return caseReportService.getAllCaseReports();
    }

    @GetMapping
    public CaseReportResponse getCaseReportById(@RequestParam("id") UUID id) {
        return caseReportService.getCaseReportById(id);
    }
}
