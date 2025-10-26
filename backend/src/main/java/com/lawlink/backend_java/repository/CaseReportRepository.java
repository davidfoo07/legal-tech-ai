package com.lawlink.backend_java.repository;

import com.lawlink.backend_java.dto.CaseReportResponse;
import com.lawlink.backend_java.entity.CaseReport;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CaseReportRepository extends JpaRepository<CaseReport, UUID> {
}
