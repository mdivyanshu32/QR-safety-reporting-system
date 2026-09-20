package com.safety.backend.dto;

import com.safety.backend.model.CorrectiveAction;
import com.safety.backend.model.Report;

import java.util.List;

public class ReportResponseDTO {
    private Report report;
    private String idCardImage;
    private List<String> evidenceImages;
    private String rawVoiceTranscript;
    private String structuredVoiceJson;
    private CorrectiveAction correctiveAction;

    public ReportResponseDTO() {}

    public ReportResponseDTO(Report report, String idCardImage, List<String> evidenceImages, 
                             String rawVoiceTranscript, String structuredVoiceJson, CorrectiveAction correctiveAction) {
        this.report = report;
        this.idCardImage = idCardImage;
        this.evidenceImages = evidenceImages;
        this.rawVoiceTranscript = rawVoiceTranscript;
        this.structuredVoiceJson = structuredVoiceJson;
        this.correctiveAction = correctiveAction;
    }

    public Report getReport() { return report; }
    public void setReport(Report report) { this.report = report; }

    public String getIdCardImage() { return idCardImage; }
    public void setIdCardImage(String idCardImage) { this.idCardImage = idCardImage; }

    public List<String> getEvidenceImages() { return evidenceImages; }
    public void setEvidenceImages(List<String> evidenceImages) { this.evidenceImages = evidenceImages; }

    public String getRawVoiceTranscript() { return rawVoiceTranscript; }
    public void setRawVoiceTranscript(String rawVoiceTranscript) { this.rawVoiceTranscript = rawVoiceTranscript; }

    public String getStructuredVoiceJson() { return structuredVoiceJson; }
    public void setStructuredVoiceJson(String structuredVoiceJson) { this.structuredVoiceJson = structuredVoiceJson; }

    public CorrectiveAction getCorrectiveAction() { return correctiveAction; }
    public void setCorrectiveAction(CorrectiveAction correctiveAction) { this.correctiveAction = correctiveAction; }
}
