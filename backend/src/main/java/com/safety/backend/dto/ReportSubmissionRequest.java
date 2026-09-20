package com.safety.backend.dto;

import java.util.List;

public class ReportSubmissionRequest {

    private String type; // TOOL, PPE, NEAR_MISS, INCIDENT, ACCIDENT
    private String employeeId;
    private String employeeName;
    private String employeePhone;
    private String date;
    private String time;
    private String location;
    private String division;
    private String subdivision;
    private String activity;
    private String description;
    private String severity; // LOW, MEDIUM, HIGH, CRITICAL

    // Tool
    private String toolType;
    private String problemType;

    // PPE
    private String ppeItem;
    private String issueType;

    // Near Miss
    private String potentialHazard;

    // Incident / Near Miss / Accident Shared
    private String immediateAction;
    private String equipmentInvolved;
    private Boolean injured;
    private Boolean workStopped;
    private String witnessDetails;

    // Accident Specific
    private Boolean injuryOccurred;
    private String bodyPart;
    private String injuryType;
    private Boolean firstAid;
    private Boolean hospitalRequired;

    // Images & Voice
    private String idCardImage; // Base64
    private List<String> evidenceImages; // List of Base64 strings
    private String rawVoiceTranscript;
    private String structuredVoiceJson;

    public ReportSubmissionRequest() {}

    // Getters and Setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getEmployeePhone() { return employeePhone; }
    public void setEmployeePhone(String employeePhone) { this.employeePhone = employeePhone; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDivision() { return division; }
    public void setDivision(String division) { this.division = division; }

    public String getSubdivision() { return subdivision; }
    public void setSubdivision(String subdivision) { this.subdivision = subdivision; }

    public String getActivity() { return activity; }
    public void setActivity(String activity) { this.activity = activity; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getToolType() { return toolType; }
    public void setToolType(String toolType) { this.toolType = toolType; }

    public String getProblemType() { return problemType; }
    public void setProblemType(String problemType) { this.problemType = problemType; }

    public String getPpeItem() { return ppeItem; }
    public void setPpeItem(String ppeItem) { this.ppeItem = ppeItem; }

    public String getIssueType() { return issueType; }
    public void setIssueType(String issueType) { this.issueType = issueType; }

    public String getPotentialHazard() { return potentialHazard; }
    public void setPotentialHazard(String potentialHazard) { this.potentialHazard = potentialHazard; }

    public String getImmediateAction() { return immediateAction; }
    public void setImmediateAction(String immediateAction) { this.immediateAction = immediateAction; }

    public String getEquipmentInvolved() { return equipmentInvolved; }
    public void setEquipmentInvolved(String equipmentInvolved) { this.equipmentInvolved = equipmentInvolved; }

    public Boolean getInjured() { return injured; }
    public void setInjured(Boolean injured) { this.injured = injured; }

    public Boolean getWorkStopped() { return workStopped; }
    public void setWorkStopped(Boolean workStopped) { this.workStopped = workStopped; }

    public String getWitnessDetails() { return witnessDetails; }
    public void setWitnessDetails(String witnessDetails) { this.witnessDetails = witnessDetails; }

    public Boolean getInjuryOccurred() { return injuryOccurred; }
    public void setInjuryOccurred(Boolean injuryOccurred) { this.injuryOccurred = injuryOccurred; }

    public String getBodyPart() { return bodyPart; }
    public void setBodyPart(String bodyPart) { this.bodyPart = bodyPart; }

    public String getInjuryType() { return injuryType; }
    public void setInjuryType(String injuryType) { this.injuryType = injuryType; }

    public Boolean getFirstAid() { return firstAid; }
    public void setFirstAid(Boolean firstAid) { this.firstAid = firstAid; }

    public Boolean getHospitalRequired() { return hospitalRequired; }
    public void setHospitalRequired(Boolean hospitalRequired) { this.hospitalRequired = hospitalRequired; }

    public String getIdCardImage() { return idCardImage; }
    public void setIdCardImage(String idCardImage) { this.idCardImage = idCardImage; }

    public List<String> getEvidenceImages() { return evidenceImages; }
    public void setEvidenceImages(List<String> evidenceImages) { this.evidenceImages = evidenceImages; }

    public String getRawVoiceTranscript() { return rawVoiceTranscript; }
    public void setRawVoiceTranscript(String rawVoiceTranscript) { this.rawVoiceTranscript = rawVoiceTranscript; }

    public String getStructuredVoiceJson() { return structuredVoiceJson; }
    public void setStructuredVoiceJson(String structuredVoiceJson) { this.structuredVoiceJson = structuredVoiceJson; }
}
