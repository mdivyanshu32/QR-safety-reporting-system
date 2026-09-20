package com.safety.backend.dto;

public class CorrectiveActionRequest {
    private String status; // NEW, UNDER_REVIEW, ACTION_REQUIRED, ACTION_TAKEN, CLOSED
    private String rootCause;
    private String correctiveAction;
    private String preventiveAction;
    private String remarks;
    private String updatedBy;

    public CorrectiveActionRequest() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRootCause() { return rootCause; }
    public void setRootCause(String rootCause) { this.rootCause = rootCause; }

    public String getCorrectiveAction() { return correctiveAction; }
    public void setCorrectiveAction(String correctiveAction) { this.correctiveAction = correctiveAction; }

    public String getPreventiveAction() { return preventiveAction; }
    public void setPreventiveAction(String preventiveAction) { this.preventiveAction = preventiveAction; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
}
