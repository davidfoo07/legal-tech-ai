package com.lawlink.backend_java.dto.Case;

import com.lawlink.backend_java.enums.CasePriority;
import com.lawlink.backend_java.enums.CaseStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class CaseReportResponse {
    private UUID id;
    private UserDTO user;
    private CaseStatus status;
    private CasePriority priority;
    private BigDecimal amountInvolved;
    private LocalDateTime createdAt;
    private String report;

    @Getter
    @Setter
    public static class UserDTO {
        private UUID uid;
        private String email;
        private String phone;
        private String username;
        private String language;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public UUID getUid() {
            return uid;
        }

        public void setUid(UUID uid) {
            this.uid = uid;
        }

        public String getLanguage() {
            return language;
        }

        public void setLanguage(String language) {
            this.language = language;
        }
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public CaseStatus getStatus() {
        return status;
    }

    public void setStatus(CaseStatus status) {
        this.status = status;
    }

    public CasePriority getPriority() {
        return priority;
    }

    public void setPriority(CasePriority priority) {
        this.priority = priority;
    }

    public BigDecimal getAmountInvolved() {
        return amountInvolved;
    }

    public void setAmountInvolved(BigDecimal amountInvolved) {
        this.amountInvolved = amountInvolved;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getReport() {
        return report;
    }

    public void setReport(String report) {
        this.report = report;
    }
}