package com.safety.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "report_number", unique = true, nullable = false)
    private String reportNumber;

    @Column(name = "type", nullable = false)
    private String type; // TOOL, PPE, NEAR_MISS, INCIDENT, ACCIDENT

    @Column(name = "employee_id")
    private String employeeId;

    @Column(name = "employee_name")
    private String employeeName;

    @Column(name = "employee_phone")
    private String employeePhone;

    @Column(name = "report_date")
    private String date;

    @Column(name = "report_time")
    private String time;

    @Column(name = "location")
    private String location;

    @Column(name = "division")
    private String division;

    @Column(name = "subdivision")
    private String subdivision;

    @Column(name = "activity")
    private String activity;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "severity")
    private String severity; // LOW, MEDIUM, HIGH, CRITICAL

    @Column(name = "status")
    private String status; // NEW, UNDER_REVIEW, ACTION_REQUIRED, ACTION_TAKEN, CLOSED

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Tool Specific
    private String toolType;
    private String problemType;

    // PPE Specific
    private String ppeItem;
    private String issueType;

    // Near Miss Specific
    @Column(length = 1000)
    private String potentialHazard;

    // Incident / Near Miss / Accident Shared
    @Column(length = 1000)
    private String immediateAction;
    private String equipmentInvolved;
    private Boolean injured;
    private Boolean workStopped;

    @Column(length = 1000)
    private String witnessDetails;

    // Accident Specific
    private Boolean injuryOccurred;
    private String bodyPart;
    private String injuryType;
    private Boolean firstAid;
    private Boolean hospitalRequired;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = "NEW";
        }
        if (severity == null) {
            severity = "MEDIUM";
        }
    }

    public Report() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReportNumber() { return reportNumber; }
    public void setReportNumber(String reportNumber) { this.reportNumber = reportNumber; }

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

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
}
