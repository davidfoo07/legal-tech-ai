package com.lawlink.backend_java.entity;

import com.lawlink.backend_java.enums.CasePriority;
import com.lawlink.backend_java.enums.CaseStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name="case_report")
public class CaseReport {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="userId", nullable=false)
    private User user;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition="jsonb")
    private String report;

    @Enumerated(EnumType.STRING)
    private CaseStatus status;

    @Enumerated(EnumType.STRING)
    private CasePriority priority;

    @Column(precision = 12, scale = 2)
    private BigDecimal amount;

    @CreationTimestamp
    private LocalDateTime timestamp;

    public CaseReport() {}

    public CaseReport(User user, String report) {
        this.user = user;
        this.report = report;
    }

    public User getUser() {
        return user;
    }


    public void setUser(User user) {
        this.user = user;
    }

    public String getReport() {
        return report;
    }

    public void setReport(String report) {
        this.report = report;
    }

    public CaseStatus getStatus() {
        return status;
    }

    public void setStatus(CaseStatus status) {
        this.status = status;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public CasePriority getPriority() {
        return priority;
    }

    public void setPriority(CasePriority priority) {
        this.priority = priority;
    }
}
