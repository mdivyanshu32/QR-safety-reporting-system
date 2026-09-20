package com.safety.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "voice_transcripts")
public class VoiceTranscript {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "report_id", nullable = false)
    private Long reportId;

    @Lob
    @Column(name = "raw_transcript", columnDefinition = "LONGTEXT")
    private String rawTranscript;

    @Lob
    @Column(name = "structured_json", columnDefinition = "LONGTEXT")
    private String structuredJson;

    public VoiceTranscript() {}

    public VoiceTranscript(Long reportId, String rawTranscript, String structuredJson) {
        this.reportId = reportId;
        this.rawTranscript = rawTranscript;
        this.structuredJson = structuredJson;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getReportId() { return reportId; }
    public void setReportId(Long reportId) { this.reportId = reportId; }

    public String getRawTranscript() { return rawTranscript; }
    public void setRawTranscript(String rawTranscript) { this.rawTranscript = rawTranscript; }

    public String getStructuredJson() { return structuredJson; }
    public void setStructuredJson(String structuredJson) { this.structuredJson = structuredJson; }
}
