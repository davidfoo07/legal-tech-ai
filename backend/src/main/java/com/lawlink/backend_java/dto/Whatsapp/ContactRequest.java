package com.lawlink.backend_java.dto.Whatsapp;

public class ContactRequest {
    private String phoneNumber;
    private String firmName;
    private String lawyerName;
    private String recipientName;
    private String caseTitle;


    public ContactRequest(String caseTitle, String recipientName, String lawyerName, String firmName, String phoneNumber) {
        this.caseTitle = caseTitle;
        this.recipientName = recipientName;
        this.lawyerName = lawyerName;
        this.firmName = firmName;
        this.phoneNumber = phoneNumber;
    }

    public String getLawyerName() {
        return lawyerName;
    }

    public void setLawyerName(String lawyerName) {
        this.lawyerName = lawyerName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getCaseTitle() {
        return caseTitle;
    }

    public void setCaseTitle(String caseTitle) {
        this.caseTitle = caseTitle;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getFirmName() {
        return firmName;
    }

    public void setFirmName(String firmName) {
        this.firmName = firmName;
    }
}
