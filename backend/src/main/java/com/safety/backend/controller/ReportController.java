package com.safety.backend.controller;

import com.safety.backend.dto.ReportResponseDTO;
import com.safety.backend.dto.ReportSubmissionRequest;
import com.safety.backend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ResponseEntity<ReportResponseDTO> submitReport(@RequestBody ReportSubmissionRequest request) {
        ReportResponseDTO response = reportService.createReport(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ReportResponseDTO>> getReports(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String division) {
        List<ReportResponseDTO> reports = reportService.getAllReports(type, status, division);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/{number}")
    public ResponseEntity<ReportResponseDTO> getReportByNumber(@PathVariable String number) {
        return reportService.getReportByNumber(number)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
