package com.safety.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "id_card_images")
public class IdCardImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "report_id", nullable = false)
    private Long reportId;

    @Lob
    @Column(name = "id_card_data", columnDefinition = "LONGTEXT")
    private String idCardData; // Base64 image data

    @Column(name = "file_type")
    private String fileType;

    public IdCardImage() {}

    public IdCardImage(Long reportId, String idCardData, String fileType) {
        this.reportId = reportId;
        this.idCardData = idCardData;
        this.fileType = fileType;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getReportId() { return reportId; }
    public void setReportId(Long reportId) { this.reportId = reportId; }

    public String getIdCardData() { return idCardData; }
    public void setIdCardData(String idCardData) { this.idCardData = idCardData; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
}
