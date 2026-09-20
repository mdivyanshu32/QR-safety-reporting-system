package com.safety.backend.service;

import com.safety.backend.dto.ReportResponseDTO;
import com.safety.backend.dto.ReportSubmissionRequest;
import com.safety.backend.model.*;
import com.safety.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final ReportImageRepository reportImageRepository;
    private final IdCardImageRepository idCardImageRepository;
    private final VoiceTranscriptRepository voiceTranscriptRepository;
    private final CorrectiveActionRepository correctiveActionRepository;

    private static final AtomicLong counter = new AtomicLong(100);

    @Autowired
    public ReportService(ReportRepository reportRepository,
                         ReportImageRepository reportImageRepository,
                         IdCardImageRepository idCardImageRepository,
                         VoiceTranscriptRepository voiceTranscriptRepository,
                         CorrectiveActionRepository correctiveActionRepository) {
        this.reportRepository = reportRepository;
        this.reportImageRepository = reportImageRepository;
        this.idCardImageRepository = idCardImageRepository;
        this.voiceTranscriptRepository = voiceTranscriptRepository;
        this.correctiveActionRepository = correctiveActionRepository;
    }

    @Transactional
    public ReportResponseDTO createReport(ReportSubmissionRequest request) {
        Report report = new Report();
        String prefix = getPrefixForType(request.getType());
        String year = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy"));
        Long nextId = reportRepository.getMaxId();
        long num = (nextId == null ? 1 : nextId + 1);
        String reportNumber = String.format("%s-%s-%04d", prefix, year, num);

        report.setReportNumber(reportNumber);
        report.setType(request.getType() != null ? request.getType().toUpperCase() : "NEAR_MISS");
        report.setEmployeeId(request.getEmployeeId());
        report.setEmployeeName(request.getEmployeeName());
        report.setEmployeePhone(request.getEmployeePhone());
        report.setDate(request.getDate() != null ? request.getDate() : LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE));
        report.setTime(request.getTime() != null ? request.getTime() : LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));
        report.setLocation(request.getLocation() != null ? request.getLocation() : "Unspecified Station");
        report.setDivision(request.getDivision() != null ? request.getDivision() : "Central Zone");
        report.setSubdivision(request.getSubdivision());
        report.setActivity(request.getActivity());
        report.setDescription(request.getDescription());
        report.setSeverity(request.getSeverity() != null ? request.getSeverity().toUpperCase() : "MEDIUM");
        report.setStatus("NEW");

        // Specific fields
        report.setToolType(request.getToolType());
        report.setProblemType(request.getProblemType());
        report.setPpeItem(request.getPpeItem());
        report.setIssueType(request.getIssueType());
        report.setPotentialHazard(request.getPotentialHazard());
        report.setImmediateAction(request.getImmediateAction());
        report.setEquipmentInvolved(request.getEquipmentInvolved());
        report.setInjured(request.getInjured());
        report.setWorkStopped(request.getWorkStopped());
        report.setWitnessDetails(request.getWitnessDetails());
        report.setInjuryOccurred(request.getInjuryOccurred());
        report.setBodyPart(request.getBodyPart());
        report.setInjuryType(request.getInjuryType());
        report.setFirstAid(request.getFirstAid());
        report.setHospitalRequired(request.getHospitalRequired());

        Report savedReport = reportRepository.save(report);

        // ID Card
        String savedIdCard = null;
        if (request.getIdCardImage() != null && !request.getIdCardImage().isBlank()) {
            IdCardImage idCard = new IdCardImage(savedReport.getId(), request.getIdCardImage(), "image/png");
            idCardImageRepository.save(idCard);
            savedIdCard = request.getIdCardImage();
        }

        // Evidence Images
        List<String> savedEvidence = new ArrayList<>();
        if (request.getEvidenceImages() != null) {
            for (String imgData : request.getEvidenceImages()) {
                if (imgData != null && !imgData.isBlank()) {
                    ReportImage img = new ReportImage(savedReport.getId(), imgData, "image/jpeg");
                    reportImageRepository.save(img);
                    savedEvidence.add(imgData);
                }
            }
        }

        // Voice Transcript
        String rawVoice = request.getRawVoiceTranscript();
        String structJson = request.getStructuredVoiceJson();
        if ((rawVoice != null && !rawVoice.isBlank()) || (structJson != null && !structJson.isBlank())) {
            VoiceTranscript vt = new VoiceTranscript(savedReport.getId(), rawVoice, structJson);
            voiceTranscriptRepository.save(vt);
        }

        return new ReportResponseDTO(savedReport, savedIdCard, savedEvidence, rawVoice, structJson, null);
    }

    public List<ReportResponseDTO> getAllReports(String type, String status, String division) {
        List<Report> reports;
        if (type != null && !type.isBlank()) {
            reports = reportRepository.findByTypeOrderByCreatedAtDesc(type.toUpperCase());
        } else if (status != null && !status.isBlank()) {
            reports = reportRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase());
        } else if (division != null && !division.isBlank()) {
            reports = reportRepository.findByDivisionOrderByCreatedAtDesc(division);
        } else {
            reports = reportRepository.findAllByOrderByCreatedAtDesc();
        }

        List<ReportResponseDTO> result = new ArrayList<>();
        for (Report r : reports) {
            result.add(getReportDetails(r));
        }
        return result;
    }

    public Optional<ReportResponseDTO> getReportByNumber(String reportNumber) {
        return reportRepository.findByReportNumber(reportNumber).map(this::getReportDetails);
    }

    public Optional<ReportResponseDTO> getReportById(Long id) {
        return reportRepository.findById(id).map(this::getReportDetails);
    }

    private ReportResponseDTO getReportDetails(Report report) {
        String idCard = idCardImageRepository.findByReportId(report.getId())
                .map(IdCardImage::getIdCardData).orElse(null);

        List<String> evidence = reportImageRepository.findByReportId(report.getId())
                .stream().map(ReportImage::getImageData).toList();

        Optional<VoiceTranscript> vtOpt = voiceTranscriptRepository.findByReportId(report.getId());
        String rawVoice = vtOpt.map(VoiceTranscript::getRawTranscript).orElse(null);
        String structJson = vtOpt.map(VoiceTranscript::getStructuredJson).orElse(null);

        CorrectiveAction action = correctiveActionRepository.findByReportId(report.getId()).orElse(null);

        return new ReportResponseDTO(report, idCard, evidence, rawVoice, structJson, action);
    }

    private String getPrefixForType(String type) {
        if (type == null) return "NM";
        switch (type.toUpperCase()) {
            case "TOOL": return "TOOL";
            case "PPE": return "PPE";
            case "INCIDENT": return "INC";
            case "ACCIDENT": return "ACC";
            case "NEAR_MISS":
            default: return "NM";
        }
    }
}
