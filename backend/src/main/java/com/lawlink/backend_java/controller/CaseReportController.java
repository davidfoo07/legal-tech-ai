package com.lawlink.backend_java.controller;

import com.lawlink.backend_java.dto.Case.CaseReportResponse;
import com.lawlink.backend_java.service.CaseReportService;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping(path = "/{id}")
    public CaseReportResponse getCaseReportById(@PathVariable UUID id) {
        return caseReportService.getCaseReportById(id);
    }
}
