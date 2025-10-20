package com.lawlink.backend_java.controller;

import com.lawlink.backend_java.entity.CaseReport;
import com.lawlink.backend_java.service.CaseReportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/case-report")
public class CaseReportController {
    private final CaseReportService caseReportService;

    public CaseReportController(CaseReportService caseReportService) {
        this.caseReportService = caseReportService;
    }

    @GetMapping
    public List<CaseReport> getAllCaseReports() {
        return caseReportService.getAllCaseReports();
    }
}
