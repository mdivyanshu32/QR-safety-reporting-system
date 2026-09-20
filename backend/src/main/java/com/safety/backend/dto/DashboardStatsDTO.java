package com.safety.backend.dto;

import java.util.Map;

public class DashboardStatsDTO {
    private long totalReports;
    private long nearMissCount;
    private long incidentCount;
    private long accidentCount;
    private long ppeCount;
    private long toolCount;

    private long openReports;
    private long closedReports;
    private long actionRequiredReports;

    private Map<String, Long> reportsByType;
    private Map<String, Long> reportsByDivision;
    private Map<String, Long> reportsByStatus;
    private Map<String, Long> reportsBySeverity;

    public DashboardStatsDTO() {}

    public long getTotalReports() { return totalReports; }
    public void setTotalReports(long totalReports) { this.totalReports = totalReports; }

    public long getNearMissCount() { return nearMissCount; }
    public void setNearMissCount(long nearMissCount) { this.nearMissCount = nearMissCount; }

    public long getIncidentCount() { return incidentCount; }
    public void setIncidentCount(long incidentCount) { this.incidentCount = incidentCount; }

    public long getAccidentCount() { return accidentCount; }
    public void setAccidentCount(long accidentCount) { this.accidentCount = accidentCount; }

    public long getPpeCount() { return ppeCount; }
    public void setPpeCount(long ppeCount) { this.ppeCount = ppeCount; }

    public long getToolCount() { return toolCount; }
    public void setToolCount(long toolCount) { this.toolCount = toolCount; }

    public long getOpenReports() { return openReports; }
    public void setOpenReports(long openReports) { this.openReports = openReports; }

    public long getClosedReports() { return closedReports; }
    public void setClosedReports(long closedReports) { this.closedReports = closedReports; }

    public long getActionRequiredReports() { return actionRequiredReports; }
    public void setActionRequiredReports(long actionRequiredReports) { this.actionRequiredReports = actionRequiredReports; }

    public Map<String, Long> getReportsByType() { return reportsByType; }
    public void setReportsByType(Map<String, Long> reportsByType) { this.reportsByType = reportsByType; }

    public Map<String, Long> getReportsByDivision() { return reportsByDivision; }
    public void setReportsByDivision(Map<String, Long> reportsByDivision) { this.reportsByDivision = reportsByDivision; }

    public Map<String, Long> getReportsByStatus() { return reportsByStatus; }
    public void setReportsByStatus(Map<String, Long> reportsByStatus) { this.reportsByStatus = reportsByStatus; }

    public Map<String, Long> getReportsBySeverity() { return reportsBySeverity; }
    public void setReportsBySeverity(Map<String, Long> reportsBySeverity) { this.reportsBySeverity = reportsBySeverity; }
}
